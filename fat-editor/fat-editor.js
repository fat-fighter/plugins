//Make bold on click for empty node
//Make selection to retain


$.fn.extend({
    fatEditor : function() {
        $(this).each(function() {
            var fatEditor = $(this);
            var iframeNode = fatEditor.find('.fat-editor-content iframe')[0];
            var contentDocument = iframeNode.contentDocument;
            var contentBody = contentDocument.body;

            var selection, anchorNode, parentNode, nodeName,  parentNodeName;

            fatEditor.find('[data-class=style] button').on('click', function() {

                switch ($(this).attr('data-type')) {
                    case "bold" :
                        changeIframeStyling(iframeNode, "fontWeight", 700);
                        break;
                    case "underline" :
                        changeIframeStyling(iframeNode, "textDecoration", "underline");
                        break;
                    case "italic" :
                        changeIframeStyling(iframeNode, "fontStyle", "italic");
                        break;
                    case "superscript" :
                        changeIframeStyling(iframeNode, "verticalAlign", "super");
                        changeIframeStyling(iframeNode, "fontSize", ".8em");
                        break;
                }

            });

            fatEditor.find('[data-class=style] select').on('change', function() {

                switch ($(this).attr('data-type')) {
                    case "font-family" :
                        changeIframeStyling(iframeNode, "fontFamily", $(this).val());
                        break;
                    case "font-size" :
                        changeIframeStyling(iframeNode, "fontSize", $(this).val() + "px");
                        break;
                }

            });
        });
    }
});

/* -------------------- IFRAME FUNCTIONS -------------------- */

function changeIframeStyling(iframeNode, style, value) {

    var selection = iframeNode.contentDocument.getSelection();
    var result = checkWrapping(selection, style, value);

    if (result[1]) {
        unwrapSelection(result[0][0], result[0][1], selection, style, value);
    }
    else {
        wrapSelection(result[0][0], result[0][1], selection, style, value);
    }

    iframeNode.contentDocument.body.normalize();
    //normalizeSpans(iframeNode.contentDocument);
    checkTextStyling(iframeNode.contentDocument, iframeNode);
}

function checkTextStyling(iframeDocument, iframeNode) {

    var fatEditorToolbar = $(iframeNode).parent().parent().find('.fat-editor-toolbar');
    var styles = ["fontWeight"];
    var values = [700];

    for (var i = 0; i < styles.length; i++) {
        if (checkWrapping(iframeDocument.getSelection(), styles[i], values[i])[1]) {
            fatEditorToolbar.find('div[data-type=style] button[data-value=bold]').css('background-color', '#ddddf0');
        }
        else {
            fatEditorToolbar.find('div[data-type=style] button[data-value=bold]').css('background-color', '#ffffff');
        }
    }
}

/* -------------------- CHECK WRAPPING -------------------- */

function checkWrapping(selection, style, value) {
    var middleNodes = selectAllNodes(selection.anchorNode, selection.focusNode);
    if (selection.anchorNode == selection.focusNode) {
        if (selection.anchorOffset > selection.focusOffset) {
            middleNodes[1] = false;
        }
    }

    var wrapping = true;

    if (selection.anchorNode.nodeName != "BODY" && selection.focusNode.nodeName != "BODY") {
        wrapping = (selection.anchorNode.parentNode.style[style] == value && selection.focusNode.parentNode.style[style] == value);
    }

    var len = middleNodes[0].length, i = 0;
    while (i < len && wrapping) {
        wrapping = (middleNodes[0][i].parentNode.style[style] == value);
        i++;
    }

    return [middleNodes, wrapping];
}

function normalizeSpans(iframeDocument) {
    var spanNodes = iframeDocument.getElementsByTagName('span');
    for (var i = 0; i < spanNodes.length; i++) {
        if (spanNodes[i].nextSibling == spanNodes[i+1]) {
            alert(spanNodes[i].style == spanNodes[i+1].style);
            spanNodes[i].innerHTML += spanNodes[i+1].innerHTML;
            $(spanNodes[i+1]).remove();
        }
    }
}

/* --------------------  UNWRAP  -------------------- */

function unwrapSelection(node_array, order, selection, style, value) {
    var len = node_array.length;
    for (var i = 0; i < len; i++) {
        unwrapNode(node_array[i], style, value);
    }

    var a, b, offset_a, offset_b;
    if (order) {
        a = selection.anchorNode;
        b = selection.focusNode;

        offset_a = selection.anchorOffset;
        offset_b = selection.focusOffset;
    }
    else {
        a = selection.focusNode;
        b = selection.anchorNode;

        offset_a = selection.focusOffset;
        offset_b = selection.anchorOffset;
    }

    if (a.nodeName != "BODY" && b.nodeName != "BODY") {
        if (a != b) {
            unwrapRange(a, offset_a, null, style, value);
            unwrapRange(b, null, offset_b, style, value);
        }
        else {
            unwrapRange(a, offset_a, offset_b, style, value);
        }
    }
}

