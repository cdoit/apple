$(function(){
	bodySize();
	window.onresize = function(){
		bodySize();
	}
	function bodySize(){
        $("html").css({
        	"font-size": $(window).width() * 40 / 750 + "px"
        });
	}
    if (document.getElementById('media')) {
        document.getElementById('media').play();
        document.addEventListener("WeixinJSBridgeReady", function() {
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                document.getElementById('media').play();
            });
        }, false);
    };
    
    var mySwiper = null;
    mySwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        direction: 'vertical',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 0,
        resistanceRatio : 0,
        // freeMode: false,
        // autoplay: 3000,
        autoplayDisableOnInteraction: false,
        loop: false,
        noSwiping: true,
        noSwipingClass: 'noSwiping',
        resistance: '100%',
        initialSlide: 0
    });
    $(".swiper-slide").bind("touchstart touchend touchmove", touchEvent);
    var leftVal1 = 0;
    var topVal1 = 0;
    var leftVal2 = 0;
    var topVal2 = 0;
    var leftVal3 = 0;
    var topVal3 = 0;
    function touchEvent(event) {
        var $this = $(this);
        switch (event.type) {
            case "touchstart":
                leftVal1 = event.originalEvent.touches[0].clientX;
                topVal1 = event.originalEvent.touches[0].clientY;
                leftVal3 = event.originalEvent.touches[0].clientX;
                topVal3 = event.originalEvent.touches[0].clientY;
                break;
            case "touchend":
                leftVal2 = event.originalEvent.changedTouches[0].clientX;
                topVal2 = event.originalEvent.changedTouches[0].clientY;
                if (topVal2 < topVal1 - 50) {
                    if ($this.scrollTop() > $this.find('.slide-content').height() - $this.height() - 10) {
                        mySwiper.slideNext();
                        $(".swiper-slide").eq($this.index() + 1).scrollTop("0px");
                    };
                }else if(topVal2 > topVal1 + 50){
                    if ($this.scrollTop() < 10) {
                        mySwiper.slidePrev();
                        $(".swiper-slide").eq($this.index() - 1).scrollTop("0px");
                    };
                };
                break;
            case "touchmove":
                event.preventDefault(); //阻止滚动
                leftVal2 = event.originalEvent.changedTouches[0].clientX;
                topVal2 = event.originalEvent.changedTouches[0].clientY;
                $this.scrollTop($this.scrollTop() - (topVal2 - topVal3));
                topVal3 = topVal2;
                break;
        }
    };

    $('body').on('touchmove', function (event) {
        event.preventDefault();
    });
});