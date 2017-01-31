Router.route('/',function(){
this.render('firstPage');
});

Router.route('/new-haiku',function(){
this.render('createNewHaiku');
});

Router.route('/haiku/:id',function(){
var haikuId = this.params.id;
Session.set("redirectHaiku",haikuId);
Router.go('/');
});

Router.route('/user/:id',function(){
var item = Meteor.users.findOne({_id: this.params.id});
if(!item){
    Router.go('/');
}
this.render('userProfile',{data: item})
});
/*Router.route('/user',function(){
    this.render('userProfile')
});*/