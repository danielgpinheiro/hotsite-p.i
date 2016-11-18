$(function() {
    //FastClick.attach(document.body);
});

var currentSlide = 0;
var nextSlide = null;
var heightTestimonyItem;
var lastScrollTop = 0;
var originalHeight = $("footer section .container").innerHeight();
var currentPlayerId = 0;
var larguraTela = $(window).width();
var loopBoo = larguraTela <= 997;
var thumbBoo;
var offset;
var lastDirection;
var scrollDiff = 0;
var carouselOptions = {
    slider: true,
    pagination: false,
    infinite: false,
    visiblePanelsTablet: 2,
    visiblePanelsMobile: 1.2,
    panelMarginTablet: 5,
    panelMarginMobile: 5,
    smoothScrollTablet: true,
    smoothScrollMobile: true
}
var teste = 0;

if($(".accordion").length > 0)
    var accordionWidget = new $.accordion('.accordion', {});

//Metodos que marcam o menu indicando onde a pessoa está na pagina
var lastId, topMenu = $("section.container-menu"),
  topMenuHeight = topMenu.outerHeight() + 150,
  menuItems = topMenu.find("ul.menu li a.waypoints"),
  scrollItems = menuItems.map(function() {
      var item = $($(this).attr("href"));
      if (item.length) {
          return item;
      }
});

$(window).scroll(function() {
    var top = $("section.container-menu").innerHeight() + 5;
    var bottom = $("footer").innerHeight() + 5;
    var st = window.pageYOffset || document.documentElement.scrollTop;

    if(teste == 0) {
        if (st > lastScrollTop) {
            // downscroll code
            if(lastDirection != "down")
                scrollDiff = 0;

            lastDirection = "down";

            scrollDiff += (st - lastScrollTop);

            if(scrollDiff >= 50) {
                $("section.container-menu").addClass("fixed-nav");
                $("section.container-menu").removeClass("visible");

                //if(larguraTela <= 997)
                 //   $("footer.fixed").addClass("visible");

                if($("a.open-sub-menu").parent().hasClass("active") && larguraTela >= 998) {
                    TweenMax.to(jQuery("ul.sub-menu"), 0.5, { css:{ height: 0 }, ease:Power3.easeOut, onComplete: function() {
                       $("ul.sub-menu").css({ height: "auto", display: "none" });
                    }});
                    $("a.open-sub-menu").parent().removeClass("active");
                }
            }
        }

        if (st < lastScrollTop && ($(window).scrollTop() >= 120)) {
            // upscroll code
            if(lastDirection != "up")
                scrollDiff = 0;

            lastDirection = "up";

            scrollDiff += (lastScrollTop - st);

            if(scrollDiff >= 240) {
                $("section.container-menu").addClass("visible");

                //if(larguraTela <= 997)
                //    $("footer.fixed").removeClass("visible");
            }
        }
    }

    if(($(window).scrollTop() <= 85))
        $("section.container-menu").addClass("visible");

    lastScrollTop = st;

    //waypoints
    var fromTop = $(this).scrollTop() + topMenuHeight;

    var cur = scrollItems.map(function() {
      if ($(this).offset().top < fromTop) return this;
    });
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";
    if (lastId !== id) {
      lastId = id;
      menuItems.parent().removeClass("active").end().filter("[href=#" + id + "]").parent().addClass("active");
    }
});

var testimonyAnim = function() {
    if(document.querySelectorAll("section.wrapper-player-testimony").length > 0) {
        var testimonyItem = document.querySelectorAll("section.wrapper-player-testimony section.container-testimony");

        setTimeout(function(){
            nextSlide = currentSlide + 1;

            if(!testimonyItem[nextSlide])
                nextSlide = 0;

            //Animacao dos produtos
            $("section.wrapper-player-testimony").css({ height: heightTestimonyItem });

            TweenMax.to(testimonyItem[currentSlide], 1, { css:{ opacity: 0 }, ease: Power3.easeOut });
            TweenMax.to(testimonyItem[nextSlide], 1, { css:{ opacity: 1 }, ease: Power3.easeOut, onComplete: function() {
                currentSlide = nextSlide;
                testimonyAnim();
            }});
        }, 6500);
    }
};

