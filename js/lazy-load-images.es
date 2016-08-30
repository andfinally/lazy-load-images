/**
 * Adapted from https://github.com/BBC-News/Imager.js/
 * Loads images async, and optionally lazily, i.e. as or before they scroll into view.
 * Expects images with data-src attribute. Images can use blank pixel src
 * data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7
 * as a placeholder.
 */
(function () {

	// Utility functions
	let addEvent = (function () {
		if (document.addEventListener) {
			return function addStandardEventListener(el, eventName, fn) {
				return el.addEventListener(eventName, fn, false);
			};
		} else {
			return function addIEEventListener(el, eventName, fn) {
				return el.attachEvent('on' + eventName, fn);
			};
		}
	})();

	let debounce = (fn, wait) => {
		let timeout;
		return () => {
			let context = this, args = arguments;
			let later = () => {
				timeout = null;
				fn.apply(context, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	let throttle = (callback, limit) => {
		let wait = false;
		return function () {
			if (!wait) {
				callback.call();
				wait = true;
				setTimeout(() => {
					wait = false;
				}, limit);
			}
		}
	}

	class LazyLoadImages {

		/**
		 * Construct a new LazyLoadImages instance.
		 * To use custom options pass an optional config object.
		 *
		 * @param  opts - object
		 *
		 * Example
		 * 	{
		 * 		// Number of pixels to offset onscreen position of images to load, if lazy load is active
		 * 		lazyloadOffset: 600,
		 *
		 *		// Selector to use to find images to load
		 * 		selector: img[data-src]
		 *
		 * 		// Interval to check if user has scrolled (milliseconds)
		 * 		scrollCheckInterval: 250
		 *
		 * 		// If true, we load images when (or just before) they scroll into view - otherwise we load them all on init
		 * 		lazyload: true
		 * 	}
		 * */
		constructor(opts) {
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

				// Initialise this script asynchronously
				setTimeout(() => {
					this.init()
				}, 0);
			}
		}
		
		init() {
			if (this.lazyload) {
				this.registerScrollEvent();
				this.scrolled = true;
				this.scrollCheck();
			} else {
				this.loadImages();
			}
		}

		/**
		 * Finds all the images we want to lazy load
		 * @returns {*}
		 */
		selectImages() {
			let nodeList = document.querySelectorAll(this.selector);
			return nodeList.length > 0 ? Array.prototype.slice.call(nodeList) : [];
		}

		/**
		 * On scroll, checks if any images are in view and loads them 
		 */
		scrollCheck() {
			if (this.scrolled) {
				let i = this.imagesToLoad.length;
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

		/**
		 * Adds event listeners for scroll and resize
		 */
		registerScrollEvent() {
			this.scrolled = false;

			// We set interval rather than scroll event for better behaviour on touch devices, where
			// scroll is only triggered on end scroll
			this.interval = window.setInterval(() => this.scrollCheck(), this.scrollCheckInterval);

			addEvent(window, 'scroll', throttle(() => {
				this.scrolled = true;
			}, 250));

			addEvent(window, 'resize', debounce(() => {
				this.viewportHeight = window.innerHeight;
				this.scrolled = true;
			}, 100));
		}

		/**
		 * Checks if an image hasn't already been loaded
		 * @param element
		 * @returns {boolean}
		 */
		isPlaceholder(element) {
			return !element.getAttribute('data-loaded');
		}

		/**
		 * Checks if element is in view, taking into account the offset we set in lazyloadOffset
		 * so we can load images before they come into view
		 * @param element
		 * @returns {boolean}
		 */
		isThisElementOnScreen(element) {
			let elementOffsetTop = 0;
			let offset = this.getPageOffset() + this.lazyloadOffset;

			if (element.offsetParent) {
				do {
					elementOffsetTop += element.offsetTop;
				} while (element = element.offsetParent);
			}
			return elementOffsetTop < (this.viewportHeight + offset);
		}

		/**
		 * Calls replaceImage on each image we need to load
		 * This is used when we just want to load all images at once, asynchronously
		 */
		loadImages() {
			while (this.imagesToLoad.length > 0) {
				let slice = this.imagesToLoad.splice(0, 1);
				this.replaceImage(slice[0]);
			}
		}

		/**
		 * Replaces img src with the proper one and adds a data-loaded attribute
		 * @param image - element
		 */
		replaceImage(image) {
			if (!this.isPlaceholder(image)) {
				return;
			}
			image.src = image.getAttribute('data-src');
			image.setAttribute('data-loaded', true);
		}

		/**
		 * Creates a getPageOffset method fitting the browser's capabilities
		 * @returns {Function}
		 */
		getPageOffsetGenerator() {
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

	}

	new LazyLoadImages();

}());
