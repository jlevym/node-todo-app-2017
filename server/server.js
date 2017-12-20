const config = require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');





const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT;




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
    res.send({todos})
  }, (e) => res.status(400).send(e));
});

app.get('/todos/:id',(req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {res.status(400).send();
  });
});

// start delete todos section
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// start PATCH todos section
app.patch('/todos/:id', (req, res) => {
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
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }

    res.send({todo})
  }).catch((e) => {res.status(400).send()
    });
});

// starting users section
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



app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

module.exports = {app};
