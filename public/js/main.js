/*-----------------------------
 showing and hiding search bar and menu bar on clicking
 ----------------------------------*/
$(document).ready(function() {
	$("#show-search").click(function() {
		$(".search-content").fadeToggle();
		$(".close").click(function() {
			$(".search-content").fadeToggle();
		})
	});

	$("#show-cart").click(function() {
		$(".shapping-area").fadeToggle();
	});
});

/////////////////////////////
//owl carousal for slider afeter nav
	 $(function() {
 	$(".slider.owl-carousel").owlCarousel({
 		loop: true,
 		margin: 10,
 		nav: true, 
 		autoplay: true,
 		responsive: {
 			0: {
 				items:1
 			},
 			600: {
 				items: 1
 			}
 		}
 	});
 });


///////////////////////////
//owl carousel for featured products
 $(function() {
 	$(".product-active.owl-carousel").owlCarousel({
 		loop: true,
 		margin: 10,
 		nav: true, 
 		autoplay: true,
 		responsive: {
 			0: {
 				items:1
 			},
 			600: {
 				items: 2
 			},
 			1000: {
 				items: 4
 			}
 		}
 	});
 });



///////////////////////////
//owl carousel for testimonial area
 $(function() {
 	$(".testimonial-active.owl-carousel").owlCarousel({
 		loop: true,
 		margin: 10,
 		nav: true, 
 		autoplay: true,
 		responsive: {
 			0: {
 				items:1
 			}
 		}
 	});
 });


//owl carousel for featured products
 $(function() {
 	$(".blog-active.owl-carousel").owlCarousel({
 		loop: true,
 		margin: 10,
 		nav: true, 
 		autoplay: true,
 		responsive: {
 			0: {
 				items:1
 			},
 			600: {
 				items: 2
 			},
 			1000: {
 				items: 3
 			}
 		}
 	});
 });

// counter 
$('.counter').counterUp({
	delay: 10,
	time: 1000
});

/* google map
function myMap() {
	var mapOptions= {
		center: new google.maps.LatLng(51.5, -0.12),
		zoom: 10,
		mapTypeId: google.maps.mapTypeId.HYBRID
	}
	var googleMap = new google.maps.Map(document.getElementById("googleMap"),mapOptions);
}*/

////////////////////////////////////
//for related products
$(function() {
 	$(".product-active.owl-carousel").owlCarousel({
 		loop: true,
 		margin: 10,
 		nav: true, 
 		autoplay: true,
 		responsive: {
 			0: {
 				items:1
 			},
 			600: {
 				items: 2
 			},
 			1000: {
 				items: 4
 			}
 		}
 	});
 });
///////////////////////////////////////
//LOGIN PAGE

function show_signup()
{
 $("#login_div").fadeOut('fast', function() {
  $("#register_div").fadeIn();
 });
}
function show_login()
{
 $("#register_div").fadeOut('fast', function() {
  $("#login_div").fadeIn();
 });
}
/*function show_forget() {
	$(".signUp-form.login-form").fadeOut("fast", function() {
		$(".forget-form").fadeIn();
	})
}*/
 /////////////////////////////////////////////
 // price-slider active 
 $("#slider-range").slider({
 	range:true,
 	min:40,
 	max:600,
 	values: [60,570],
 	slide: function( event, ui ) {
 		$("#amount").val("$" + ui.values[0] + "-$" + ui.values[1] );
 	}
 });
 $("#amount").val("$" + $("#slider-range").slider( "values", 0 ) + "-$" + $("#slider-range").slider("values", 1 ) );

 //////////////////////////////////////////////////
 // scroll up 
 $.scrollUp({
 	scrollText: '<i class="fa fa-angle-up"></i>',
 	easingType: 'linear',
 	scrollSpeed: 900,
 	animation:'fade'
 });
/*});*/