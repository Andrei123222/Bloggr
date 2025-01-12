const express = require('express');
const router = express.Router();


//Routes

router.get('', (req, res) => {
    const locals = {
        pageTitle : "Bloggr home",
        description : "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
    }

    res.render('index', locals);
});

router.get('/about', (req, res) => {
    res.render('about')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router;