const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to mongodb');
  }
  console.log('connected to dabase');

  db.collection('Todos')
//   .insertOne({title: 'this is my first use of MongoClient', completed: false},
//   (err, result) => {
//     if (err) {
//       return console.log('unable to insert todos', err);
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//
//   db.close();
// });

db.collection('Users').insertOne({
  name: 'Jeffrey',
  age: 25,
  location: 'Israel'
}, (err, result) => {
  if (err) {
    return console.log('unable to save to users', err);
  }
  console.log(result.ops);
  });
db.close();
});
