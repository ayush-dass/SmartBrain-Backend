const express = require('express')
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = require('./controllers/registrer');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
app.use(express.json());
app.use(cors())

const db = knex({
        client: 'pg',
        connection: {
          connectionString : process.env.DATABASE_URL,
          host : process.env.DATABASE_HOST,
          user : process.env.DATABASE_USER,
          port: 5432,
          password : process.env.DATABASE_PW,
          database : process.env.DATABASE_DB,
          ssl : { rejectUnauthorized: false}

        }
});


app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})