var setMaxHeight = function(elementNames) {
    if(larguraTela >= 998) {
        elementNames = [
            ".migration-cloud-player li section",
            ".container-people-recommendation",
            "section.container-testimony div.testimony",
            "ul.boxs-plans li .content .maximized p"
        ]
    }

    if(larguraTela <= 997) {
        elementNames = [
            "section.container-testimony div.testimony div.content",
            "section.container-testimony div.testimony div.people-info",
            "section.player-recommendations-mobile div.recommendation div.content",
            "section.player-recommendations-mobile div.recommendation div.people-info"
        ]
    }

    for(i = 0; i < elementNames.length; i++) {
        el = $(elementNames[i]);

        el.css({height: "auto"});

        var biggerHeight = 0;

        el.each(function() {
            var boxHeight = $(this).outerHeight();
            if(boxHeight > biggerHeight)
                biggerHeight = boxHeight;
        });

        el.css({height: biggerHeight});
    };
}

$(window).resize(function() {
    if(larguraTela <= 997)
        $("section.container-menu .content ul.menu").height($(window).height());

    setMaxHeight();
});

function recommendationsPlayer() {
    var factor = 3;

    var recommendationsAnim = function (type) {
        for(i = 0; i < 3; i++) {
            if(type == "next")
                marginNumber = 350;
            if(type == "prev")
                marginNumber = -350;

            var container = sliderRecommendation.currSlide.content[0].children[0].children[i].children[0];

            $(container).css({'marginLeft' : marginNumber, 'opacity' : 0 });
            //TweenMax.to(jQuery(container), 1, { css:{ opacity: 0 }, ease:Power3.easeOut, delay: i/2 });
        }

        setTimeout(function() {
            for(i = 0; i < 3; i++) {
                if(type == "next")
                    delayCalc = i/factor;
                if(type == "prev")
                    delayCalc = (1 - (i/factor));

                var container = sliderRecommendation.currSlide.content[0].children[0].children[i].children[0];

                TweenMax.to(jQuery(container), 1, { css:{ marginLeft: 0, opacity: 1 }, ease:Power3.easeOut, delay: delayCalc });
            }
        }, 100);
    };

    $('.player-recommendations').royalSlider({
        arrowsNav: true,
        arrowsNavAutoHide: true,
        loop: false,
        controlsInside: true,
        imageScaleMode: 'none',
        arrowsNavAutoHide: false,
        autoScaleSlider: false,
        autoHeight: true,
        controlNavigation: 'none',
        navigateByClick: false,
        globalCaption: false,
        slidesSpacing: 0,
        sliderDrag: false,
        sliderTouch: false,
        autoPlay: {
            enabled: false
        }
    });

    var sliderRecommendation = $(".player-recommendations").data("royalSlider");

    sliderRecommendation.ev.on('rsBeforeAnimStart', function(event) {
        if (event.target.currSlideId > currentPlayerId)
            recommendationsAnim("next");
        else
            recommendationsAnim("prev");

        currentPlayerId = event.target.currSlideId;
    });
}

var popupBehavior = function(action, element) {
    console.log(element + " .container");

    if(action == "open") {
        $(element).css({"display": "block"});

        var top = $(element + " .container").innerHeight();

        if(element != ".popup-infografic" && element != ".popup-contact"  && element != ".popup-questions")
            $(element + " .container").css({ "marginTop": -top/2 });

        setTimeout(function() {
            $(element).addClass("open");
            $(element + " .inner-content").addClass("open");

            $("html, body").addClass("overflowHidden");
        }, 10);
    }

    if(action == "close") {
        $("html, body").removeClass("overflowHidden");

        $(element).removeClass("open");
        $(element + " .inner-content").removeClass("open");

        setTimeout(function() {
            $("html, body").removeClass("overflowHidden");
            $(element).css({"display": "none"});
        }, 300);
    }
};

