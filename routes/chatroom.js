const router = require('express').Router()
const _ = require('lodash')
var {User} = require('./../models/user');
var {Chatroom} = require('./../models/chatroom');
const {authenticate} = require('../middleware/authenticate');

router.post('/chatroom',authenticate, (req, res) => {
    
    Chatroom.find({ users: { "$in" : [req.body.targetuser,req.user._id]} }, (err, chatroom) => {
       if(err){ res.send(err); }
       

       if( chatroom.length > 0 ){

           

           let messages = chatroom[0].messages;
           
           messages.push({
            text : req.body.message,
            _creator : req.user._id
           });

           chatroom[0].messages = messages;
           
           chatroom[0].save(function (err,chatroom) {
            if (err) return res.status(401).send(err);
            res.status(200).send(chatroom)
          })

       }else{
           console.log('no records');
           let users = [];
           users.push(req.body.targetuser);
           users.push(req.user._id);

           let message = [];
           message.push({
               text : req.body.message,
               _creator : req.user._id
           });

           let chatroom = new Chatroom({
               users : users,
               messages : message

           }) 
           chatroom.save(function (err) {
            if (err) return res.status(401).send(err);
            res.status(200).send(chatroom)
            
          })
       }
    });

    
  });

module.exports = router