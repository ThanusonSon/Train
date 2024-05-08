var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const productsRouter = require("./routes/products")
require('dotenv').config();
require('./db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');


var app = express();
var cors = require('cors');
app.use(cors());

// const mongoose = require('mongoose');
// const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS} = process.env
// mongoose.connect(`mongoose://${DB_HOST}:${DB_PORT}/${DB_NAME}`,{
//   user: DB_USER,
//   pass: DB_PASS,
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// }).then(()=>{
//   console.log("Connected to DB");
// }).catch(err => {
//   console.log("Error connecting to DB")});

//app.use("/products", productsRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
