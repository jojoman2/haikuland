/**
 * Created by Fredrik on 2015-04-16.
 */
 var mostLikedHaikus = function(){

    var likes = Likes.find().fetch();
    var likesByHaiku = _.groupBy(_.pluck(likes, 'haikuId'));

    var arrayOfHaikus = [];
    var haikusWithLikes = {};
    _.each(_.values(likesByHaiku), function (haikus) {
        arrayOfHaikus.push([haikus[0], haikus.length]);
        haikusWithLikes[haikus[0]] = true;
    });

    arrayOfHaikus.sort(function (a, b) {
        return b[1] - a[1];
    });

    var numberOfHaikusToAdd = Math.min(arrayOfHaikus.length, maxHaikusToShowOnEachPage);

    var haikusToDisplay = [];
    for (var i = 0; i < numberOfHaikusToAdd; i++) {
        var currHaiku = Haikus.findOne({_id: arrayOfHaikus[i][0]});
        currHaiku["imagesSecond"] = i % 4 >= 2;
        haikusToDisplay.push(currHaiku);
    }

    if (arrayOfHaikus.length < maxHaikusToShowOnEachPage) {
        Haikus.find().forEach(function (haiku) {
            var lengthOfHaikuList = haikusToDisplay.length;
            if(lengthOfHaikuList >= maxHaikusToShowOnEachPage){
                return false;
            }

            if (!haikusWithLikes[haiku._id]) {
                haiku["imagesSecond"] = lengthOfHaikuList % 4 >= 2;
                haikusToDisplay.push(haiku);
            }
        });
    }

    return haikusToDisplay;
};

var latestHaikus = function() {
    return Haikus.find({}, {sort: {createdAt: -1}, limit: maxHaikusToShowOnEachPage}).map(addAlignmentParametersToHaikus);
};

var searchHaikus = function(searchWord) {
    return Haikus.find({$or : [
        {poemRow1:{$regex:searchWord, $options: 'i'} },
        {poemRow2:{$regex:searchWord, $options: 'i'} },
        {poemRow3:{$regex:searchWord, $options: 'i'} } ]
    }).map(addAlignmentParametersToHaikus);
};

var mostSharedHaikus = function(){
    return Haikus.find(
        {},
        {
            sort:{shares:-1}
        }

    ).map(addAlignmentParametersToHaikus);
};




Template.firstPage.helpers({
    getPopupTemplate: function(){
        return
    },
    getHaikus :function(){
        var searchTerm = Session.get("searchTerm");
        if(searchTerm){
            return searchHaikus(searchTerm);
        }
        var haikuToDisplay = Session.get("haiku-display")
        if(haikuToDisplay === 'most-liked'){
            return mostLikedHaikus();
        }
        else if(haikuToDisplay ==='most-shared'){
            return mostSharedHaikus();
        }
        else{
            return latestHaikus();
        }
    },
    textAboutHaikuDisplayed : function(){
        var searchTerm =  Session.get("searchTerm");
        var haikuDisplayed = Session.get("haiku-display");
        if(searchTerm){
            return "search for "+searchTerm;
        }
        if(haikuDisplayed === 'most-liked'){
            return "most liked haikus...";
        }
        else if(haikuDisplayed === 'most-shared'){
            return "most shared haikus...";
        }
        else{
            return "latest haikus...";
        }
    },
    appname: function() {
        return Session.get('appName');
    }
});

Template.firstPage.events({
   "click #app-icon" : function(){
       Session.set("searchTerm",null);
       $("#searchString").val("");
   }
});

Meteor.subscribe("haikus", function() {
    Session.set("searchTerm",null);
    var redirectHaiku = Session.get("redirectHaiku");
    if(redirectHaiku){
        Session.set("redirectHaiku",null);
        var haikuData = Haikus.findOne({_id:redirectHaiku});
        Session.set("haikuData",haikuData);
        Modal.show('haikuPopup',haikuData);
    }
});
