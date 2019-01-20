// Following the tutorial from
// http://itvagabonds.com/tutorials/manually-deploy-expressjs-app-google-app-engine-lets-encrypt-cert

/*
First, lets clone the letsencrypt utilities to our computer (you do have git, don't you?)
git clone https://github.com/letsencrypt/letsencrypt

Then we'll run letsencrypt with the manual procedure
./letsencrypt/letsencrypt-auto certonly --manual


-------------------------------------------------------------------------------
Create a file containing just this data:
mVGn8u8ig4lhC2vAw1Zdewe56Tp_8DPl4WAfuzgi5uY.LToI9ULE3ZWt45hja0mmptp7V5-4nBbh847mSuHamJs
And make it available on your web server at this URL:
http://${your-domain-here}/.well-known/acme-challenge/mVGn8u8ig4lhC2vAw1Zdewe56Tp_8DPl4WAfuzgi5uY
-------------------------------------------------------------------------------


Don't continue yet! We are going to go add the new middleware to the app and deploy it before we continue.
Inside your project, create a letsEncrypt.js file with the following lines of code.
The example has two domains (for a root and www), but you may need more/less.
The Paths and Data should come from the letsencrypt output.
From the example output above,

letsEncryptPath would be 'mVGn8u8ig4lhC2vAw1Zdewe56Tp_8DPl4WAfuzgi5uY'
and
letsEncryptData would be 'mVGn8u8ig4lhC2vAw1Zdewe56Tp_8DPl4WAfuzgi5uY.LToI9ULE3ZWt45hja0mmptp7V5-4nBbh847mSuHamJs'.
*/

//import express and express router
var express = require('express');
var router = require('express').Router();

//set constants for encryption from letsencrypt command
var letsEncryptPath = 'C0MVtbGYj3bO0AS2RZHQz4CJLjGECnYztrrViMtAoY4';
var letsEncryptData = 'C0MVtbGYj3bO0AS2RZHQz4CJLjGECnYztrrViMtAoY4.ya9Lcbxaw2HYXHvexClcXLPiiLr1P6HhHVk48Gioyxc';

var wwwletsEncryptPath = 'C0MVtbGYj3bO0AS2RZHQz4CJLjGECnYztrrViMtAoY4';
var wwwletsEncryptData = 'C0MVtbGYj3bO0AS2RZHQz4CJLjGECnYztrrViMtAoY4.ya9Lcbxaw2HYXHvexClcXLPiiLr1P6HhHVk48Gioyxc';

//make router path for letsencrypt
router.get(`/${letsEncryptPath}`, (req, res) => {
  res.send(letsEncryptData);
})

//make router path for www pathed site
router.get(`/${wwwletsEncryptPath}`, (req, res) => {
  res.send(wwwletsEncryptData);
})

//export express routes
module.exports = router;