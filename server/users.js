const { on } = require('nodemon');
var db = require('./database');

class Users {

    mydb = new db.Database();

    constructor() { }

    getUserByUsername(user, callback) {
        let conn = this.mydb.getConnection();
        let sql = "select count(*) as num from users where username = '" + user + "';";
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results[0].num);
            }
        })
    }

    obtenerAsignatura(id_assig, callback) {
        let conn = this.mydb.getConnection();
        let sql = "select * from assignatura where id_assig = " + id_assig;
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results[0]);
            }
        })
    }

    obtenerNotas(id_alumne, callback) {
        let data = []
        let conn = this.mydb.getConnection();
        let sql = "select id_assig,nota from notes where id_alumne = " + id_alumne;
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                var i = 0;
                const len = results.length - 1;
                results.forEach(res => {
                    var objecto = {};
                    let sql = "select cod_assig from assignatura where id_assig = " + res.id_assig;
                    conn.query(sql, function (err, results, fields) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            objecto = {
                                id_assig: res.id_assig,
                                cod_assig: results[0].cod_assig,
                                nota: res.nota,
                                links: {
                                    get: "GET http://localhost:8090/assignatura/" + res.id_assig
                                }
                            };
                            data.push(objecto);
                        }
                        if (i == len) {
                            callback(data);
                        }
                        i++;
                    })
                })
                conn.end();
            }
        })
    }

    obtenerNotasAssig(id_alumne, id_assig, callback) {
        let data = []
        let conn = this.mydb.getConnection();
        let sql = "select id_assig,nota from notes where id_alumne = " + id_alumne + " and id_assig = " + id_assig;
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                results.forEach(res => {
                    var objecto = {};
                    let sql = "select cod_assig from assignatura where id_assig = " + res.id_assig;
                    conn.query(sql, function (err, results, fields) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            objecto = {
                                id_assig: res.id_assig,
                                cod_assig: results[0].cod_assig,
                                nota: res.nota,
                                links: {
                                    get: "GET http://localhost:8090/assignatura/" + res.id_assig
                                }
                            };
                            callback(objecto);
                        }
                    })
                })
                conn.end();
            }
        })
    }

    obtenerModulos(id_profe, callback) {
        let data = []
        let conn = this.mydb.getConnection();
        let sql = "select id_assig from notes where id_profe = " + id_profe;
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                var i = 0;
                var found = false;
                const len = results.length - 1;
                results.forEach(res => {
                    var objecto = {};
                    let sql = "select * from assignatura where id_assig = " + res.id_assig;
                    conn.query(sql, function (err, results, fields) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            objecto = {
                                id_assig: res.id_assig,
                                cod_assig: results[0].cod_assig,
                                nom_assig: results[0].nom_assig,
                                modul: results[0].modul,
                                curs: results[0].curs,
                                hores: results[0].hores,
                            };
                            data.forEach(resu => {
                                if (resu.id_assig == objecto.id_assig) {
                                    found = true;
                                }
                            })
                            if (found == false) {
                                data.push(objecto);
                            }
                        }
                        if (i == len) {
                            callback(data);
                        }
                        i++;
                    })
                })
                conn.end();
            }
        })
    }

    obtenerModulosAlumnos(id_profe, id_assig, callback) {
        let data = []
        let conn = this.mydb.getConnection();
        let sql = "select id_assig, id_alumne, nota from notes where id_profe = " + id_profe + " and id_assig = " + id_assig;
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                var i = 0;
                const len = results.length - 1;
                results.forEach(res => {
                    var objecto = {};
                    let sql = "select * from assignatura where id_assig = " + res.id_assig;
                    conn.query(sql, function (err, results, fields) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            let sql = "select full_name from users where id = " + res.id_alumne;
                            conn.query(sql, function (err, results2, fields) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    var objecto = {};
                                    objecto = {
                                        id_alumne: res.id_alumne,
                                        full_name: results2[0].full_name,
                                        id_assig: res.id_assig,
                                        cod_assig: results[0].cod_assig,
                                        nota: res.nota,
                                        links: {
                                            assig: "GET http://localhost:8090/assignatura/" + res.id_assig,
                                            alumne: "GET http://localhost:8090/alumne/" + res.id_alumne,
                                            nota: "PUT http://localhost:8090/moduls/" + res.id_assig + "/" + res.id_alumne
                                        }
                                    };
                                    data.push(objecto);
                                    if (i == len) {
                                        callback(data);
                                    }
                                    i++;
                                }
                            })
                        }
                    })
                })
            }
        })
    }

    actualizarNota(id_assig, id_alumne, nota, callback){
        let conn = this.mydb.getConnection();
        let sql = "update notes set nota = " + nota + " where id_assig = " + id_assig + " and id_alumne = " + id_alumne;
        console.log(sql)
        conn.query(sql, function (err, results, fields) {
            if (err) {
                callback({ok: false});
            }
            else {
                conn.end();
                callback({ok: true});
            }
        })
    }

    checkUser(user, password, callback) {
        let conn = this.mydb.getConnection();
        let sql = "select count(*) as num from users where username = '" + user + "' and password = '" + password + "';";
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results[0].num);
            }
        })
    }

    verifyProfe(dni, callback) {
        let conn = this.mydb.getConnection();
        let sql = "select count(*) as num from dni_profe where dni = '" + dni + "';";
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results[0].num);
            }
        })
    }

    profeOrAlumne(username, callback) {
        let conn = this.mydb.getConnection();
        let sql = "select count(*) as num from alumne where id_alumne = ?;";
        this.getID(username, function (id) {
            conn.query(sql, [id], function (err, results, fields) {
                if (err) {
                    console.log(err);
                }
                else {
                    conn.end();
                    callback(results[0].num);
                }
            })
        })
    }

    insertUser(username, password, full_name, avatar, callback) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO users(id,username,password,full_name,avatar) VALUES (?,?,?,?,?)";

        this.getNewId(function (newID) {
            conn.query(sql, [newID, username, password, full_name, avatar], (err, results, fields) => {
                console.log(newID, username, password, full_name, avatar);
                if (err) {
                    console.log("Error inserint dades");
                }
                else {
                    conn.end();
                    callback(results);
                }
            })
        });
    }

    insertAlumne(username, repetidor, curs, callback) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO alumne(id_alumne,repetidor,curs) VALUES (?,?,?)";

        this.getID(username, function (id_alumne) {
            conn.query(sql, [id_alumne, repetidor, curs], (err, results, fields) => {
                if (err) {
                    console.log("Error inserint dades");
                }
                else {
                    conn.end();
                    callback(results);
                }
            })
        });
    }

    insertProfe(username, departament, callback) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO professor(id_professor,departament) VALUES (?,?)";

        this.getID(username, function (id_professor) {
            conn.query(sql, [id_professor, departament], (err, results, fields) => {
                if (err) {
                    console.log("Error inserint dades");
                }
                else {
                    conn.end();
                    callback(results);
                }
            })
        });
    }

    getNewId(callback) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT max(id)+1 as newID from users";
        conn.query(sql, (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            else {
                conn.end();
                callback(results[0].newID);
            }
        });
    }

    getID(username, callback) {
        let conn = this.mydb.getConnection();
        let sql = "select id from users where username = ?;";
        conn.query(sql, [username], (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            else {
                conn.end();
                callback(results[0].id);
            }
        });
    }
}

module.exports = {
    Users: Users
}