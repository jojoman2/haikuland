flickrSearch = function(needle) {
	Meteor.call('flickrSearchPhotos', needle, function(error, result) {
		if (error) {
			console.error(error);
			return;
		}
		var photos = result;
		Session.set('flickrResults', photos);
	});
};