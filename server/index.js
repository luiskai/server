const express = require('express');
const bodyParser = require('body-parser');
var Users = require('./users');
var user = new Users.Users();
let app = express();
app.listen(8090);
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    // Rebre les dades i comprovar que els camps obligatories existeixen.
    if (req.body.dni == "" || req.body.username == "" || req.body.password == "" || req.body.full_name == "") {
        res.status(500).send({ ok: false, error: "Faltan campos obligatorios" });
    }

    var newUser = {
        dni: req.body.dni,
        username: req.body.username,
        password: req.body.password,
        full_name: req.body.full_name,
        avatar: req.body.avatar
    };

    // Comprovar que el username no està donat d’alta a la taula d’usuaris.
    user.getUserByUsername(newUser.username, (result) => {
        if (result != 0) {
            res.status(500).send({ ok: false, error: "El usuario ya está dado de alta" });
        }
        else {
            // INSERTAR EL USUARIO
            user.insertUser(newUser.username, newUser.password, newUser.full_name, newUser.avatar, (res) => {
                console.log(res);

                // Verificar que el dni està o no a la taula de DNI_PROFES
                user.verifyProfe(newUser.dni, (result) => {
                    if (result == 0) {
                        user.insertAlumne(newUser.username, null, null, (res) => {
                            console.log(res);
                        });
                    }
                    if (result != 0) {
                        console.log("El dni pertenece a un profe")
                    }
                });

            });


        }
    });





});
