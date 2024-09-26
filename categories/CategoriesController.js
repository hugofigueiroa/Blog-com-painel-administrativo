const express = require("express") ; // Importando a biblioteca "Express" ; 
const router = express.Router() ; // Atribuindo a variável "router" uma instância da biblioteca express router ; 
const Category = require("./Category") ; // Importando o model de categoria ; 
const slugify = require("slugify") ; // Importando o slugIfy ; 

router.get("/admin/categories/new", (req, res) => { // Criando a rota responsável pela página de adicionar categoria ; 
    res.render("admin/categories/new")
})

router.post("/categories/save", (req, res) => { // Criando a rota responsável por inserir a categoria no banco de dados ; 
    console.log(req.body.title) ; 
    let title = req.body.title ; // Recuperando o título digitado pelo usuário e atribuindo a variável ; 
    
    if(title != undefined) { // Verificando se o usuário digitou um valor válido ; 
        Category.create({
            title: title, 
            slug: slugify(title)
        }).then(() => res.redirect("/admin/categories")) ; // Após inserir a categoria no banco de dados será redirecionado para a página principal ; 
    }
    else {
        res.redirect("/admin/categories/new") ; // Caso seja um valor inválido será redirecionado para a página de adicionar categorias ; 
    }
})

router.get("/admin/categories", (req, res) => { // Rota que será responsável por listar as categorias cadastradas ; 
    
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    })

})

router.post("/categories/delete", (req, res) => { // Rota que será responsável por deletar uma categoria no banco ded dados ; 
    let id = req.body.id ; 
    if(id != undefined) { // Verificando se o ID é diferente de undefined ; 
        if(!isNaN(id)) { // Verificando se o ID é um número ; 
            Category.destroy({
                where : {
                    id: id
                }
            }).then(() => {res.redirect("/admin/categories")})
        } else {
            res.redirect("/admin/categories") ;
        }
    } else {res.redirect("/admin/categories"); }
})

router.get("/admin/categories/edit/:id", (req, res) => { // Rota que será responsável por editar uma categoria no banco de dados ; 
    let id = req.params.id ; // Recuperando o ID a ser editado ; 

    if(isNaN(id)) { // Verificando se o ID é um número ; 
        res.redirect("/admin/categories") ;
    } 

    Category.findByPk(id).then(category => { // Buscando a categoria pelo ID ; 
        if(category != undefined) { // Verificando se essa categoria existe no banco de dados ; 
            res.render("admin/categories/edit", {category: category}); 
        }
        else {
            res.redirect("/admin/categories") ; 
        }
    }).catch(erro => {res.redirect("/admin/categories")})
})

router.post("/categories/update", (req, res) => { // Criando a rota que será responsável pelo update de categoria ; 
    let id = req.body.id ; // Recuperando o ID da categoria ; 
    let title = req.body.title ; // Recuperando o título da categoria ; 

    Category.update({title: title, slug: slugify(title)}, {
        where : {
            id: id
        }
    }).then(() => {res.redirect("/admin/categories")})
})

module.exports = router ; // Exportando a variável router para ser utilizada por outros arquivos ; 