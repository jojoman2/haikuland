var getUsernameOfCurrentUser = function(){
    return getUsername(Meteor.user());
}

Meteor.methods({
  addHaiku: function(poemRow1, poemRow2, poemRow3, imageSrc) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    else {

      if (!(typeof poemRow1 === "string" && typeof poemRow2 === "string" && typeof poemRow3 === "string" && typeof imageSrc === "string")) {
        throw new Meteor.Error("incorrect-input");
      }
        else {
          if (poemRow1.length > 50 || poemRow2.length > 50 || poemRow3.length > 50) {
              throw new Meteor.Error("incorrect-input");
          }
          else {
              //Insert into collection
              Haikus.insert({
                  poemRow1: poemRow1,
                  poemRow2: poemRow2,
                  poemRow3: poemRow3,
                  imageSrc: imageSrc,
                  shares: 0,
                  createdAt: new Date(),
                  owner: Meteor.userId(),
                  username: getUsernameOfCurrentUser()
              });
          }
      }
    }

  },
  deleteHaiku: function(haikuId) {
    var haiku = Haikus.findOne(haikuId);
    if (haiku.owner !== Meteor.userId() || !Meteor.user()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Likes.remove({haikuId: haikuId});
      Comments.remove({haikuId: haikuId});
      Haikus.remove({_id: haikuId});
    }
  },
  addRemoveLike: function(haikuId) {
    if (!Meteor.user()) {
      throw new Meteor.Error("not-authorized");
    } else {
      //Checks that the haikuId exists
      var haiku = Haikus.findOne({
        _id: haikuId
      });
      if (!haiku) {
        throw new Meteor.Error("incorrect-input");
      }
      else{
        var likeInfo = {
          userId: Meteor.userId(),
          haikuId: haikuId
        };

        var existingLikes = Likes.findOne(likeInfo);

        if (existingLikes) {
          Likes.remove(likeInfo);
        } else {
          Likes.insert(likeInfo);
        }
      }
    }
  },
  addComment: function(haikuId, text) {
    if (!Meteor.user()) {
      throw new Meteor.Error("not-authorized");
    }
    else {
      //Check if haikuId exists
      var haiku = Haikus.findOne({
        _id: haikuId
      });
      if (!haiku) {
        throw new Meteor.Error("incorrect-input");
      }
      else{
        if (!(typeof text === "string")) {
          throw new Meteor.Error("incorrect-input");
        }
        else {
          if(text.length>200){
              throw new Meteor.Error("incorrect-input");
          }
            else {
              Comments.insert({
                  userId: Meteor.userId(),
                  username: getUsernameOfCurrentUser(),
                  haikuId: haikuId,
                  text: text
              });
          }
        }
    }
    }
  },
  removeComment: function(commentId) {
    var comment = Comments.findOne({
      _id: commentId
    });
    var commentingUserId = comment["userId"];

    if (commentingUserId !== Meteor.userId() || !Meteor.user()) {
      throw new Meteor.Error("not-authorized");
    } else {
      Comments.remove({
        _id: commentId
      });
    }
  },
  addToShareCount: function(haikuId){
    Haikus.update(
        {
          _id: haikuId
        },
        {
          $inc: {
            shares:1
          }
        }
    )
  },
  userDescription: function(userDescriptionInput) {
      if (!Meteor.user()) {
          throw new Meteor.Error("not-authorized");
      }
      else {
          if(typeof userDescriptionInput !== "string"){
              throw new Meteor.Error("incorrect-input");
          }
          else {
              if(userDescriptionInput.length>200){
                  throw new Meteor.Error("incorrect-input");
              }
              else {
                  Meteor.users.update(
                      {
                          _id: Meteor.userId()
                      },
                      {
                          $set: {
                              userDescription: userDescriptionInput
                          }
                      }
                  );
              }
          }
      }
  }


});