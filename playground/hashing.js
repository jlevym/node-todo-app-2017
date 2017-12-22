const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

hashedValue = '$2a$10$.ok5rb3PCZUaL18LjUH8XOwxRoAmp5Bx8tL3bQgpTl6fOoNiZEa1W';

bcrypt.compare(password, hashedValue, (err, res) => {
  console.log(res)
})


// var data = {
//   id: 10
// }

// var secretKey = "abc123";
//
// var token = jwt.sign(data, secretKey);
// console.log(token);
//
// var decoded = jwt.verify(token, secretKey);
// console.log('decoded : ', decoded);



// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message ${message}`);
// console.log(`Hash ${hash}`);

// var data = {
//   id :  4
// };

// this is what is sent to the sever
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// man in the middle
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();

// this is done on the server after receiving token
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (token.hash === resultHash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed. do not trust !');
// }
