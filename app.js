require ('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./Server/Config/db');

const app = express();
const PORT = process.env.PORT || 5000

//Connect to DB

connectDB();

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs'); 


app.use('/', require('./Server/Routes/main'));

app.listen(PORT, () => {
    console.log(`App listening on port : ${PORT}`);
})