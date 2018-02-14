Array.prototype.getValueForLess = function(value) {
    var list = Object(this).sort(function(a, b){return a[0] < b[0]});
    var len = list.length;
    for (var i = 0; i < len; i++) {
        if (list[i][0] <= value) { return list[i][1]; }
    }
    return 1;
};

jQuery.fn.extend({
    fatCarousel : function(options) {
        if (!options) {
            options = {};
        }

        $(this).each(function () {
            var self = $(this);

            var carousel;
            var carouselContainer;
            var carouselNav;


            /* -------------------- INITIALIZE -------------------- */


            self.initialize = function () {
                carousel = self;
                carouselContainer = carousel.find('.fat-carousel-container');

                self.images = ('imageArray' in options) ? options['imageArray'] : [];
                self.slideTime = ('slideTime' in options) ? options['slideTime'] : 400;
                self.activeItem = ('startSlide' in options) ? options['startSlide'] : 1;
                self.dragCarousel = ('dragToScroll' in options) ? options['dragToScroll'] : true;
                self.autoPlay = ('autoPlay' in options) ? options['autoPlay'] : true;

                self.addImages();

                self.setPreferences();
                self.removeControls();
                self.addControls();
                self.removeNavigation();
                self.addNavigation();
                self.addResizeControl();
                self.addCarouselScrollStop();

                self.scrollToSlide(1, self.activeItem);
            };

            self.addImages = function () {
                for (var i = 0; i < self.images.length; i++) {
                    var imageHTML = "<div class='fat-carousel-item'>";
                    imageHTML += "<img src='" + self.images[i] + "'>";
                    imageHTML += "</div>";
                    carouselContainer.append(imageHTML);
                }

                var index = 1;
                carouselContainer.find('.fat-carousel-item').each(function () {
                    $(this).attr('data-order', index++);
                });
                self.contentLength = index - 1;
                carouselContainer.find('.fat-carousel-item:first-of-type').addClass('fat-carousel-active');
            };


            /* -------------------- SET PREFERENCES -------------------- */


            self.applyPreferences = function () {
                carouselContainer.find('.fat-carousel-item').css({
                    minWidth: self.itemWidth + 'px'
                });

                if (self.dragCarousel) {
                    self.dragToScroll();
                }

                self.restartSlideAnimation();

                self.removeNavigation();
                self.addNavigation();

                self.removeControls();
                self.addControls();
            };

            self.setPreferences = function () {
                self.carouselWidth = carousel.width();

                if (typeof options['itemsOnScreen'] == "object") {
                    self.itemsOnScreen = options['itemsOnScreen'].getValueForLess($(window).outerWidth());
                }
                else if (typeof options['itemsOnScreen'] == "number") {
                    self.itemsOnScreen = options['itemsOnScreen'];
                }
                else {
                    self.itemsOnScreen = 1;
                }
                self.itemWidth = Math.floor(self.carouselWidth / self.itemsOnScreen);

                self.applyPreferences();
            };


            /* -------------------- SLIDE ANIMATION -------------------- */


            self.restartSlideAnimation = function () {
                if (self.autoPlay) {
                    clearInterval(self.slideAnimation);
                    self.slideAnimation = "";
                    self.slideAnimation = setInterval(function () {
                        self.scrollToSlide(self.slideTime);
                    }, 5000);
                }
            };


            /* -------------------- NAVIGATION -------------------- */


            self.addNavigation = function () {
                carousel.append("<div class='fat-carousel-nav'></div>");
                carouselNav = carousel.find('.fat-carousel-nav');
                var navLength = Math.ceil(self.contentLength / self.itemsOnScreen);
                for (var i = 0; i < navLength; i++) {
                    carouselNav.append("<div><span data-trigger='" + i + "'></span>");
                }
                self.setNavigationActive();

                carousel.find('.fat-carousel-nav span').on('click', function () {
                    self.scrollToSlide(self.slideTime, this);
                    carousel.find('.fat-carousel-nav span').removeClass('fat-carousel-nav-active');
                    $(this).addClass('fat-carousel-nav-active');
                });
            };

            self.removeNavigation = function () {
                carousel.find('.fat-carousel-nav').remove();
            };

            self.setNavigationActive = function () {
                var index = self.activeItem - 1;
                var navIndex = Math.floor(index / self.itemsOnScreen);
                if (index == self.contentLength - self.itemsOnScreen) {
                    if (index / self.itemsOnScreen != navIndex) {
                        navIndex += 1;
                    }
                }
                carouselNav.find('span').removeClass('fat-carousel-nav-active');
                carouselNav.find('span[data-trigger=' + navIndex + ']').addClass('fat-carousel-nav-active');
            };


            /* -------------------- CONTROLS -------------------- */


            self.addControls = function () {
                carousel.append("<div class='fat-carousel-controls'></div>");
                carousel.find('.fat-carousel-controls')
                    .append("<div><input type='button' value='prev' data-toggle='left'></div>")
                    .append("<div><input type='button' value='next' data-toggle='right'></div>");

                carousel.find('.fat-carousel-controls div input[type=button]').on('click', function () {
                    if ($(this).attr('data-toggle') == "right") {
                        self.scrollToSlide(self.slideTime, null, 1);
                    }
                    else {
                        self.scrollToSlide(self.slideTime, null, -1);
                    }
                });
            };

            self.removeControls = function () {
                carousel.find('.fat-carousel-controls').remove();
            };


            /* -------------------- DRAG TO SCROLL --------------------*/


            self.dragToScroll = function () {
                var curDown = false,
                    curXPos = 0;

                carouselContainer.on("dragstart", function () {
                    return false;
                });

                carouselContainer.on("mousemove", function (c) {
                    if (curDown === true) {
                        $(carouselContainer).scrollLeft($(carouselContainer).scrollLeft() + (curXPos - c.pageX));
                        curXPos = c.pageX;
                    }
                });

                carouselContainer.on("mousedown", function (c) {
                    curDown = true;
                    curXPos = c.pageX;
                });

                carouselContainer.on("mouseup", function () {
                    curDown = false;
                });

                carouselContainer.on("mouseout", function () {
                    curDown = false;
                });
            };


            /* -------------------- ACTIONS -------------------- */


            self.scrollToSlide = function (time, trigger, order) {
                var index = 0;
                if (!time) {
                    time = 400;
                }
                if (typeof(trigger) == "undefined" || trigger == null) {
                    var orderVar = 0;
                    if (order == -1) {
                        orderVar = self.contentLength - 1 - self.itemsOnScreen;
                    }
                    index = (self.activeItem + orderVar) % (self.contentLength + 1 - self.itemsOnScreen) + 1;
                }
                else {
                    if (typeof(trigger) == "number") {
                        index = trigger;
                    }
                    else {
                        index = parseInt($(trigger).attr('data-trigger')) * self.itemsOnScreen + 1;
                    }
                }

                self.setActiveContent(index);

                var scroll = (index - 1) * self.itemWidth;
                carouselContainer.stop().css({overflowX: 'hidden', marginBottom: '0'}).animate({
                    scrollLeft: scroll
                }, time, function () {
                    $(this).css({overflowX: 'scroll', marginBottom: '-15px'});
                });
            };

            self.setActiveContent = function (index) {
                carouselContainer.find('.fat-carousel-item').removeClass('fat-carousel-active');
                carouselContainer.find('[data-order=' + index + ']').addClass('fat-carousel-active');

                self.activeItem = index;

                self.setNavigationActive();
            };


            /* -------------------- SCROLLSTOP -------------------- */


            self.addCarouselScrollStop = function () {
                //     self.scrollStopSpeed = 0.025;
                //
                //     var prevDate = new Date();
                //     var prevScroll = carouselContainer.scrollLeft();
                //     carouselContainer.on('scroll', function() {
                //         if (((carouselContainer.scrollLeft() - prevScroll) / (new Date() - prevDate)) < self.scrollStopSpeed) {
                //             self.scrollStopAction();
                //         }
                //
                //         prevScroll = carouselContainer.scrollLeft();
                //         prevDate = new Date();
                //     });
                //
                carouselContainer.on('scrollstop', function () {
                    self.scrollStopAction();
                });
            };

            self.scrollStopAction = function () {
                self.restartSlideAnimation();

                var scroll = carouselContainer.scrollLeft();
                var scrollIndex = scroll / self.itemWidth;
                if (Math.abs(scrollIndex - Math.round(scrollIndex)) > 0) {
                    var index = scroll / self.itemWidth + 1;

                    var diff = index - self.activeItem;
                    diff -= (diff > 0) ? Math.floor(diff) : Math.ceil(diff);

                    if (diff > 0.35) {
                        index = Math.ceil(index);
                    }
                    else if (diff < -.35) {
                        index = Math.floor(index);
                    }
                    else {
                        index = Math.round(index);
                    }
                    self.scrollToSlide(self.slideTime, index);
                    self.setActiveContent(index);
                }
                else {
                    self.setActiveContent(Math.round(scrollIndex) + 1);
                }
            };


            /* -------------------- WINDOW RESIZE -------------------- */


            self.addResizeControl = function () {
                var windowResizeTimer;
                $(window).on('resize', function () {
                    clearTimeout(windowResizeTimer);
                    windowResizeTimer = setTimeout(function () {
                        self.setPreferences();

                        var index = self.activeItem;
                        self.scrollToSlide(10, index);
                    }, 100);
                });
            };

            self.initialize();
        });
    }
});