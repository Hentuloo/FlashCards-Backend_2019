// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const validBodyValues = require('../validator/validBodyValues');
// const fs = require('fs');
// const path = require('path');

// const newUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const valid = validBodyValues({ email });
//         if (valid) return res.status(400).send(valid);
//         let rawdata = fs.readFileSync(
//             path.join(__dirname, '../models/defaultTypes.json'),
//         );
//         let types = JSON.parse(rawdata);

//         const user = new User({ email, types });
//         await User.register(user, password);
//         res.send({ status: 'success' });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };
// const login = (req, res) => {
//     try {
//         const token = jwt.sign({ id: req.user._id }, process.env.JWT_KEY, {
//             expiresIn: 20000,
//         });
//         res.send(token);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };
// const deleteAccount = (req, res) => {
//     const { email } = req.body;

//     const valid = validBodyValues({ email });
//     if (valid) return res.status(400).send(valid);

//     User.remove({ _id: req.user._id, email }, (err, modified) => {
//         if (err) return res.status(400).send(err);
//         if (modified.deletedCount === 0) {
//             return res.status(400).send({
//                 status: 'failure',
//                 message: `I don't find such email`,
//                 errorType: 'deleteUserFailure',
//             });
//         }
//         res.send({
//             status: 'success',
//             modified,
//         });
//     });
// };

// module.exports = { newUser, login, deleteAccount };
