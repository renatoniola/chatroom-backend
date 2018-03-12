const mongoose = require('mongoose');
//const validator = require('validator');

const UserSchema = require('mongoose').model('User').schema
const _ = require('lodash');


var MessageSchema = new mongoose.Schema({
    text: {
      type : String,
      required : true  
    },
    _creator: {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})

var ChatroomSchema = new mongoose.Schema({
    chatType : String,
    users:[String],
    messages:[MessageSchema]
  });

  var Chatroom = mongoose.model('Chatroom', ChatroomSchema);
  
  module.exports = {Chatroom}