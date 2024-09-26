const express = require("express") ; // Importando a biblioteca "Express" ; 
const router = express.Router() ; // Atribuindo a variável "router" uma instância da biblioteca express router ; 
const Category = require("../categories/Category") ; // Importando o model de categorias ;
const Article = require("./Article") ; // Importando o model de artigos ; 
const slugify = require("slugify") ; // Importando a biblioteca slugfy ; 
const adminAuth = require("../middlewares/adminAuth") ; // Importando o middleware de autenticação ; 

router.get("/admin/articles", adminAuth, (req, res) => { // Rota que exibirá os artigos cadastrados ; 
    Article.findAll({ // Selecionando todos os artigos ; 
        include: [{model: Category}] // Incluindo as categorias que o artigo referencia ; 
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles}) ; 
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) => { // Criando a rota que será responsável pela página de adicionar um novo artigo ; 
    Category.findAll().then(categories => { // Selecionando todas as categorias ; 
        res.render("admin/articles/new", {categories : categories} ) ; 
    })
})

router.post("/articles/save", (req, res) => { // Criando a rota que será responsável por salvar um artigo no banco de dados ; 
    let title = req.body.title ; // Recuperando o título do artigo ; 
    let body = req.body.body ; // Recuperando o corpo do artigo ; 
    let category = req.body.category ; // Recuperando o ID da categoria ; 

    Article.create({ // Criando o artigo ; 
        title: title, 
        slug: slugify(title), 
        body: body, 
        categoryId: category
    }).then(() => {res.redirect("/admin/articles")})
})

router.post("/articles/delete", adminAuth, (req, res) => { // Rota que será responsável por deletar uma categoria no banco ded dados ; 
    let id = req.body.id ; // Recuperando o ID e atribuindo a variável ; 
    if(id != undefined) { // Verificando se o ID é diferente de undefined ; 
        if(!isNaN(id)) { // Verificando se o ID é um número ; 
            Article.destroy({
                where : {
                    id: id
                }
            }).then(() => {res.redirect("/admin/articles")})
        } else {
            res.redirect("/admin/articles") ;
        }
    } else {res.redirect("/admin/articles"); }
})


router.get("/admin/articles/edit/:id", adminAuth, (req, res) => { // Rota que será responsável por editar um artigo ; 
    let id = req.params.id; // Recuperando o ID e atribuindo a variável ;
    Article.findByPk(id).then(article => {
        if (article != null) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article });
            });
        } else {
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/update", adminAuth, (req, res) => { // Rota que sera responsável por fazer o Update da edição no banco de dados ; 
    let id = req.body.id ; // Recuperando o ID e atribuindo a variável ;
    let title = req.body.title ; // Recuperando o título e atribuindo a variável ;
    let body = req.body.body ; // Recuperando o corpo e atribuindo a variável ;
    let category = req.body.category ; // Recuperando a categoria e atribuindo a variável ;

    Article.update({
        title: title, 
        body: body, 
        categoryId: category, 
        slug: slugify(title)
    }, {
        where: {
            id: id
        }
    }
).then(() => {res.redirect("/admin/articles")}).catch(err => {res.redirect("/")})
})

router.get("/articles/page/:num", (req, res) => { // Rota que sera responsável pela exibição de páginas ; 
    let page = req.params.num;
    let offset = 0;

    if (!isNaN(page) && page > 1) { 
        offset = (parseInt(page) - 1) * 4; // Corrigindo o cálculo do offset
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC'],
        ]
    }).then(articles => {

        let next = offset + 4 < articles.count;

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        };

        Category.findAll().then(categories => {
            res.render("admin/articles/page", { result: result, categories: categories });
        });
    });
});


module.exports = router ; // Exportando a variável router para ser utilizada por outros arquivos ; 