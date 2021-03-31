require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encryption = require('mongoose-encryption');



const app = express();
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/userDB', {useNewUrlParser: true, useUnifiedTopology: true});



const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encryption, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);

console.log(process.env.SECRET);

app.get('/', function(req, res){
  res.render('home');
});
app.get('/login', function(req, res){
  res.render('login');
});
app.get('/register', function(req, res){
  res.render('register');
});



app.post('/register', function(req, res){
  const userData = new User ({
      email: req.body.username,
      password: req.body.password
  });
  userData.save(function(err){
    if (!err) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});
app.post('/login', function(req, res){
  User.findOne({email: req.body.username}, function(err, foundItem){
    if (!err) {
      if (foundItem.password===req.body.password) {
        res.render('secrets');
      }
    } else {
      console.log(err);
    }
  })
});


app.listen(3000, function(){
  console.log('3000 has started');
});
