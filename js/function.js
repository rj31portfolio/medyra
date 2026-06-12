(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.active-sticky-header").css("height", $('header.active-sticky-header .header-sticky').outerHeight());
		}	
	
		$window.on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header.active-sticky-header .header-sticky').outerHeight()
			$("header.active-sticky-header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header.active-sticky-header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}	
	
	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	if($("a[href='#top']").length){
		$(document).on("click", "a[href='#top']", function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 1500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination',
				clickable: true,
			},
			breakpoints: {
				768:{
					slidesPerView: 2,
				},
				1025:{
					slidesPerView: 3,
				},
			}
		});
	}

	/* testimonial Slider Elite JS */
	if ($('.testimonial-slider-elite').length) {
		const testimonial_slider = new Swiper('.testimonial-slider-elite .swiper', {
			slidesPerView : 1,
			speed: 1500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination',
				clickable: true,
			},
			breakpoints: {
				768:{
					slidesPerView: 2,
				},
				1025:{
					slidesPerView: 3,
				},
			}
		});
	}

	/* Company Support Slider Eliet JS */
	if ($('.company-supports-slider-elite').length) {
		const company_supports_slider_elite = new Swiper('.company-supports-slider-elite .swiper', {
			slidesPerView : 2,
			speed: 2000,
			spaceBetween: 20,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			breakpoints: {
				767:{
				  	slidesPerView: 	4,
				},
				1025:{
					slidesPerView:  5,
				}
			}
		});
	}

	/* testimonial Slider Prime JS */
	if ($('.testimonial-slider-prime').length) {
		const testimonial_slider = new Swiper('.testimonial-slider-prime .swiper', {
			slidesPerView : 1,
			speed: 1500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination-prime',
				clickable: true,
			},
			breakpoints: {
				767:{
					slidesPerView: 1,
				},
				990:{
					slidesPerView: 2,
				},
				1025:{
					slidesPerView: 2,
				},
			}
		});
	}

	/* Company Support Slider JS */
	if ($('.company-supports-slider-prime').length) {
		const company_supports_slider_prime= new Swiper('.company-supports-slider-prime .swiper', {
			slidesPerView : 2,
			speed: 2000,
			spaceBetween: 20,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			breakpoints: {
				767:{
				  	slidesPerView: 	4,
				},
				1025:{
					slidesPerView:  5,
				}
			}
		});
	}

	/* Progress Bar */
	if ($('.circle').length){	
		$('.circle').each(function() {			
			var el = $(this).circleProgress({value: 0});
			
			var rawValue = $(this).data('value'); 
				var progressValue = rawValue >= 1 ? 1 : rawValue;
				var progressBarOptions = {
					startAngle: -1.6,
					thickness: 4,
					fill: {
						color: window.getComputedStyle($(this)[0]).color 
					}
				};

			new Waypoint({
			  element: el.get(0),
			  handler: function() {
				// Initialize the progress bar
				el.circleProgress($.extend({}, progressBarOptions, {
					value: el.data('value')  
				})).on('circle-animation-progress', function(event, progress, stepValue) {
					
					var displayValue = Math.round(stepValue * 100); 
					$(this).find('.progress_value .pro_data').text(displayValue);
				});
					
				this.destroy();
			  },
			  offset: '80%'
			});			
		});		
	}

	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '70%'
		});
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 3000 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	
	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 1024))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	function showAlert(icon, title, text) {
		if (typeof Swal !== "undefined") {
			Swal.fire({
				icon: icon,
				title: title,
				text: text,
				confirmButtonColor: "#0e4b69"
			});
		}
	}

	function updateFormMessage($form, valid, msg){
		var msgClasses = valid ? "h4 text-success" : "h4 text-danger";
		$form.find("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}

	function toggleSubmitState($form, isLoading) {
		var $button = $form.find('button[type="submit"]');
		$button.prop("disabled", isLoading).toggleClass("disabled", isLoading);
	}

	function handleAjaxForm($form, options) {
		if (!$form.length) {
			return;
		}

		$form.validator({focus: false}).on("submit", function (event) {
			if (!event.isDefaultPrevented()) {
				event.preventDefault();
				toggleSubmitState($form, true);

				$.ajax({
					type: "POST",
					url: options.url,
					data: $form.serialize(),
					dataType: "json"
				}).done(function(response){
					if (response.status === "success") {
						$form[0].reset();
						updateFormMessage($form, true, response.message);
						showAlert("success", options.successTitle, response.message);
					} else {
						updateFormMessage($form, false, response.message || options.errorMessage);
						showAlert("error", "Submission Failed", response.message || options.errorMessage);
					}
				}).fail(function(xhr){
					var response = xhr.responseJSON || {};
					var message = response.message || options.errorMessage;
					updateFormMessage($form, false, message);
					showAlert("error", "Submission Failed", message);
				}).always(function(){
					toggleSubmitState($form, false);
				});
			}
		});
	}

	/* Contact and appointment form validation */
	handleAjaxForm($("#contactForm"), {
		url: "form-process.php",
		successTitle: "Message Sent",
		errorMessage: "Unable to send your message right now."
	});

	handleAjaxForm($("#appointmentForm"), {
		url: "form-appointment.php",
		successTitle: "Appointment Requested",
		errorMessage: "Unable to submit your appointment request right now."
	});
	/* Contact and appointment form validation end */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}
		
	
})(jQuery);
