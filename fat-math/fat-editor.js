$(document).on('ready', function() {

    var selection, node, nodeName, parentNodeName;
    var fatEditor = $('.fat-editor');

    fatEditor.html('');

    if (fatEditor.html() == "" || fatEditor.html() == "<br>") {
        document.execCommand("insertParagraph", false, null);
    }

    fatEditor[0].addEventListener("DOMNodeInserted", function(e) {
        if (e.relatedNode.nodeName == "DIV" && !e.relatedNode.classList.contains('fat-editor')) {
            document.execCommand("formatBlock", false, "p");
        }
    });

    fatEditor.keydown(function(e) {

        if (e.keyCode == 13 && !e.shiftKey) {
            if (node.parentNode.classList.contains('fat-editor') && node.nodeName == "#text") {
                document.execCommand("formatBlock", false, "p");
            }
        }
        if (e.ctrlKey) {
            if (e.keyCode == 66) {
                document.execCommand("bold");
                return false;
            }
            if (e.keyCode == 73) {
                document.execCommand("italic");
                return false;
            }
            if (e.keyCode == 85) {
                document.execCommand("underline");
                return false;
            }
        }
    }).on('keyup mouseup blur', function() {
        selection = document.getSelection();
        node = selection.anchorNode;
        nodeName = node.parentNode.nodeName.toLowerCase();
        parentNodeName = node.parentNode.parentNode.nodeName.toLowerCase();

        $(this).parent().find('.fat-editor-node').text(parentNodeName + " >> " + nodeName);
    });

    $('.fat-editor-toolbar button').on('click', function() {
        var button = $(this);
        var element, editorConsole = button.parent().parent().find('.fat-editor');
        var range = selection.getRangeAt(0);

        switch (button.attr('data-class')) {

            case "heading" :
                document.execCommand('formatBlock', false, 'h' + button.attr('data-value'));
                break;

            case "list" :
                element = button.attr('data-value') + "l";
                if (nodeName == "li") {
                    if (selection.getRangeAt && selection.rangeCount) {
                        range = selection.getRangeAt(0);
                        var listNode = document.createElement(element);
                        listNode.innerHTML = "<li></li>";
                        range.collapse(false);
                        range.insertNode(listNode);
                    }
                }
                else {
                    if (button.attr('data-value') == "u") {
                        //document.execCommand('InsertUnorderedList', false, 'NewUL');
                        document.execCommand('insertHTML', false, '<ul><li></li></ul>');
                    }
                    else if (button.attr('data-value') == "o") {
                        document.execCommand('InsertOrderedList', false, 'NewOL');
                    }
                }
                break;

            case "bold" :
                document.execCommand('bold');
                break;

            case "italic" :
                document.execCommand('italic');
                break;

            case "underline" :
                document.execCommand('underline');
                break;

            case "strikethrough" :
                document.execCommand('strikethrough');
                break;

            case "indent" :

                var block = $(node);
                while (!block.parent().hasClass('fat-editor')) {
                    block = block.parent();
                }
                if (button.attr('data-value') == "i") {
                    block.css('margin-left', "+=40");
                }
                else {
                    block.css('margin-left', "-=40");
                }
                break;

            case "font" :
                var anchorNode = selection.anchorNode;
                var focusNode = selection.focusNode;

                var selectedNodes;

                if (anchorNode != focusNode) {
                    var currentNode = anchorNode;
                    while ((currentNode = getNextNode(currentNode, fatEditor[0])) != focusNode && currentNode != fatEditor[0]) {
                        if (!selectedNodes) { selectedNodes = $(currentNode); }
                        else { selectedNodes.add(currentNode); }
                    }
                    if (currentNode == fatEditor[0]) {
                        selectedNodes = null;
                        currentNode = focusNode;

                        while ((currentNode = getNextNode(currentNode, fatEditor[0])) != anchorNode) {
                            if (!selectedNodes) { selectedNodes = $(currentNode); }
                            else { selectedNodes.add(currentNode); }
                        }
                    }
                    console.log(selectedNodes.length);
                }
                console.log(selection);
                document.execCommand("fontSize", false, 1);
                break;

        }
    });

});

function getNextNode(node, parent) {
    if (!node) {
        return null;
    }
    if (node.hasChildNodes()) {
        return node.firstChild;
    }
    else {
        while (node && !node.nextSibling) {
            node = node.parentNode;
            if (node == parent) {
                return node;
            }
        }
        return node.nextSibling;
    }
}