var carousel = function() {
    var recommendationCarousel = $.carousel( '#recommendation-carousel', carouselOptions);
    var testimonyCarousel = $.carousel( '.wrapper-player-testimony', carouselOptions);

    recommendationCarousel.initialize();
    testimonyCarousel.initialize();

    var common = $.common();
    common.initialize();
};

$(window).load(function(){
    if($(".player-recommendations").length > 0)
        recommendationsPlayer();
});

$(document).ready(function(){
    picturefill();

    if($(".accordion").length > 0)
        accordionWidget.initialize();

    if(larguraTela >= 998) {
        testimonyAnim();
        offset = -65;
        Omnize();
    }

    if(larguraTela <= 997) {
        //carousel();
        offset = -85;

        $("section.container-menu .content ul.menu").height($(window).height());
    }

    setMaxHeight();

    if(larguraTela >= 998) {
        $("ul.tabs li:first-child a").addClass("active");
        thumbBoo = "thumbnails";
    }

    if(larguraTela <= 997)
        thumbBoo = "none";

    /*$('.player').royalSlider({
        arrowsNav: false,
        loop: loopBoo,
        controlsInside: true,
        imageScaleMode: 'none',
        arrowsNavAutoHide: false,
        autoScaleSlider: false,
        autoHeight: true,
        controlNavigation: 'bullets',
        navigateByClick: false,
        globalCaption: false,
        slidesSpacing: 0,
        autoPlay: {
            enabled: true,
            stopAtAction: false,
            pauseOnHover: false,
            delay: 5000
        }
    });

    $('.migration-cloud-player').royalSlider({
        arrowsNav: true,
        loop: true,
        controlsInside: true,
        imageScaleMode: 'none',
        arrowsNavAutoHide: false,
        autoScaleSlider: false,
        autoHeight: true,
        transitionType: 'fade',
        controlNavigation: thumbBoo,
        navigateByClick: false,
        globalCaption: false,
        slidesSpacing: 0,
        sliderTouch: false,
        thumbs: {
            firstMargin: false,
            autoCenter: false
        },
        autoPlay: {
            enabled: false
        }
    });

    var sliderMigration = $(".migration-cloud-player").data("royalSlider");

    $('section.container-menu, header').localScroll({
        duration: 1300,
        easing: "easeInOutExpo",
        hash: true,
        offset: { top: offset }
    });

    $('.agree-now-wrapper').localScroll({
        duration: 1300,
        easing: "easeInOutExpo",
        hash: true,
    });*/

    $('section.container-player-computer ul.tabs li a').click(function(e){
        e.preventDefault();

        if(larguraTela >= 998) {
            $('img.screen').fadeOut();
            $('div.screen-player-description').fadeOut();

            $('section.container-player-computer ul.tabs li a').removeClass('active');

            $(this).addClass('active');

            var imgId = $(this).attr('img-id');

            $('img.screen.' + imgId).fadeIn();
            $('div.screen-player-description.' + imgId).fadeIn();
        }

        else {
            var parent = $(this).parent();
            var collapse = parent.find(".collapse");
            var collapseHeight = collapse.innerHeight();

            if(!$(this).hasClass("active")) {
                collapse.css({ height: 0, display: 'block' });

                $(this).addClass("active");
                TweenMax.to(jQuery(collapse), 0.8, { css:{ height: collapseHeight }, ease:Power3.easeOut });
            }

            else {
                $(this).removeClass("active");
                TweenMax.to(jQuery(collapse), 0.8, { css:{ height: 0 }, ease:Power3.easeOut, onComplete: function() {
                    collapse.css({ height: "auto", display: "none" });
                }});
            }
        }
    });

    $("li.called-you a").click(function(e) {
        if (!$('.mobile').is(':visible')) {
            e.preventDefault();

            popupBehavior("open", ".popup-contact");
        }
    });

    $("li.questions a").click(function(e) {
        if (!$('.mobile').is(':visible')) {
            e.preventDefault();
            popupBehavior("open", ".popup-questions");
        }
    });

    $("a.footer-collapse").click(function(e) {
        e.preventDefault();

        if($(this).hasClass("active")) {
            $('footer img.shadow').css({'opacity' : 0 });

            TweenMax.to(jQuery('footer .container'), 0.5, { css:{ height: originalHeight, opacity: 1 }, ease:Power3.easeOut, onComplete: function() {
                TweenMax.to(jQuery('footer img.shadow'), 0.5, { css:{ opacity: 1 }, ease:Power3.easeOut });
                $('footer img.shadow').css({'width' : 'auto','height' : 'auto' });
            } });

            $("footer .container").css({"visibility": "visible"});
        }

        else {
            $('footer img.shadow').css({'width' : '100%','height' : '80px'});

            TweenMax.to(jQuery('footer .container'), 1, { css:{ height: 40, opacity: 0 }, ease:Power3.easeOut, onComplete: function() {
                $("footer .container").css({"visibility": "hidden"});
            } });
        }

        $(this).toggleClass("active");
        $("footer .collapse span").toggleClass("active");
    });

    $("a.open-sub-menu").click(function(e) {
        e.preventDefault();

        var parent = $(this).parent();
        if(larguraTela >= 998)
            var subMenu = $("ul.sub-menu");
        if(larguraTela <= 997)
            var subMenu = $("ul.sub-menu-mobile");

        var subMenuHeight = subMenu.innerHeight();

        if(!parent.hasClass("active")) {
            subMenu.css({ height: 0, display: 'block' });

            parent.addClass("active");
            TweenMax.to(jQuery(subMenu), 0.4, { css:{ height: subMenuHeight }, ease:Power3.easeOut });
        }

        else {
            parent.removeClass("active");
            TweenMax.to(jQuery(subMenu), 0.4, { css:{ height: 0 }, ease:Power3.easeOut, onComplete: function() {
               subMenu.css({ height: "auto", display: "none" });
            }});
        }
    });

    $("form.category-select select").change(function() {
        var button = $(this).parent().find("button");

        if($(this).val() != "") {
            $(this).addClass("selected");
            button.addClass("active");
        }
        else {
            $(this).removeClass("selected");
            button.removeClass("active");
        }
    });

    $("form.category-select button").click(function(e) {
        e.preventDefault();
        window.location = $(this).prev().val();
    });

    $("div.container-content-plan a.open-collapse").click(function(e) {
        e.preventDefault();

        var parent = $(this).parent();
        var content = parent.find(".content");
        var collapse = content.find(".collapse");
        var collapseHeight = collapse.innerHeight();

        if(!parent.hasClass("active")) {
            collapse.css({ height: 0, display: 'block' });

            parent.addClass("active");
            TweenMax.to(jQuery(collapse), 0.8, { css:{ height: collapseHeight }, ease:Power3.easeOut });
        }

        else {
            parent.removeClass("active");
            TweenMax.to(jQuery(collapse), 0.8, { css:{ height: 0 }, ease:Power3.easeOut, onComplete: function() {
                collapse.css({ height: "auto", display: "none" });
            }});
        }
    });

    $("section.migration-cloud section.main form select").change(function() {
        var slider = $(this).val();
        sliderMigration.goTo(slider);
    });

    $(".open-menu-mobile").click(function(e) {
        e.preventDefault();

        $("section.container-menu .content ul.menu").toggleClass("active");

        if(!$("section.container-menu .content ul.menu").hasClass("active"))
            $("html, body").removeClass("overflowHidden");
        else
            $("html, body").addClass("overflowHidden");
    });

    $("a.waypoints").click(function() {
        if(larguraTela <= 997) {
            $("section.container-menu .content ul.menu").removeClass("active");
            $("html, body").removeClass("overflowHidden");
        }
    });

    $("a.open-maximized-box").click(function(e) {
        e.preventDefault();

        var parent = $(this).parent().parent();
        var minimizedBox = parent.find(".minimized");
        var maximizedBox = parent.find(".maximized");

        TweenMax.to(jQuery(parent), 0.8, { css:{ height: 475 }, ease: Power3.easeOut });
        //TweenMax.to(jQuery(minimizedBox), 0.8, { css:{ opacity: 0 }, ease: Power3.easeOut });
        //TweenMax.to(jQuery(maximizedBox), 0.8, { css:{ opacity: 1 }, ease: Power3.easeOut });
        minimizedBox.css({ opacity: 0 });
        maximizedBox.css({ opacity: 1 });
    });

    $("a.open-minimized-box").click(function(e) {
        e.preventDefault();

        var parent = $(this).parent().parent();
        var minimizedBox = parent.find(".minimized");
        var maximizedBox = parent.find(".maximized");

        TweenMax.to(jQuery(parent), 0.8, { css:{ height: 145 }, ease: Power3.easeOut });
        //TweenMax.to(jQuery(minimizedBox), 0.8, { css:{ opacity: 0 }, ease: Power3.easeOut });
        //TweenMax.to(jQuery(maximizedBox), 0.8, { css:{ opacity: 1 }, ease: Power3.easeOut });
        minimizedBox.css({ opacity: 1 });
        maximizedBox.css({ opacity: 0 });
    });

    $("ul.boxs-plans a.more").click(function(e) {
        e.preventDefault();
        $('.popup-details .description').text($(this).attr('data-text'));
        popupBehavior("open" , ".popup-details");
    });

    $(".help-menu-active a").click(function(e) {
        e.preventDefault();

        if($(this).hasClass("active"))
            $(".help-menu").removeClass("active")
        else
            $(".help-menu").addClass("active")

        $(this).toggleClass("active");
    });

    $(".help-menu a").click(function() {
        $(".help-menu").removeClass("active");
        $(".help-menu-active a").removeClass("active");
    });

    $(".testimony button.read-more").click(function() {
        $("section.popup-player .inner-content .include-recommendations").css({"display": "none"});

        testimonyContent = $(this).parent().html();
        popupContent = $("section.popup-player .inner-content .include-testimony");

        $(popupContent).html(testimonyContent);
        $(popupContent).css({ "display": "block" });
        $(popupContent).find(".content").css({ "height": "auto" });
        $(popupContent).find(".people-info").css({ "height": "auto" });
        $("section.popup-player").addClass("testimony");
        popupBehavior("open", ".popup-player");
    });

    $("div.recommendation button.read-more").click(function() {
        $("section.popup-player .inner-content .include-testimony").css({"display": "none"});

        recommendationContent = $(this).parent().html();
        $("section.popup-player").css({"display": "block"});
        popupContent = $("section.popup-player .inner-content .include-recommendations");
        $(popupContent).html(recommendationContent);
        $(popupContent).css({ "display": "block" });
        $(popupContent).find(".content").css({ "height": "auto" });

        popupHeight = $("section.popup-player .inner-content").height();

        if (popupHeight > $(window).height()) {
            diff = popupHeight - $(window).height();
            content = $(popupContent).find(".content");
            content.css({ "height": content.height() - diff + 20 });
        }

        $(popupContent).find(".people-info").css({ "height": "auto" });
        $("section.popup-player").addClass("recommendation");
        popupBehavior("open", ".popup-player");
    });

    $(".content a.learn-more").click(function(e) {
        if(larguraTela >= 998) {
            e.preventDefault();

            popupBehavior("open", ".popup-infografic");
        }
    });
});
