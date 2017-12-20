var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
   process.env.MONGODB_URI =  'mongodb://localhost:27017/ToDoApp';
   process.env.PORT = 4000;
} else if (env === "test") {
   process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest'
   process.env.PORT = 4000;
}
