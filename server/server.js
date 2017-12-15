
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    "text": req.body.text
  });

 todo.save().then((doc) => {
   res.status(200).send(doc);
 }, (e) => {
   res.send(e);
 });
});

app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/users', (req, res) => {
  var user = new User({
    "email": req.body.email
  });

 user.save().then((doc) => {

   res.status(200).send(doc);
 }, (e) => {
   res.send(e);
 });
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
      res.send({users});
    });
},(e) =>res.status(400).send(e));

app.listen(4000, () => {
  console.log('listening on port 4000');
});

module.exports = {app};
