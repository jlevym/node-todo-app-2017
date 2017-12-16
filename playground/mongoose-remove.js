
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//remove
// findOneAndRemove
// findByIdOneAndRemove

// Todo.remove({}).then((result) => {
//   console.log(result.result);
// });

// Todo.findOneAndRemove({_id: "5a352ed652d365915de7d69e"}).then((result) => {
//   console.log(result);
// });

Todo.findByIdAndRemove("5a352f7852d365915de7d69f").then((result) => {
  console.log(result);
});
