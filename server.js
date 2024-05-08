//console.log("Real");
const path = require("path");
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.static("page"));
app.use(express.static(path.join(__dirname, "page")));

app.get('/', (req, res) =>{
    //res.redirect(__dirname + "/page/index.html");
    express.res.sendFile(path.join(__dirname + "/index.html"));
})
app.get('/index', (req,res)=> res.send('This is Index 01'))
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})
app.get('/title/:name', (req, res)=>{
    res.send(`Name : ${req.params.name}`)
});
app.get('/personal', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;
    res.send(`Name : ${name} <br>E-Mail : ${email}`);
    //res.send(`E-mail : ${email}`);
  });
  

module.exports = app