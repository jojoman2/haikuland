var isThisUser = function(viewedUserId){
    return Meteor.userId() === viewedUserId;
};

Template.userProfile.events({
    "blur #userDescriptionInput": function(event,template) {
        var userDescriptionInput = $('#userDescriptionInput').val();

        $(template.find('#inputDescription')).hide();
        var userInputText = $(template.find('#userDescriptionText'));
        userInputText.show();

        Meteor.call('userDescription', userDescriptionInput);
    },

    "click #userDescriptionText": function(event,template) {
        if(isThisUser(this._id)) {
            $(template.find('#inputDescription')).show();
            $(template.find('#userDescriptionInput')).focus();
            $(template.find('#userDescriptionText')).hide();

        }
    }
});

Template.userProfile.helpers({
    "getUsername" : function(){
        return getUsername(this);
    },
    "isThisUser" : function(){
        return isThisUser(this._id);
    },
    "descriptionText" : function(){
        if(this.userDescription){
            return this.userDescription;
        }
        else if(isThisUser(this._id)){
            return "Click here to update your description";
        }
        else{
            return "";
        }
    },
    getNumberOfPosts : function(){
        return Haikus.find({owner:this._id}).count();
    },
    getNumberOfLikers : function(){
        var totalLikes = 0;

        var postedHaikus = Haikus.find({owner:this._id},{_id:true});
        postedHaikus.forEach(function(haiku){
            totalLikes += Likes.find({haikuId: haiku._id}).count();
        });
        return totalLikes;
    },
    "getHaikus" : function(){
        return Haikus.find({owner:this._id}, {sort: {createdAt: -1}}).map(addAlignmentParametersToHaikus);
    }
});