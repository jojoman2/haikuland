/**
 This is a simple wrapper for the npm package flickrapi 
 (https://www.npmjs.com/package/flickrapi), so it can be used
 in a Meteor context. It provides a few convenience methods for returning
 random photos (combined with a link to the photo on Flickr) of a 
 specified search term.

	Inspired by: 
	http://meteorcapture.com/publishing-data-from-an-external-api/

 Developer notes:

   var photo =
     { id: '16287638134',
       owner: '130080108@N02',
       secret: 'd3ff2ffc58',
       server: '7281',
       farm: 8,
       title: 'Landscape 5 By: Anton Antonov',
       ispublic: 1,
       isfriend: 0,
       isfamily: 0 } ] }
*/

// Contains the API object
var flickr = {
	call: function(method, args) {
		var params = {
			api_key: Meteor.settings['flickr_api_key'],
			method: 'flickr.' + method,
			nojsoncallback: 1,
			format: 'json'
		};
		for (key in args) {
			params[key] = args[key];
		}
		return HTTP.call('GET', 'https://api.flickr.com/services/rest/', {'params': params});
	}
};

// If key and secret aren't set, don't do anything
if (Meteor.settings['flickr_api_key'] && Meteor.settings['flickr_api_secret']) {

	// Add methods for searching etc
	Meteor.methods({
		'flickrSearchPhotos': function(text) {
			if (text.length < 2) {
				throw new Meteor.Error('photo-search', 'Unable to find photos with text: ', text);
			}
			var response = flickr.call('photos.search', {
				'text': text
			});

			if (response.data) {
				return response.data;
			} else {
				throw new Meteor.Error('photo-search', 'Unable to find photos with text: ', text);
			}
		}
	});
}