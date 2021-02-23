const express = require('express');
const bodyParser = require('body-parser');
var Users=require('./users');
var user=new Users.Users();
let app = express();
app.listen(8080);

user.getClientByUsername("Pepe",(res)=>{
    console.log(res);
});

app.post('/register', (req) => {
    var newUser = {
        dni: req.body.dni,
        username: req.body.username,
        password: req.body.password,
        full_name: req.body.full_name,
        avatar: req.body.avatar
    };

    user.getClientByUsername(req.body.username,(res)=>{
        if(res==0){
            res.status(200).send({ ok: true, resultado: res });
        }
        if(res!=0){
            res.status(400)
            .send({
                ok: false,
                error: "Error añadiendo contacto"
            });
        }
    });
});
