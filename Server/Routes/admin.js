const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const User = require('../Models/User');


const adminLayout = '../views/layouts/admin';
/**
 * GET /
 * Admin / Login
 */

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title : "Admin",
            description : "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
        }
        res.render('admin/index', { locals, layout: adminLayout });

    } catch(error) {
        console.log(error);
    }
})

/**
 * router.get('/', async (req, res) => {
     try {
         const locals = {
             title : data.title,
             description : "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
         }
         res.render('post', { locals,data});
 
     } catch(error) {
         console.log(error);
     }
 })
 
 */

module.exports = router;