document.addEventListener("DOMContentLoaded", function () {
	if (typeof jQuery === "undefined") {
		return;
	}

	if (typeof jQuery.fn.owlCarousel === "undefined") {
		return;
	}

	jQuery(".app-screenshots-carousel .owl-carousel").owlCarousel({
		loop: true,
		margin: 22,
		nav: true,
		dots: true,
		autoplay: true,
		autoplayTimeout: 3500,
		autoplayHoverPause: true,
		smartSpeed: 500,
		navText: [
			'<i class="fas fa-chevron-left"></i>',
			'<i class="fas fa-chevron-right"></i>'
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 2
			},
			768: {
				items: 3
			},
			1100: {
				items: 4
			}
		}
	});
});