/**
 * Created by Fredrik on 2015-04-19.
 */
Template.haiku.events({
    "click .haikuDiv" : function(){
        var id = this._id;

        var haikuData = Haikus.findOne({_id:id});
        Session.set("haikuData",haikuData);
        Modal.show('haikuPopup',haikuData);
    }
});