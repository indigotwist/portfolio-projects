$(function() {
    var $container = $('#workContainer').masonry();
    // initialize
    $container.imagesLoaded(function() {
        $container.masonry({
          columnWidth: '.grid-sizer',
          itemSelector: '.item'
        });
    });

    var altString;

    $('.imageOverlay').hide();

    $('.item').hover(
        function() {
            altString = $(this).find('img').attr('alt');
            $(this).find('.projectName').text(altString);
            $(this).find('.imageOverlay').show();
        }, function() {
            $('.imageOverlay').hide();
        }
    );
});
