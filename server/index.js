const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var Users = require('./users');
var user = new Users.Users();
let app = express();
app.listen(8090);
app.use(bodyParser.json());
const accessTokenSecret = 'tokio';
const refreshTokenSecret = 'tokioRenovar';
const refreshTokens = [];
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

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
            user.insertUser(newUser.username, newUser.password, newUser.full_name, newUser.avatar, (userRes) => {

                // Verificar que el dni està o no a la taula de DNI_PROFES
                user.verifyProfe(newUser.dni, (result) => {
                    // Es clava en alumne
                    if (result == 0) {
                        user.insertAlumne(newUser.username, null, null, (alumneRes) => {
                            user.getID(newUser.username, function (id) {
                                const token = jwt.sign({
                                    user_id: id,
                                    username: newUser.username,
                                    role: "alumne"
                                }, accessTokenSecret, { expiresIn: '2h' });

                                const refreshToken = jwt.sign({
                                    user_id: id,
                                    username: newUser.username,
                                    role: "alumne"
                                }, refreshTokenSecret);

                                res.json({
                                    ok: true,
                                    data: {
                                        token,
                                        refreshToken,
                                        avatar: newUser.avatar
                                    }
                                });
                            });
                        });
                    }
                    // Es clava en professor
                    if (result == 1) {
                        user.insertProfe(newUser.username, null, (profeRes) => {
                            user.getID(newUser.username, function (id) {
                                const token = jwt.sign({
                                    user_id: id,
                                    username: newUser.username,
                                    role: "profe"
                                }, accessTokenSecret, { expiresIn: '2h' });

                                const refreshToken = jwt.sign({
                                    user_id: id,
                                    username: newUser.username,
                                    role: "profe"
                                }, refreshTokenSecret);

                                res.json({
                                    ok: true,
                                    data: {
                                        token,
                                        refreshToken,
                                        avatar: newUser.avatar
                                    }
                                });
                            });
                        });
                    }
                });
            });
        }
    });
});

app.post('/login', (req, res) => {
    // Rebre les dades i comprovar que han introduit l’usuari i la contrassenya
    if (req.body.username == "" || req.body.password == "") {
        res.status(500).send({ ok: false, error: "Faltan campos" });
    }

    var newUser = {
        dni: req.body.dni,
        username: req.body.username,
        password: req.body.password,
        full_name: req.body.full_name,
        avatar: req.body.avatar
    };

    // Comprovar que l’usuari i contrassenya és vàlid
    user.checkUser(newUser.username, newUser.password, (result) => {
        if (result == 0) {
            res.status(500).send({ ok: false, error: "Usuario o contraseña no válidos" });
        }
        else {
            // Comprovar si es alumne (retornara 1) o profe (retornara 0)
            user.profeOrAlumne(newUser.username, (profeOrAlumne) => {
                if (profeOrAlumne == 0) {
                    user.getID(newUser.username, function (id) {
                        const token = jwt.sign({
                            user_id: id,
                            username: newUser.username,
                            role: "profe"
                        }, accessTokenSecret, { expiresIn: '2h' });

                        const refreshToken = jwt.sign({
                            user_id: id,
                            username: newUser.username,
                            role: "profe"
                        }, refreshTokenSecret);

                        res.json({
                            ok: true,
                            data: {
                                token,
                                refreshToken,
                                avatar: {
                                    type: Buffer,
                                    data: []
                                }
                            }
                        });
                    });
                }

                if (profeOrAlumne == 1) {
                    user.getID(newUser.username, function (id) {
                        const token = jwt.sign({
                            user_id: id,
                            username: newUser.username,
                            role: "alumne"
                        }, accessTokenSecret, { expiresIn: '2h' });

                        const refreshToken = jwt.sign({
                            user_id: id,
                            username: newUser.username,
                            role: "alumne"
                        }, refreshTokenSecret);

                        res.json({
                            ok: true,
                            data: {
                                token,
                                refreshToken,
                                avatar: {
                                    type: Buffer,
                                    data: []
                                }
                            }
                        });
                    });
                }
            });
        }
    });
});

app.get('/notes', authenticateJWT, (req, res) => {
    if (req.user.role == "alumne") {
        user.obtenerNotas(req.user.user_id, (notes) => {
            res.status(200).send({
                ok: true,
                data: notes
            });
        })
    }
    else {
        res.status(402).send({
            ok: false,
            msg: "Has de ser alumno para acceder aquí"
        })
    }
});

app.get('/notes/:id_assig', authenticateJWT, (req, res) => {
    if (req.user.role == "alumne") {
        user.obtenerNotasAssig(req.user.user_id, req.params.id_assig, (notes) => {
            res.status(200).send({
                ok: true,
                data: notes
            });
        })
    }
    else {
        res.status(402).send({
            ok: false,
            msg: "Has de ser alumno para acceder aquí"
        })
    }
});

app.get('/assignatura/:id_assig', authenticateJWT, (req, res) => {
    user.obtenerAsignatura(req.params.id_assig, (assignatura) => {
        res.status(200).send({
            ok: true,
            data: assignatura
        });
    })
});

app.get('/moduls', authenticateJWT, (req, res) => {
    if (req.user.role == "profe") {
        user.obtenerModulos(req.user.user_id, (modulos) => {
            res.status(200).send({
                ok: true,
                data: modulos
            });
        })
    }
    else {
        res.status(402).send({
            ok: false,
            msg: "Has de ser profesor para acceder aquí"
        })
    }
});

app.get('/moduls/:id_assig', authenticateJWT, (req, res) => {
    if (req.user.role == "profe") {
        user.obtenerModulosAlumnos(req.user.user_id, req.params.id_assig,(modulos) => {
            res.status(200).send({
                ok: true,
                data: modulos
            });
        })
    }
    else {
        res.status(402).send({
            ok: false,
            msg: "Has de ser profesor para acceder aquí"
        })
    }
});

app.put('/moduls/:id_modul/:id_alumne', authenticateJWT, (req, res) => {
    if (req.user.role == "profe") {
        user.actualizarNota(req.params.id_modul, req.params.id_alumne, req.body.nota,(resu)=>{
            res.status(402).send({
                ok: resu.ok
            });
        })
    }
    else {
        res.status(402).send({
            ok: false,
            msg: "Has de ser profesor para acceder aquí"
        })
    }
});