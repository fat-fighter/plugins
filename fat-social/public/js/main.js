$(document).ready(function() {
    $('.popup .popup-close').on('click', function() {
        $(this).closest('.popup').fadeOut(200, function() {
            $(this).remove();
        });
    });
});