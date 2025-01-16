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
            title : "Bloggr home",
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
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
            });

     } catch(error) {
        console.log(error);
     }

});

/**
 * GET/
 * POST : id
 */

router.get('/post/:id', async (req, res) => {
    try {
        
        let idParam = req.params.id;
        
        const data = await Post.findById({ _id: idParam});
        
        const locals = {
            title : data.title,
            description : "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
        }
        res.render('post', { 
            locals,
            data,
            currentRoute: `post/${idParam}`
         });

    } catch(error) {
        console.log(error);
    }
})

/**
 * POST/
 * Post : searchterm
 */

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title : "Bloggr home",
            description : "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });

        res.render("search", {
            data,
            locals,
            searchTerm
        });
    } catch(error) {
        console.log(error);
    }
})

/**
 * GET/
 * Admin
 */

router.get('/admin', async (req, res) => {
    try {
      const locals = {
        title: "Admin mode",
        description: "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
      }
  
      res.render('admin/adminIndex', { locals, currentRoute: '/admin'});
    } catch (error) {
      console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', { currentRoute: '/about' })
})

router.get('/posts', async (req, res) => {
    try{

    
    const data = await Post.aggregate( [ { $sort : { createdAt: -1}} ] )
    .exec();  
    
    res.render('posts', { data, currentRoute: '/posts'})
    } catch(error) {
        console.log(error);
    }
})




module.exports = router;