
Session.set('haikuImage', {
    id: '16287638134',
    owner: '130080108@N02',
    secret: 'd3ff2ffc58',
    server: '7281',
    farm: 8,
    title: 'Landscape 5 By: Anton Antonov',
    ispublic: 1,
    isfriend: 0,
    isfamily: 0
});

var imgSearchSpawn = function(event, template) {
    var lastSearchTime = Session.get('lastImageSearch');

    if (new Date() - lastSearchTime > 5000) {
        var words = template.find("#row1").value.split(' ').concat(
            template.find("#row2").value.split(' ')).concat(
            template.find("#row3").value.split(' '));
        var needle = words[Math.floor(Math.random() * words.length)];
        console.log('Searching for inspiration. Term: ', needle);
        
        flickrSearch(needle);
        Session.set('lastImageSearch', new Date());
    }
};

Template.createNewHaiku.events({
    "keyup #row1": imgSearchSpawn,
    "keyup #row2": imgSearchSpawn,
    "keyup #row3": imgSearchSpawn,
    "click #postHaikuBtn": function(event, template) {
        var row1 = template.find("#row1").value;
        var row2 = template.find("#row2").value;
        var row3 = template.find("#row3").value;

        var theImageToUse = urlFromFlickrPhoto(Session.get('haikuImage'));
        Meteor.call('addHaiku', row1, row2, row3, theImageToUse);
        Session.set("haiku-display","latest");
        Router.go('/');
    },
    "click #font-chooser li a": function(event) {
        chosenFont = event.target.innerHTML;
    },
    "click #color-chooser li a": function(event) {
        chosenColor = event.target.innerHTML;
    },
    "click #refresh-image": function(event) {
        var hej = Session.get('flickrResults');
        if (hej && hej.photos && hej.photos.photo){
            if (hej.photos.photo.length>0){
                Session.set('haikuImage', randomFlickrPhoto());
            } 
        }        
    }
});


Template.createNewHaiku.helpers({
    getAvailableFontNames: function() {
        var fontNames = [];
        for (var i = 0; i < availableTextFonts.length; i++) {
            fontNames.push(availableTextFonts[i].name);
        }       
        return fontNames;
    },
    getAvailableColorNames: function() {
        var colorNames = [];
        for (var i = 0; i < availableTextColors.length; i++) {
            colorNames.push(availableTextColors[i].name)
        }
        return colorNames;
    },
    haikuImage: function() {
        var i = Session.get('haikuImage');
        console.log('Image: ',i);
        return i;
    }
});