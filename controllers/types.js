const User = require('../models/user');
const validBodyValues = require('../validator/validBodyValues');
// add unique type
const newType = (req, res, next) => {
    const { title, icon } = req.body;
    const valid = validBodyValues({
        title,
        icon,
    });
    if (valid) return res.status(400).send(valid);

    //check max-value of types
    if (req.user.numberOfTypes < req.user.types.length) {
        return res.status(400).send({
            message: 'You have max number types',
            status: 'Failure',
            errorType: 'maxNumberTypes',
        });
    }

    const notUnique = req.user.types.find(type => type.title === title);
    if (notUnique) {
        return res.status(400).send({
            status: 'failure',
            error: 'title of card must be unique',
            errorType: 'typeTitleUnique',
        });
    } else {
        // if title is unique => update document
        User.findOneAndUpdate(
            {
                _id: req.user._id,
            },
            {
                $addToSet: {
                    types: [
                        {
                            title,
                            icon,
                        },
                    ],
                },
            },
            {
                new: true,
            },
            (err, model) => {
                if (err) return res.status(400).send(err);

                const newType = model.types.find(type => type.title === title);
                return res.send({
                    status: 'success',
                    id: newType._id,
                    title: newType.title,
                    icon: newType.icon,
                });
            },
        );
    }
};

//delete type
const deleteType = (req, res) => {
    const { id } = req.body;

    const valid = validBodyValues({ id });
    if (valid) return res.status(400).send(valid);
    User.findOneAndUpdate(
        {
            _id: req.user._id,
            'types._id': id,
        },
        {
            $pull: {
                types: { _id: id },
            },
        },
        (err, model) => {
            if (err) return res.send(err);
            if (model) {
                return res.send({
                    status: 'success',
                });
            } else {
                return res.status(400).send({
                    status: 'failure',
                    message: `I don't find such type`,
                    errorType: 'typeNotExist',
                });
            }
        },
    );
};

// update Type
const updateType = (req, res) => {
    const { id, title, icon } = req.body;

    const valid = validBodyValues({ id, title, icon });
    if (valid) return res.status(400).send(valid);

    const notUnique = req.user.types.find(type => type.title === title);
    if (notUnique) {
        return res.status(400).send({
            status: 'failure',
            error: 'title of card must be unique',
            errorType: 'typeTitleUnique',
        });
    } else {
        // if title is unique => update document
        User.findOneAndUpdate(
            {
                _id: req.user._id,
                'types._id': id,
            },
            {
                'types.$.title': title,
                'types.$.icon': icon,
            },
            err => {
                if (err) return res.status(400).send(err);
                return res.send({
                    status: 'success',
                });
            },
        );
    }
};

// give all types without cards
const allTypes = (req, res) => {
    const Types = req.user.types.map(type => ({
        id: type._id,
        title: type.title,
        icon: type.icon,
    }));
    res.send(Types);
};

// give one type with cards
const oneType = (req, res) => {
    const { id } = req.query;

    const valid = validBodyValues({ id });
    if (valid) return res.status(400).send(valid);

    const type = req.user.types.find(type => type._id == id);
    if (!type) {
        return res.status(400).send({
            status: 'failure',
            message: `I don't find such type`,
            errorType: 'typeNotExist',
        });
    }
    res.send(type);
};

module.exports = {
    newType,
    deleteType,
    updateType,
    allTypes,
    oneType,
};