function unwrapRange(node, offset_a, offset_b, style, value) {
    if (offset_a == null) {
        offset_a = 0;
    }
    if (offset_b == null) {
        offset_b = node.textContent.length;
    }

    if (node.textContent == "") { return; }

    var range = document.createRange();

    var spanRange = document.createRange();
    spanRange.setStart(node, offset_a);
    spanRange.setEnd(node, offset_b);

    if (node.textContent == spanRange.toString()) {
        unwrapNode(node, style, value);
    }
    else {
        if (node.parentNode.nodeName == "SPAN" && node.parentNode.style[style] == value) {
            var span, range_a = document.createRange(), range_b = document.createRange(), right = true;

            range_a.setStartBefore(node);
            range_a.setEnd(node, offset_a);

            range_b.setStart(node, offset_b);
            range_b.setEndAfter(node);

            if (range_a.toString() != "") {
                if (range_b.toString() != "") {
                    span = node.parentNode.cloneNode(false);
                    span.innerHTML = range_b.toString();
                    range.setEndAfter(node.parentNode);
                    range.insertNode(span);
                    range_b.deleteContents();
                }
                right = true;
            }
            else {
                right = false;
            }

            if (right) {
                range.setStartAfter(node.parentNode);
                range.setEndAfter(node.parentNode);
            }
            else {
                range.setStartBefore(node.parentNode);
                range.setEndBefore(node.parentNode);
            }

            span = node.parentNode.cloneNode(false);
            span.style[style] = "";
            if (span.style.length > 0) {
                span.innerHTML = spanRange.toString();
                range.insertNode(span);
            }
            else {
                range.insertNode(document.createTextNode(spanRange.toString()));
            }

            spanRange.deleteContents();
        }
    }
}

function unwrapNode(node, style, value) {
    var parent = node.parentNode;
    if (parent.nodeName == "SPAN" && parent.style[style] == value) {
        parent.style[style] = "";
        if (parent.style.length == 0) {
            $(node).unwrap();
        }
    }
}

/* -------------------- WRAP -------------------- */

function wrapSelection(node_array, order, selection, style, value) {
    var len = node_array.length;
    for (var i = 0; i < len; i++) {
        wrapNode(node_array[i], style, value);
    }

    var a, b, offset_a, offset_b;
    if (order) {
        a = selection.anchorNode;
        b = selection.focusNode;

        offset_a = selection.anchorOffset;
        offset_b = selection.focusOffset;
    }
    else {
        a = selection.focusNode;
        b = selection.anchorNode;

        offset_a = selection.focusOffset;
        offset_b = selection.anchorOffset;
    }

    if (a.nodeName != "BODY" && b.nodeName != "BODY") {
        if (a != b) {
            wrapRange(a, offset_a, null, style, value);
            wrapRange(b, null, offset_b, style, value);
        }
        else {
            wrapRange(a, offset_a, offset_b, style, value);
        }
    }
}

function wrapRange(node, offset_a, offset_b, style, value) {

    if (offset_a == null) {
        offset_a = 0;
    }
    if (offset_b == null) {
        offset_b = node.textContent.length;
    }

    if (node.textContent == "") { return; }

    var range = document.createRange();

    var spanRange = document.createRange();
    spanRange.setStart(node, offset_a);
    spanRange.setEnd(node, offset_b);

    if (node.textContent == spanRange.toString()) {
        wrapNode(node, style, value);
    }
    else {
        var span;
        if (node.parentNode.nodeName == "SPAN") {
            if (node.parentNode.style[style] != value) {
                var range_a = document.createRange(), range_b = document.createRange(), right = true;

                range_a.setStartBefore(node);
                range_a.setEnd(node, offset_a);

                range_b.setStart(node, offset_b);
                range_b.setEndAfter(node);

                if (range_a.toString() != "") {
                    if (range_b.toString() != "") {
                        span = node.parentNode.cloneNode(false);
                        span.innerHTML = range_b.toString();
                        range.setStartAfter(node.parentNode);
                        range.setEndAfter(node.parentNode);
                        range.insertNode(span);
                        range_b.deleteContents();
                    }
                    right = true;
                }
                else {
                    right = false;
                }

                if (right) {
                    range.setStartAfter(node.parentNode);
                    range.setEndAfter(node.parentNode);
                }
                else {
                    range.setStartBefore(node.parentNode);
                    range.setEndBefore(node.parentNode);
                }

                span = node.parentNode.cloneNode(false);
                span.style[style] = value;
                spanRange.setStart(node, offset_a);
                spanRange.setEnd(node, offset_b);
                span.innerHTML = spanRange.toString();
                spanRange.deleteContents();
                range.insertNode(span);
            }
        }
        else {
            span = document.createElement("span");
            span.style[style] = value;
            span.innerHTML = spanRange.toString();
            spanRange.deleteContents();
            spanRange.insertNode(span);
        }
    }
}

function wrapNode(node, style, value) {
    var parent = node.parentNode;
    if (parent.nodeName == "SPAN") {
        parent.style[style] = value;
    }
    else {
        $(node).wrap("<span></span>");
        node.parentNode.style[style] = value;
    }
}

/* -------------------- SELECTING NODES -------------------- */

function selectAllNodes(a, b) {
    var childNodeArray = [];
    var selectedTextNodes = [];
    var anchorToFocus = true;

    if (a != b) {
        var commonParent = $(a).parents().has(b).first()[0];
        var currentNode = a;

        var t = commonParent.childNodes;
        for (var i = 0; i < t.length; i++) {
            addChildTextNodes(t[i], childNodeArray);
        }

        if (childNodeArray.indexOf(a) > childNodeArray.indexOf(b)) {
            anchorToFocus = false;
            var tempNode = a;
            a = b;
            b = tempNode;
        }

        var x = childNodeArray.indexOf(b), y = childNodeArray.indexOf(a) + 1;
        selectedTextNodes = childNodeArray.slice(y, x);
    }
    else {
        if (a.nodeName == "BODY") {
            addChildTextNodes(a, selectedTextNodes);
        }
    }

    return [selectedTextNodes, anchorToFocus];
}

function addChildTextNodes(el, descendants) {
    if (el.nodeType == Node.TEXT_NODE) {
        descendants.push(el);
    }
    var children = el.childNodes;
    for (var i = 0; i < children.length; i++) {
        addChildTextNodes(children[i], descendants);
    }
}