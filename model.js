import mongoose from 'mongoose'


const User = mongoose.Schema({
	first_name : {
		type: String,
		required: true,
		max: 100
	},
	last_name: {
		type: String,
		required: true,
		max: 100
	},
	dob: {
		type: Date,
		required: true
	},
	email: {
		type: String,
		min:5,
		max:30
	},
	age: {
		type: Number,
		min:10,
		max: 100
	}
})

User.pre('save',function(next){

	var self = this;
    UserModel.find({email : self.email}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            next(new Error("User exists!"));
        }
    });
});

User.pre('deleteOne', { query: true }, function(next) {
  const self2 = this
  UserModel.find({id: self2.id}, function(err, docs){
  	console.log(docs)
  	if(docs.length) next()
  	else next(new Error('User does not exist!'))
  })
})

const UserModel = mongoose.model('User', User)

module.exports = UserModel
