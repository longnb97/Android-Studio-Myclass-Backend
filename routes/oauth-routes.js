const express = require('express');
const router = express.Router();

const passport = require('passport');

router.use('/', (req, res, next) => {
    console.log('auth-routes middleware');
})

router.get('/login', (req, res) => {res.redirect('/auth/fb')});

router.get("/fb", passport.authenticate("facebook"));
router.get(
  "/fb/cb",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login"
  })
);

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
  });

module.exports = router;