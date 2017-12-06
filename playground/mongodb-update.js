const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb');
  }
  console.log('connected to dabase');

  db.collection('Users').findOneAndUpdate({_id: new ObjectID("5a27cd8e65eafb29ad501293")},
   {$set: { name: "PeterRoss" },  $inc : { age: 3 }},{ returnOriginal: false }
 ).then((result) => {
   console.log(result);
 });
  // db.close();
}); //end
