var mysql=require('mysql');

class Database{
    constructor(){}

    getConnection(){
        return mysql.createConnection(
            {
            insecureAuth : true, 
            host     : '127.0.0.1',
            port     : '3306',
            user     : 'node',
            password : 'node',
            database : 'docencia'
          }); 
    }
}

module.exports = {
    Database:Database
}