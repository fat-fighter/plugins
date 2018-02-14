<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" href="../code-prettify/prettify.css">
    <link rel="stylesheet" href="../code-prettify/tomorrow.min.css">
    <link rel="stylesheet" href="fat-scrolls/fat.scrolls.css">
    <link rel="stylesheet" href="../plugin-stylesheets/common.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"> </script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="../code-prettify/prettify.js"></script>
    <script src="fat-scrolls/fat.scrolls.js"></script>

    <style>

        .fat-scroll {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            border-radius: 4px;
        }

    </style>

</head>
<body onload="prettyPrint()">

<div class="header">
    <div class="header-left">
        <ul class="header-nav">
            <li><a href="index.html">&larr; Back to Main Page</a></li>
        </ul>
    </div>

    <div class="header-right">
        <h2>fat.scrolls.js</h2>
    </div>
</div>

<?php $style = "spring"; include('include/example-container.php'); ?>
<?php $style = "shrink"; include('include/example-container.php'); ?>
<?php $style = "flip"; include('include/example-container.php'); ?>
<?php $style = "twist"; include('include/example-container.php'); ?>
<?php $style = "wave"; include('include/example-container.php'); ?>
<?php $style = "curve"; include('include/example-container.php'); ?>
<?php $style = "blinds"; include('include/example-container.php'); ?>
<?php $style = "flow"; include('include/example-container.php'); ?>


</body>
</html>