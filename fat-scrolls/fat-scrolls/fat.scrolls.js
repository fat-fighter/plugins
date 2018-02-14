jQuery.fn.extend({
    fatScroll : function(options) {
        if (!options) { options = {}; }

        if (!options.height) {
            options.height = 500;
        }
        if (!options.width) {
            options.width = 270;
        }

        this.each(function() {
            $(this).find('.fat-scroll-list').height(options.height);
            $(this).width(options.width);

            var self = {};
            self.itemHeight = $(this).find('li').first()[0].getBoundingClientRect().height;
            self.scrollHeight = $(this).find('ul').height();

            if (!options.style) {
                options.style = 'shrink';
            }
            self.inactiveClass = 'fat-scroll-' + options.style;
            $(this).addClass(self.inactiveClass);

            $(this).find('.fat-scroll-list').on('scroll', function() {
                var scrollOffset = $(this).scrollTop();
                var elemScrollPast = Math.floor(scrollOffset/self.itemHeight);
                var elemScrollActive = Math.ceil((scrollOffset + self.scrollHeight)/self.itemHeight);
                $(this).find('li:lt(' + (elemScrollActive+1) + ')').removeClass('fat-scroll-past').removeClass('fat-scroll-future');
                $(this).find('li:lt(' + elemScrollPast + ')').addClass('fat-scroll-past').removeClass('fat-scroll-future');
                $(this).find('li:gt(' + (elemScrollActive-1) + ')').addClass('fat-scroll-future').removeClass('fat-scroll-past');
            });

        });
    }
});