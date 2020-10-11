'use strict';

(function () {
	let pageHeader = document.querySelector('.page-header');
	let menuButton = document.querySelector('.main-nav__toggler');

	pageHeader.classList.remove('page-header--menu-opened');
	pageHeader.classList.remove('no-js');

	menuButton.addEventListener('click', function () {
		pageHeader.classList.toggle('page-header--menu-opened');
	})
})();