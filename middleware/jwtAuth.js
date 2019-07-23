const passport = require('passport');

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next);
};

module.exports = jwtAuth;
