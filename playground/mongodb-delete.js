const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb');
  }
  console.log('connected to dabase');


  db.collection('Users').findOneAndDelete({ "_id" : ObjectID("5a27cd8d5b722b29a2b78b5d")}).then((result) => {
    console.log(result);
  });



  // db.close();
}); //end
