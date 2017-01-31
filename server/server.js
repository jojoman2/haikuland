Meteor.startup(function() {
});

Meteor.publish("haikus", function() {
	return Haikus.find({});
});
Meteor.publish("comments", function() {
	return Comments.find();
});
Meteor.publish("likes", function() {
	return Likes.find();
});

Meteor.publish('flickr', function(){
	return Flickr.find();
});

Meteor.publish("users", function () {
	return Meteor.users.find({},{fields: {'_id': 1, 'username': 1, 'profile':1,'userDescription':1}});
});


Meteor.users.deny({
	update: function() {
		return true;
	}
});