// lancer express et utiliser
var express = require('express')
var app = express()
// lancer moongoose
var mongoose = require('mongoose')
// separer le l'url pour le securiser
require('dotenv').config()
// hashed le mdp
const bcrypt = require('bcrypt')
// rajouter le put et delete
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
// faire le lien entre ta base de donnes et tes requetes
// utiliser req.body etc...
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
// utiliser ejs les views
app.set('view engine', 'ejs')

// utiliser le modele
var User = require('./models/User')
var Car = require('./models/Car')


// connection base de donnes

var dbURL = process.env.DATABASE_URL
mongoose.set('strictQuery', false)

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Mongoose connection established"))
    .catch(err => console.log(err))

// definir le port du serveur
var server = app.listen(4500, function () {
    console.log("NodeJS listening on port 4500")
})

// Pour la création de compte
app.post('/api/register', function (req, res) {
    const Data = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        admin: false,
    })
    Data.save().then(() => {
        console.log('Data saved')
        res.redirect('/login')
    }).catch(err => { console.log(err) });
})
// Route de la page Register
app.get('/register', function (req, res) {
    res.render('Register');
})

//connexion
app.post('/api/login', function (req, res) {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(404).send('Email Invalid !');
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(404).send('Password Invalid!');
        }
        if (user.admin) {
            res.render('AdminPage', { user: user });
        }
        res.redirect('/userpage');
        // res.redirect('/UserPage');
    }).catch(err => { (console.error)(err) })
})

// Route page Login
app.get('/login', function (req, res) {
    res.render('Login');
})
// Route page User
app.get('/userpage', function (req, res) {
    Car.find().then(data => {
        res.render('UserPage', { data: data })
    }).catch(err => { console.log(err) });
});
// Route page Admin
app.get('/adminpage', function (req, res) {
    User.findOne().then(data => {
        res.render('AdminPage', { user: data })
    }).catch(err => { console.log(err) });
})

// route pour crée un véhicule à louer
app.post('/new-car', function (req, res) {
    const Data = new Car({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        status: true
    })
    Data.save().then(() =>
        res.send('Voiture ajoutée !'),
    ).catch(err => console.log(err));
});

// Route page pour editer ou supprimer
app.get('/car/edit', function (req, res) {
    Car.find().then(data => {
        res.render('EditCar', { car: data })
    }).catch(err => { console.log(err) });
})

// Pour editer les infos d'un véhicule
app.put('/car/edit/:id', function (req, res) {
    Car.findOne(
        {
            _id: req.params.id
        }).then(car => {
            car.make = req.body.make,
                car.model = req.body.model,
                car.year = req.body.year,
                car.color = req.body.color,


                car.save().then(() => {
                    console.log("Car changed !");
                    res.redirect('/car/edit');
                }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});

//Pour supprimer un véhicule
app.delete('/car/delete/:id', function (req, res) {
    Car.findOneAndDelete({
        _id: req.params.id
    }).then(car => {
        res.redirect('/car/edit');
    }).catch(err => { console.log(err) });
});




