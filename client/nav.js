var toFirstPageIfNotThere = function(){
    var location = Iron.Location.get().pathname;
    if(location !== "/"){
        Router.go("/");
    }
};
var resestSearchString = function(){
    $("#searchString").val("");
    Session.set("searchTerm",null);
};

Template.nav.helpers({
    appname: function() {
 	   return Session.get('appName');
    },
    getUserId : function() {
        return Meteor.userId();
    }
});

Template.nav.events({
    "click #most-liked-haikus" : function(){
        Session.set("haiku-display","most-liked");
        toFirstPageIfNotThere();
        resestSearchString();
    },
    "click #most-shared-haikus" : function(){
        Session.set("haiku-display","most-shared");
        toFirstPageIfNotThere();
        resestSearchString();
    },
    "click #app-icon" : function(){
        Session.set("haiku-display","latest");
        resestSearchString();
    },
    "click #searchBtn" : function(event,template){
        var searchString = template.find("#searchString").value;
        $("#searchString").val("");
        Session.set("searchTerm",searchString);
    }
});


Template.nav.rendered = function(){
    $('.login-link-text').addClass('btn');
};
