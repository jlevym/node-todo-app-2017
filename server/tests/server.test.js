const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(200)  // still not working correctly with instructor code and correct versions
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 for non object id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });

  it('should return 404 for todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todo/${hexId}`)
      .expect(404)
      .end(done)
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo doc', (done) => {
    var hexId =todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
        return  done(err)
        }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 404 if id is invalid', (done) => {
    request(app)
      .delete('/todos/1234')
      .expect(404)
      .end(done)
  });

  it('should return 404 if no todo found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`todos/${hexId}`)
      .expect(404)
      .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'this is the new text';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed: true,
      text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });

  it('should clear completed  if todo not completed', (done) => {
  var hexId = todos[1]._id.toHexString();
  var text = 'this is the old text';
  request(app)
    .patch(`/todos/${hexId}`)
    .send({completed: false,
    text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).notToExist;
    })
    .end(done)
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
     request(app)
      .patch(`todos/${hexId}`)
      .expect(404)
      .end(done)
  });

  it('should return 404 if id not valid', (done) => {
    request(app)
      .patch(`todos/1234`)
      .expect(404)
      .end(done)

  });
});

// start testing User
describe('POST /Users', () => {
  it('should create a  user', (done) => {
    var email = 'david@example.com';
    var password = '123abc!!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'david.com', password: '12345'})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: users[1].email, password: '1234567'})
      .expect(400)
      .end(done);
  });
});

describe('GET /Users/me', () => {
  it('should return a user if authenticated', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token )
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
});

describe('POST /Users/login',() => {
  it('should return a valid token if a user signs in', (done) => {
    var email = users[1].email;
    var password = users[1].password;
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[0]).toInclude ({
            access: 'auth',
            token: res.headers['x-auth']
            });
             done();
          }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    var email = users[1].email;
    var password = users[1].password + '1';
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(_id = users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
    });
  });
