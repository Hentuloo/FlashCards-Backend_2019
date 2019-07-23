const express = require('express');
const router = express.Router();

const jwtAuth = require('../middleware/jwtAuth');

const { deleteCard, newCards } = require('../controllers/cards');
const {
    newType,
    deleteType,
    updateType,
    allTypes,
    oneType,
} = require('../controllers/types');

// TYPES
router.get('/types', jwtAuth, allTypes);
router.get('/oneType', jwtAuth, oneType);
router.post('/newType', jwtAuth, newType);
router.post('/updateType', jwtAuth, updateType);
router.delete('/deleteType', jwtAuth, deleteType);

// CARDS
router.post('/newCards', jwtAuth, newCards);
router.delete('/deleteCard', jwtAuth, deleteCard);

module.exports = router;
