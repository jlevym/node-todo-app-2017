
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = "5a33cbcbf5d28c6b7920a0eax";

if (!ObjectID.isValid(id)) {
  console.log('ojbect id not valid');
}

User.findById(id).then((user) => {
  if (!user) {
    return console.log('user not found');
  }
  console.log('user', user.email);
}), (e) => console.log(e));

// Todo.find({_id: id}).then((todos) => {
//   console.log("todos", todos);
// });
//
//
// Todo.findOne({text: "this todo inserts one valid todo via postman"})
// .then((todo) => {
//   console.log(`this is using findOne by text:  ${todo}\n`);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log(`no todo with this id`)
//   }
//   console.log(`this is find using findById: ${todo}\n`);
// }).catch((e) =>   console.log(e));


// User.findById(id).then((user) => {
//   if (!user) {
//     return console.log('no user by this id found');
//   }
//   console.log('found user: ', user);
// }).catch((e) => console.log(e))
