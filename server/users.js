var db = require('./database');

class Users {

    mydb = new db.Database();

    constructor() { }

    getAllClients(callback) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT name,height,eye_color,birth_year from people";
        conn.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results, fields);
            }
        })
    }

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

    insertUser(username, password, full_name, avatar, callback) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO users(id,username,password,full_name,avatar) VALUES (?,?,?,?)";

        this.getNewId(function (newID) {
            conn.query(sql, [newID, username, password, full_name, avatar], (err, results, fields) => {
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

        this.getID(username,function (id_alumne) {
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

    insertProfe(username, password, full_name, avatar, callback) {

    }

    getOneByID(id, callback) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT name,height,eye_color,birth_year " +
            "from people where id=?";
        conn.query(sql, [id], function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results, fields);
            }
        })

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
        let sql = "select id from users where username = '?';";
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

    insertPeople(name, height, eye_color, birth_year, callback) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO people(id,name,height,eye_color,birth_year) " +
            "VALUES (?,?,?,?,?)"

        this.getNewId(function (newID) {
            conn.query(sql, [newID, name, height, eye_color, birth_year], (err, results, fields) => {
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

    updatePeople(id, name, height, eye_color, birth_year, callback) {
        let conn = this.mydb.getConnection();
        let sql = "UPDATE people SET name=?,height=?,eye_color=?,birth_year=? " +
            "WHERE id=?";
        conn.query(sql, [name, height, eye_color, birth_year, id], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results);
            }
        })
    }

    updatePlanet(oldPlanet, newPlanet, callback) {

    }

    deletePeople(id, callback) {

    }


}

module.exports = {
    Users: Users
}