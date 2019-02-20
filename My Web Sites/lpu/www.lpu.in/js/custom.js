//Hide chat button

var psZendeskIframe = null;

function psHideChatButton(){
	var ps = $(".zopim iframe").contents().find(".button_text");
	if(ps != null && ps.length > 0){
		ps.hide();
		$('.zopim').css({'right':'15px','bottom':'15px'});
		clearInterval(psZendeskIframe);
	}
}

//document scroll//
$(document).scroll(function() {
	
    var y = $(this).scrollTop();
    var navWrap = $('#thinkbig').offset().top;
    var actionWrap = $('.apply-now').offset().top;
    var actionWidth = $(window).width();
    if (y > navWrap) {
        $('nav ul li.scroll-menu').addClass('apply-now-menu');
        $('.right-new-bar').css('display','block');
		
    } else {
        $('nav ul li.scroll-menu').removeClass('apply-now-menu');
		 $('.right-new-bar').css('display','none');
    }
 if (y > actionWrap) {
		if(actionWidth<770){
				$('.action-btn').addClass('action-btn-mobile');
				$('.location').addClass('show');
				}
				
	 }
	 else{$('.action-btn').removeClass('action-btn-mobile');
	 $('.location').removeClass('show');
	 $('.zopim').css({'right':'15px','bottom':'15px'});
	// $('.location').addClass('hide');
	}
	
});

// $(window).on('scroll',function() {
    // if (checkVisible($('#one'))) {
		
        // $('.gifcdn-one').each(function() {
			// var getAtt = this.getAttribute('data-src');
			// var getsrc = this.getAttribute('src');
			
			// if(getFileExtension(getsrc)!="gif")
			// {
				
				// $(this).attr('src', getAtt);
			// }
		// });
    // } 
	// else if (checkVisible($('#two'))) {
		
        // $('.gifcdn-two').each(function() {
			// var getAtt2 = this.getAttribute('data-src');
			// var getsrc2 = this.getAttribute('src');
			
			// if(getFileExtension(getsrc2)!="gif")
			// {
				
				// $(this).attr('src', getAtt2);
			// }
		// });
    // }
	// else{
        // // do nothing
    // }
// });
// function getFileExtension(name)
// {
    // return name.split('.').pop();
// }
// function checkVisible( elm, eval ) {
    // eval = eval || "object visible";
    // var viewportHeight = $(window).height(), // Viewport Height
        // scrolltop = $(window).scrollTop(), // Scroll Top
        // y = $(elm).offset().top,
        // elementHeight = $(elm).height();   
    
    // if (eval == "object visible") return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
// }

//document ready//
$(document).ready(function() {
	var $container = $('.protfolio-latestnews, .protfolio-thinkbig, .portfolio-happening');
    $container.isotope({
        transitionDuration: '0.65s'
    });
    $(window).resize(function() {
        $container.isotope('layout');
    });
    setTimeout(function() {
        $container.isotope({
            transitionDuration: '0.65s'
        });
    }, 1000);
	var articleWidth = $("#portfolio article").width();
	$("#portfolio article .entry-image img").attr("width", articleWidth);
	
    var sWidth = $(window).width();
    if (sWidth < 480) {
        $('section .content-wrap .cont-mobile').removeClass('container');
        $('section .content-wrap .cont-mobile').addClass('container-fluid');		
    }
	if (sWidth < 770) {
		psZendeskIframe = setInterval(psHideChatButton, 100);
	}

    // ------

    $('.carousel').carousel();
    var gif = "";
    var pic = "";
    $('.hover').bind('mouseenter', function() {
        gif = $(this).children().children(".gifimg").attr('data-src');
        pic = $(this).children().children(".gifimg").attr('src');
		if (gif === "unknown") {
			gif = "";
		}
        if (gif != "" ) {
            $(this).children().children(".gifimg").attr("src", gif);
            $(this).children().children(".gifimg").attr("data-src", pic);
        }
    });
    $('.hover').bind('mouseleave', function() {
		if (gif === "unknown") {
			gif = "";
		}
        if (gif != "" ) {
        $(this).children().children(".gifimg").attr("src", pic);
        $(this).children().children(".gifimg").attr("data-src", gif);
		}
    });

    
    $('.play-btn').on('click', function() {
        $('#convo')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    });

    var playersrc = $('#convo').attr('src');
    $('#convo').mouseover(function() {
        $('#convo').attr('src', playersrc + '&autoplay=1');
    });
    $('#convo').mouseout(function() {
        $('#convo').attr('src', playersrc);
    });

    $('.lless').css('display', 'none');
    $('.lless2').css('display', 'none');
    $('.hbefore').css('display', 'none');
    $('.hbefore2').css('display', 'none');
    $('.video').magnificPopup({
        type: 'iframe',
        iframe: {
            patterns: {
                youtube: {
                    index: 'youtube.com',
                    id: 'v=',
                    src: 'www.youtube.com/embed/%id%'
                }
            }
        }
    });


    // ----
});

//window load//

