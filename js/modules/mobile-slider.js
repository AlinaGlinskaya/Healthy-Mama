'use strict';

(function () {
	let mobileSlider = document.querySelector('.radio-slider__list');
	let buttonNext = document.querySelector('.radio-slider__button--next');
	let buttonPrev = document.querySelector('.radio-slider__button--prev');
	let viewport = document.querySelector('.radio-slider__image--nursing').offsetWidth;
	let viewSlide = 0;

	buttonNext.addEventListener('click', function () {
		if (viewSlide !== 0) {
			viewSlide++;
		}
		if (viewSlide === 0) {
			viewSlide +=2;
		}
		else if (viewSlide > 3) {
			viewSlide = 0;
		}

		if (viewSlide === 3) {
			mobileSlider.style.left = -viewSlide * viewport / 4.9 + 'vw';
		} else {
		
		mobileSlider.style.left = -viewSlide * viewport / 5.2 + 'vw';
		}
	});

	buttonPrev.addEventListener('click', function () {
		if (viewSlide !== 0 && viewSlide !== 2) {
			viewSlide--;
		} else if (viewSlide === 0) {
			viewSlide = 3;
		} else if (viewSlide === 2) {
			viewSlide = 0;
		}

		mobileSlider.style.left = -viewSlide * viewport  + 'px';
	});
})();