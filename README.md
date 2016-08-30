
# Lazy Load Images

> Load images as they come into view

## To use

* Save the JS file `lazy-load-images.js` in the `js` folder to your site and link to it from your HTML page.
* Give your image tags a placeholder `src` attribute, and a `data-src` attribute with the URL of the image you want to load later. In this example we use an empty gif encoded as base64 and included inline to avoid an unnecessary request.

`<img src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7" data-src="img/land-slip.jpg" width="640" height="373">`

* The JS will replace this `src` value with whatever you have in `data-src`. If you use the default options, it'll do this if the image comes within 600 pixels below the viewport.
* Demo in `index.html`.

## To play around with the JS

* Install Node, if you haven't already, using the [Node installer](https://nodejs.org/en/). The installation includes the Node package manager `npm`.
* Using `npm`, install the Gulp build manager globally: `sudo npm install gulp -g`.
* Run `npm install` in your project directory to install dependencies.
* Run `gulp` to start the watch task which compiles the ES6 in `lazy-load-images.es` to JS.

