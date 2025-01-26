const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.jwtSecret;

/**
 * GET /
 * Admin / Login page
 */

router.get('/admin', async (req, res) => {
    try {
      const locals = {
        title: "Admin mode",
        description: "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express"
      }
  
      res.render('admin/adminIndex', { locals, layout: adminLayout, currentRoute: '/admin' });
    } catch (error) {
      console.log(error);
    }
});
  
/**
 * Middleware
 * Admin / Check Login
 */


const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.render('admin/unauthorized', {currentRoute: "unauthorized"});
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }
  

/**
 * POST /
 * Admin / Check Login
 */

router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Could not find username' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(402).json( { message: 'Invalid password' } );
    }

    const token = jwt.sign({ userId: user._id, username: user.username}, jwtSecret );
    res.cookie('token', token, { 
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Dashboard
*/

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, jwtSecret);  
      
      const locals = {
        title: 'Dashboard',
        description: 'A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express',
        username: decoded.username
      }
      

      const data = await Post.find();
      res.render('admin/dashboard', {
        locals,
        data,
        layout: adminLayout,
        currentRoute: '/dashboard'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });


/**
 * POST /
 * Admin / Register
 */

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await User.create({ username, password:hashedPassword });
    res.status(201).json({ message: 'User Created', user });
    res.render("admin/dashboard", { currentRoute: '/dashboard'});
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: 'User already in use'});
    }
    else {
      res.status(500).json({ message: 'Internal server error'});
    }
  }
});
  
/**
 * GET /
 * Admin - Create New Post
*/
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout,
        currentRoute: 'add-post'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

  /**
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', authMiddleware, async (req, res) => {
   try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret);   
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      author: decoded.username
    });  
    await Post.create(newPost);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Edit Post
*/
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Post",
        description: "A simple blog web application, enabling you to share your deepests thoughts. Built upon the mighty NodeJS, with the help of legends like MongoDB and Express",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
      const token = req.cookies.token;
      const decoded = jwt.verify(token, jwtSecret);   

      if (decoded.username != data.author)
        return res.render('admin/unauthorized', {currentRoute: "unauthorized"});
      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout,
        currentRoute: 'edit-post'
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });

/**
 * PUT /
 * Admin - Edit Post
*/
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      res.redirect('/dashboard');

    } catch (error) {
      console.log(error);
    }
  
  });

  
/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});

/**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
  });

module.exports = router;