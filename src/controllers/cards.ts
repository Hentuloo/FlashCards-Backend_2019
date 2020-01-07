// const User = require('../models/user');
// const validBodyValues = require('../validator/validBodyValues');

// //add many cards
// const newCards = (req, res) => {
//     const { idType, cards } = req.body;

//     const valid = validBodyValues({ idType, cards });
//     if (valid) return res.status(400).send(valid);

//     const newCards = cards.map(card => ({
//         word: card.word,
//         description: card.description,
//     }));

//     //check max-value of cards
//     const typeToCheck = req.user.types.find(type => type._id == idType);
//     if (
//         req.user.numberOfCards <
//         newCards.length + typeToCheck.cards.length - 1
//     ) {
//         return res.status(400).send({
//             message: 'You have max number of cards in this type',
//             status: 'Failure',
//             errorType: 'maxNumberCards',
//         });
//     }

//     User.findOneAndUpdate(
//         { _id: req.user._id, 'types._id': idType },
//         {
//             $push: {
//                 'types.$.cards': [...newCards],
//             },
//         },
//         {
//             new: true,
//         },
//         (err, model) => {
//             if (err) return res.send(err);

//             // find a type with our words
//             const activeType = model.types.find(type => type._id == idType);

//             // send new cards
//             res.send(
//                 activeType.cards.slice(
//                     activeType.cards.length - newCards.length,
//                 ),
//             );
//         },
//     );
// };

// // delete word
// const deleteCard = (req, res) => {
//     const { idType, idWord } = req.body;

//     const valid = validBodyValues({ idType, idWord });
//     if (valid) return res.status(400).send(valid);

//     User.findOneAndUpdate(
//         {
//             _id: req.user._id,
//             'types._id': idType,
//             'types.cards._id': idWord,
//         },
//         {
//             $pull: {
//                 'types.$.cards': { _id: idWord },
//             },
//         },
//         (err, model) => {
//             if (err) return res.send(err);
//             if (model) {
//                 return res.send({
//                     status: 'success',
//                 });
//             } else {
//                 return res.status(400).send({
//                     status: 'failure',
//                     message: `I don't find such card`,
//                     errorType: 'cardNotExist',
//                 });
//             }
//         },
//     );
// };

// module.exports = {
//     deleteCard,
//     newCards,
// };
