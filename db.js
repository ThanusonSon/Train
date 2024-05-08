const mongoose = require('mongoose');

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/EX');
//   console.log('Connected to MongoDB!');

//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }


//const mongoose = require('mongoose');
// const mongoose = require('mongoose');

const { DB_HOST, DB_PORT, DB_NAME, DB_PASS, DB_USER } = process.env;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    user: DB_USER,
    pass: DB_PASS,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('DB Connected!!');
}).catch(err => {
    console.error('DB Connection Failed !!', err);
});