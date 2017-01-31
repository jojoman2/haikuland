Meteor.subscribe('flickr');

var url = function(farm, server, id, secret, size) {
	if (!size) {
		size = '';
	}
	return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + size + '.jpg';
};

flickrPhotosInSession = function() {
	var flickrPhotos = Session.get('flickrResults');
	if (flickrPhotos && flickrPhotos.photos && flickrPhotos.photos.photo) {
		return flickrPhotos.photos.photo;
	} else {
		return [];
	}
};

randomFlickrPhoto = function() {
	var photos = flickrPhotosInSession();
	return photos[Math.floor(Math.random()*(photos.length-1))];
};

urlFromFlickrPhoto = function(photo) {
	return url(photo.farm, photo.server, photo.id, photo.secret, '');
};


/*Session.set('flickrResults', {
	photos: {
		photo: [{
			id: '16287638134',
			owner: '130080108@N02',
			secret: 'd3ff2ffc58',
			server: '7281',
			farm: 8,
			title: 'Landscape 5 By: Anton Antonov',
			ispublic: 1,
			isfriend: 0,
			isfamily: 0
		}],
	},
});
*/


Template.flickrtest.events({
	'submit': function(event) {
		var needle = event.target.needle.value;
		flickrSearch(needle);
		event.preventDefault();
	}
});

Template.inspirationPhotos.helpers({
	flickrPhotos: flickrPhotosInSession,
	// Uses the url api
	// https://www.flickr.com/services/api/misc.urls.html
});

Template.flickrLargeSquare.helpers({
	url: function(farm, server, id, secret) {
		return url(farm, server, id, secret, '_q');
	}
});

Template.flickrSquare.helpers({
	url: function(farm, server, id, secret) {
		return url(farm, server, id, secret, '_s');
	}
});

Template.flickrPhoto.helpers({
	url: function(farm, server, id, secret) {
		return url(farm, server, id, secret, '');
	},
})