$(window).load(function() {
   

    $('.lmore').click(function() {
		//alert('sss');
        $('.lmore').css('display', 'none');
        $('.lless').css('display', '');
        $('.hbefore').css('display', '');
        $('.protfolio-thinkbig').isotope('layout');
		setTimeout(function() {
            $('.protfolio-thinkbig').isotope({
                transitionDuration: '0.65s'
            });
        }, 1000);
    });
    $('.lless').click(function() {
        $('.lless').css('display', 'none');
        $('.lmore').css('display', '');
        $('.hbefore').css('display', 'none');
        $('.protfolio-thinkbig').isotope('layout');
		setTimeout(function() {
            $('.protfolio-thinkbig').isotope({
                transitionDuration: '0.65s'
            });
        }, 1000);
    });
    $('.lmore2').click(function() {
		
		
		
        $('.lmore2').css('display', 'none');
        $('.lless2').css('display', '');
        $('.hbefore2').css('display', '');
        $('.portfolio-happening').isotope('layout');
        SEMICOLON.widget.loadFlexSlider();
        SEMICOLON.documentOnResize.init();
        setTimeout(function() {
            $('.portfolio-happening').isotope({
                transitionDuration: '0.65s'
            });
        }, 1000);
		

    });
    $('.lless2').click(function() {

        $('.lless2').css('display', 'none');
        $('.lmore2').css('display', '');
        $('.hbefore2').css('display', 'none');
        $('.portfolio-happening').isotope('layout');
        SEMICOLON.widget.loadFlexSlider();
        SEMICOLON.documentOnResize.init();
        setTimeout(function() {
            $('.portfolio-happening').isotope({
                transitionDuration: '0.65s'
            });
        }, 1000);
        SEMICOLON.widget.loadFlexSlider();
    });
});

function isMobile() {
		var width = $(window).width();
		var height = $(window).height();
		if (width <= 768) {
			return true;
		}
	}

	/*$(window).load(function(){
		if(!isMobile()){
			shownotif();
		}
	});

	function shownotif(){
		homeToast("info","Education Awards" ,"To know about the Education Awards click here", "educationawards","popup");
		homeToast("info", "Knowledge Brainstorm" ,"Special Edition of Aptitude Test for Students of North East & Sikkim", "http://www.lpu.in/knowledge-brain-storm/index.php","link");
		homeToast("info", "NPTEL Awareness Workshop at LPU" ,"Date: October 12, 2017 (Thursday); Venue: Block 32-413 HRDC", "https://goo.gl/forms/13z8VULDS9gHtsIf2","link");
	}*/  	
	var profiles = {  window800:{height:800,width:800,status:1}, window200:{height:200,width:200,status:1,resizable:0 },  windowCenter: { height:300, width:400, center:1 },  windowNotNew: { height:300, width:400, center:1, createnew:0 },  }; $(function() { $(".popupwindow").popupwindow(profiles); });
	

		function homeToast(vtype,vtitle,vmsgtext,vNavigationUrl,type){
			if(type=="link"){
		toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "newestOnTop": true,
		  "progressBar": true,
		  "positionClass": "toast-top-left",
		  "preventDuplicates": true,
		  //"onclick": daljit(),
		  onclick: function () { window.open(vNavigationUrl, '_blank'); },
		  "showDuration": "12000",
		  "hideDuration": "1000",
		  "timeOut": "10000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		}
		toastr[vtype](vmsgtext, vtitle)
			}
			else if(type=="popup"){
				toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "newestOnTop": true,
		  "progressBar": true,
		  "positionClass": "toast-top-left",
		  "preventDuplicates": true,
		  onclick: function () { $("#"+vNavigationUrl).trigger("click"); },
		  "showDuration": "12000",
		  "hideDuration": "1000",
		  "timeOut": "10000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		}
		toastr[vtype](vmsgtext, vtitle)
			}
		}

// $(window).load(function(){
	// homeToast("info", "Summer School - 2017" ,"Be a LPU student this summer", "");
	
	// // homeToast("info", "Explorica" ,"Mega Event Explorica is going to be held from 22nd - 23rd November, 2016", "http://www.lpu.in/explorica");
	
	// //homeToast("info","", "All India Inter University Boxing (Men & Women) Championships 2016-17 at LPU on 24th Jan to 07th Feb 2017.", "http://www.lpu.in/events/boxingchampionship/index.php");
// });
		function setModalMaxHeight(element) {
		  this.$element     = $(element);  
		  this.$content     = this.$element.find('.modal-content');
		  var borderWidth   = this.$content.outerHeight() - this.$content.innerHeight();
		  var dialogMargin  = $(window).width() < 768 ? 20 : 60;
		  var contentHeight = $(window).height() - (dialogMargin + borderWidth);
		  var headerHeight  = this.$element.find('.modal-header').outerHeight() || 0;
		  var footerHeight  = this.$element.find('.modal-footer').outerHeight() || 0;
		  var maxHeight     = contentHeight - (headerHeight + footerHeight);

		  this.$content.css({
			  'overflow': 'hidden'
		  });
		  
		  this.$element
			.find('#myLargeModal .modal-body').css({
			  'max-height': maxHeight,
			  'overflow-y': 'auto'
		  });
		}

		$('.modal').on('show.bs.modal', function() {
		  $(this).show();
		  setModalMaxHeight(this);
		});

		$(window).resize(function() {
		  if ($('.modal.in').length != 0) {
			setModalMaxHeight($('.modal.in'));
		  }
		});


 
		