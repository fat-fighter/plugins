<div class="container" id="<?php echo $style; ?>">
    <h2><?php echo strtoupper($style); ?></h2>
    <div class="container-content">
        <div class="container-content-code">
            <ul class="nav nav-tabs nav-tabs-code" style="margin-top: 20px;">
                <li class="active"><a data-toggle="tab" href="#<?php echo $style; ?>-html">HTML</a></li>
                <li><a data-toggle="tab" href="#<?php echo $style; ?>-css">CSS</a></li>
                <li><a data-toggle="tab" href="#<?php echo $style; ?>-javascript">Javascript</a></li>
            </ul>

            <div class="tab-content tab-content-code">
                <div id="<?php echo $style; ?>-html" class="tab-pane fade in active">
                    <pre class="prettyprint linenums">
&lt;div class="fat-scroll" id = "fat-scroll-<?php echo $style; ?>"&gt;
<?php include('pre-html-list-code.php'); ?>
&lt;div&gt;</pre>
                </div>
                <div id="<?php echo $style; ?>-css" class="tab-pane fade">
                    <pre class="prettyprint linenums">
#fat-scroll-<?php echo $style; ?> {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    border-radius: 4px;
}</pre>
                </div>
                <div id="<?php echo $style; ?>-javascript" class="tab-pane fade">
                    <pre class="prettyprint linenums">
$('#fat-scroll-<?php echo $style; ?>').fatScroll({
    style  : '<?php echo $style; ?>',
    height : 400,
    width  : '100%'
});</pre>
                </div>
            </div>
        </div>
        <div class="fat-scroll" id="fat-scroll-<?php echo $style; ?>">
            <?php include('html-list-code.php'); ?>
        </div>
    </div>
</div>


<script>

    $(document).on('ready', function() {
        $('#fat-scroll-<?php echo $style; ?>').fatScroll({
            style    :    '<?php echo $style; ?>',
            height   :    465,
            width    :    '36%'
        });
    });

</script>