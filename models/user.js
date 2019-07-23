const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
        },
        numberOfTypes: {
            type: Number,
            default: 10,
        },
        numberOfCards: {
            type: Number,
            default: 40,
        },
        types: [
            {
                title: {
                    type: String,
                    trim: true,

                    maxlength: 20,
                    minlength: 3,
                },
                icon: {
                    type: String,
                    trim: true,
                    maxlength: 15,
                },
                cards: [
                    {
                        word: {
                            type: String,
                            trim: true,
                            required: true,
                            maxlength: 60,
                            minlength: 2,
                        },
                        description: {
                            type: String,
                            trim: true,
                            required: true,
                            maxlength: 60,
                            minlength: 2,
                        },
                        order: {
                            type: Number,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    },
);

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

module.exports = mongoose.model('User', userSchema);
