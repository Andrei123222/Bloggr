const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');

//Routes

/**
 * GET/
 * HOME
 */

router.get('', async (req, res) => {
    
    try {
        const locals = {
            pageTitle : "Bloggr home",
            description : "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate( [ { $sort : { createdAt: -1}} ] )
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();  

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null;
            });

     } catch(error) {
        console.log(error);
     }

});


router.get('/about', (req, res) => {
    res.render('about')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Building a blog web app",
//             body: "This is the body text"
//         },
//         {
//             title: "Working on DB functionality",
//             body: "Only testing if post works for now"
//         },
//         {
//             title: "Hello world",
//             body: "What's happening?"
//         },
        
//     ])
// }
// insertPostData();
module.exports = router;