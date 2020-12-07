'use strict';

(function () {
	let mobileSlider = document.querySelector('.radio-slider__list');
	let buttonNext = document.querySelector('.radio-slider__button--next');
	let buttonPrev = document.querySelector('.radio-slider__button--prev');
	let viewport = document.querySelector('.radio-slider__image--nursing').offsetWidth;
	let viewSlide = 0;

	buttonNext.addEventListener('click', function () {
		if (viewSlide < 3) {
			viewSlide++;
		}
		if (viewSlide === 3) {
			viewSlide = 0;
		}

		if (viewSlide === 1) {
			mobileSlider.style.left = -viewport / 2.9 * viewSlide + 'vw';
		} else if (viewSlide === 2) {
			mobileSlider.style.left = -viewport * viewSlide / 3.7 + 'vw';
		} else if (viewSlide === 0) {
			mobileSlider.style.left = 0;
		}
	});

	buttonPrev.addEventListener('click', function () {
		if (viewSlide > 0) {
			viewSlide--;
		} else {
			viewSlide = 2;
		}

		if (viewSlide === 2) {
			mobileSlider.style.left = -viewport * viewSlide / 3.7 + 'vw';
		} else if (viewSlide === 1) {
			mobileSlider.style.left = -viewport * viewSlide / 2.9 + 'vw';
		} else if (viewSlide === 0) {
			mobileSlider.style.left = 0;
		}
		
		
	});
})();