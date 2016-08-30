'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	var _this = this,
	    _arguments = arguments;

	var addEvent = function () {
		if (document.addEventListener) {
			return function addStandardEventListener(el, eventName, fn) {
				return el.addEventListener(eventName, fn, false);
			};
		} else {
			return function addIEEventListener(el, eventName, fn) {
				return el.attachEvent('on' + eventName, fn);
			};
		}
	}();

	var debounce = function debounce(fn, wait) {
		var timeout = void 0;
		return function () {
			var context = _this,
			    args = _arguments;
			var later = function later() {
				timeout = null;
				fn.apply(context, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	var throttle = function throttle(callback, limit) {
		var wait = false;
		return function () {
			if (!wait) {
				callback.call();
				wait = true;
				setTimeout(function () {
					wait = false;
				}, limit);
			}
		};
	};

	var LazyLoadImages = function () {
		function LazyLoadImages(opts) {
			var _this2 = this;

			_classCallCheck(this, LazyLoadImages);

			opts = opts || {};
			this.selector = opts.selector || 'img[data-src]';
			this.imagesToLoad = this.selectImages();

			if (this.imagesToLoad.length > 0) {
				this.viewportHeight = window.innerHeight;
				this.lazyloadOffset = opts.lazyloadOffset || 600;
				this.scrollCheckInterval = opts.scrollCheckInterval || 250;
				this.lazyload = opts.lazyload || true;
				this.scrolled = false;
				this.getPageOffset = this.getPageOffsetGenerator();

				setTimeout(function () {
					_this2.init();
				}, 0);
			}
		}

		_createClass(LazyLoadImages, [{
			key: 'init',
			value: function init() {
				if (this.lazyload) {
					this.registerScrollEvent();
					this.scrolled = true;
					this.scrollCheck();
				} else {
					this.loadImages();
				}
			}
		}, {
			key: 'selectImages',
			value: function selectImages() {
				var nodeList = document.querySelectorAll(this.selector);
				return nodeList.length > 0 ? Array.prototype.slice.call(nodeList) : [];
			}
		}, {
			key: 'scrollCheck',
			value: function scrollCheck() {
				if (this.scrolled) {
					var i = this.imagesToLoad.length;
					while (i--) {
						if (this.isThisElementOnScreen(this.imagesToLoad[i])) {
							this.replaceImage(this.imagesToLoad[i]);
							this.imagesToLoad.splice(i, 1);
						}
					}
				}

				if (this.imagesToLoad.length === 0) {
					window.clearInterval(this.interval);
				}
			}
		}, {
			key: 'registerScrollEvent',
			value: function registerScrollEvent() {
				var _this3 = this;

				this.scrolled = false;

				this.interval = window.setInterval(function () {
					return _this3.scrollCheck();
				}, this.scrollCheckInterval);

				addEvent(window, 'scroll', throttle(function () {
					_this3.scrolled = true;
				}, 250));

				addEvent(window, 'resize', debounce(function () {
					_this3.viewportHeight = window.innerHeight;
					_this3.scrolled = true;
				}, 100));
			}
		}, {
			key: 'isPlaceholder',
			value: function isPlaceholder(element) {
				return !element.getAttribute('data-loaded');
			}
		}, {
			key: 'isThisElementOnScreen',
			value: function isThisElementOnScreen(element) {
				var elementOffsetTop = 0;
				var offset = this.getPageOffset() + this.lazyloadOffset;

				if (element.offsetParent) {
					do {
						elementOffsetTop += element.offsetTop;
					} while (element = element.offsetParent);
				}
				return elementOffsetTop < this.viewportHeight + offset;
			}
		}, {
			key: 'loadImages',
			value: function loadImages() {
				while (this.imagesToLoad.length > 0) {
					var slice = this.imagesToLoad.splice(0, 1);
					this.replaceImage(slice[0]);
				}
			}
		}, {
			key: 'replaceImage',
			value: function replaceImage(image) {
				if (!this.isPlaceholder(image)) {
					return;
				}
				image.src = image.getAttribute('data-src');
				image.setAttribute('data-loaded', true);
			}
		}, {
			key: 'getPageOffsetGenerator',
			value: function getPageOffsetGenerator() {
				if (Object.prototype.hasOwnProperty.call(window, 'pageYOffset')) {
					return function () {
						return window.pageYOffset;
					};
				} else {
					return function () {
						return document.documentElement.scrollTop;
					};
				}
			}
		}]);

		return LazyLoadImages;
	}();

	new LazyLoadImages();
})();