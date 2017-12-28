const config = require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');






const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;




app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

 todo.save().then((doc) => {
   res.status(200).send(doc);
 }, (e) => {
   res.send(e);
 });
});


app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos})
  }, (e) => res.status(400).send(e));
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {res.status(400).send();
  });
});

// start delete todos section
app.delete('/todos/:id', authenticate,  (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// start PATCH todos section
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.competedAt = null;
  }
  Todo.findOneAndUpdate(
    {_id: id,
    _creator: req.user._id },
    {$set: body}, {new: true}
    ).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }

    res.send({todo})
  }).catch((e) => {res.status(400).send()
    });
});

// starting users section
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

   user.save().then(() => {
     return user.generateAuthToken();
     // res.send(user);
   }).then((token) => {
     res.header('x-auth',token).send(user);
   }).catch((e) => {
     res.status(400).send(e);
   })
});

// login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate,  (req, res) => {
  res.send(req.user);
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
      res.send({users});
    });
},(e) =>res.status(400).send(e));

app.get('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send([]);
    }
    res.status(200).send({user});
  }, (e) => {
    res.status(400).send(e)
  });
});

// private route , req.user allows us to pass in user with var user = 'this';
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
     res.status(200).send();
  }, () => {
    res.status(400);
  });
});



app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

module.exports = {app};
