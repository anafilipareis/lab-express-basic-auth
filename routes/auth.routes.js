// Routes are the spot where all the data manipulation is happening. 

// // making sure the app.js knows about this file (add it as a middleware).

// The routes file is where we are able to send some data/or file to the user and to receive data from them as well.


const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
 
// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
 
// POST route ==> to process form data  ???? Não percebo nada desta parte
router.post('/signup', (req, res, next) => {

    const { username, password } = req.body;
 
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
      })
      .catch(error => next(error));
  });
 
module.exports = router;