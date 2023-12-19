// Routes are the spot where all the data manipulation is happening. 

// making sure the app.js knows about this file (add it as a middleware).

// The routes file is where we are able to send some data/or file to the user and to receive data from them as well.


const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;


//SIGN UP
// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => { res.render('auth/signup')});
 
// POST route ==> to process form data  ???? Não percebo nada desta parte
router.post('/signup', (req, res, next) => {
  // console.log('The form data: ', req.body);
  
  const { username, password } = req.body;
 
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    return User.create({
      // username: username
      username,
      // passwordHash => this is the key from the User model
      //     ^
      //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
      passwordHash: hashedPassword
    });
  })
  .then(userFromDB => {
    console.log('Newly created user is: ', userFromDB);
  })
  .catch(error => next(error));

})
  .then(userFromDB => {
  // console.log('Newly created user is: ', userFromDB);
  res.redirect('/userProfile');
});

router.get('/userProfile', (req, res) => {

//res.render('users/user-profile')
res.render('users/user-profile', { userInSession: req.session.currentUser });

});


// LOG IN
router.get('/login', (req, res) => { res.render('auth/login')});

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ username }) // <== check if there's user with the provided username
    .then(user => { // response from DB - doesn't matter if found or not)
      if (!user) { // <== if there's no user with provided email, notify the user who is trying to login
        console.log("Username not registered. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } 
      // if there's a user, compare provided password
      // with the hashed password saved in the database
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
         // if the two passwords match, render the user-profile.hbs and
        //                   pass the user object to this view
        //                                 |
        //                                 V
        //res.render('users/user-profile', { user });


        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });
 
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');


      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

 
module.exports = router;