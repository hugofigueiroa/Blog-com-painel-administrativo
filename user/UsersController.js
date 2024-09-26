const express = require("express") ; 
const router = express.Router() ; 
const User = require("./User") ; 
const bcrypt = require("bcryptjs") ;

router.get("/admin/users", (req, res) => {
    
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {

    let email = req.body.email; 
    let password = req.body.senha; 

    if (!email || !password) {
        return res.status(400).send("Email e senha são obrigatórios.");
    }

    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt); 
        
            User.create({
                email: email,
                senha: hash // Certifique-se de que isso está correto no modelo
            }).then(() => res.redirect("/"))
            .catch((err) => {
                console.log(err);
                res.status(500).send("Erro ao criar usuário");
            });
        }
        else {
            res.redirect("/admin/users/create")
        }
    })
});

router.get("/login", (req, res) => {
    res.render("admin/users/login") ; 
})

router.post("/authenticate", (req, res) => {

    let email = req.body.email ; 
    let senha = req.body.senha ; 

    User.findOne({where: {email:email}}).then(user => {
        if(user != undefined) { // Se existe um usuário com esse e-mail ; 
            // Validação de senha ; 
            let correct = bcrypt.compareSync(senha, user.senha) ; 
            if(correct){
                req.session.user = {
                    id: user.id, 
                    email: user.email
                }
            res.redirect("/admin/articles")
            }
            else {
                res.redirect("/login"); 
            }
        }
        else {
            res.redirect("/login") ; 
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined ; 
    res.redirect("/") ;
})

module.exports = router ; 