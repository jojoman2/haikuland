/**
 * Created by Fredrik on 2015-04-16.
 */

var reportShare = function(haikuId){
    Meteor.call("addToShareCount",haikuId);
};

var getNumberOfLikers = function(haikuId){
    var result = Likes.find({haikuId: haikuId});
    return result.count();
};

Template.haikuPopup.helpers({
    "colorToUse" : function(haikuId) {
        var result = Likes.findOne({userId: Meteor.userId(), haikuId: haikuId});
        if (!result) {
            return "gray";
        }
        return "red";

        /*console.log(result);
        var liked = result.count() > 0;
        return liked ? "blue" : "black";*/
    },
    "getNumberOfLikers" : function () {
        return getNumberOfLikers(this._id);
    },
    "hasMoreThanOneLiker" : function(){
        return getNumberOfLikers(this._id)>0;
    },
    "getComments" : function(){
        return Comments.find({haikuId: this._id})
    }
});

Template.haikuPopup.events({
    "click #likeButton" : function(){
        Meteor.call('addRemoveLike',this._id);
    },

    "click #commentButton" : function(){
            $('#editUserComment').slideToggle("fast");   
    },

    "click #postHaikuCommentButton" : function(event, template){
        event.preventDefault();
        if(template.find("#userComment").value!=""){
            var commentToPost = template.find("#userComment").value;
            var haikuId = this._id;
            Meteor.call('addComment',haikuId,commentToPost);
            template.find("#userComment").value('');
        }
    },
    "click #usernameLink" : function(event){
        event.preventDefault();
        Router.go("/user/"+this.owner);
        $(window).scrollTop(0);
        Modal.hide(this);
    }


});

Template.haikuPopup.created = function(){
    var haikuData = Session.get("haikuData");
    Session.set("haikuData",null);
    var haikuId = haikuData._id;
    var domainAddress = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    var appName = Session.get("appName");
    var shareConfig = {
        url : domainAddress+"/haiku/"+haikuId,
        title: appName,
        description: haikuData.poemRow1+"\n"+haikuData.poemRow2+"\n"+haikuData.poemRow3,
        image: haikuData.imageSrc,
        networks: {
            google_plus: {
                after: function() {
                    reportShare(haikuId)
                }
            },
            twitter: {
                after: function() {
                    reportShare(haikuId)
                }
            },
            facebook: {
                app_id: '100165010320303',
                load_sdk: true,
                after: function() {
                    reportShare(haikuId)
                }
            },
            pinterest:{
                after: function(){
                    reportShare(haikuId)
                }
            },
            email:{
                after: function(){
                    reportShare(haikuId)
                }
            }


        }

    };

    $.getScript("/js/share.min.js", function () {
        new Share("#shareButton",shareConfig);
    });

};