const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');

const {
    newUser,
    login,
    deleteAccount,
} = require('../controllers/authorization');

const passport = require('passport');

router.post('/new', newUser);
router.delete('/delete', jwtAuth, deleteAccount);
router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    login,
);

module.exports = router;
