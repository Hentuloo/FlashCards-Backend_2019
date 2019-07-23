require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

//connect with mongodb
require('./config/db');
//passport strategies
require('./config/passport');

const userRouter = require('./routes/user');
const cardsRouter = require('./routes/cards');

app.use(bodyParser.json());

app.use(
    cors({
        origin: ['https://www.megafiszka.eu'],
    }),
);

app.use('/user/api', userRouter);
app.use('/cards/api', cardsRouter);

app.listen(process.env.PORT, function() {
    console.log(`app running on port ${process.env.PORT}`);
});
