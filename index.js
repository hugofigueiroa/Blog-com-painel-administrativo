const express = require("express") ; // Importando a biblioteca "Express" ; 
const app = express() ; // Atribuindo a variável "app" uma instância de Express ; 
const bodyParser = require("body-parser") ; 
const session = require("express-session") ; 
const connection = require("./database/database"); // Importando a conexão com o banco de dados ; 

// SESSIONS ; 
app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 30000000000}
}))

app.get("/session", (req, res) => {
    req.session.nome = "Hugo Bezerra Figueiroa" ; 
    res.send("Sessão gerada") ; 
}) ;

app.get("/leitura", (req, res) => {
    res.json({
        nome: req.session.nome 
    })
}) ;


// MODELS ; 
const Article = require("./articles/Article") ; // Importando o model de Article ; 
const Category = require("./categories/Category") ; // Importando o model de Categoria ; 
const User = require("./user/User") ; // Importando o model de Usuário ; 

// BODY PARSER ; 
app.use(bodyParser.urlencoded({extended:true})) ; 
app.use(bodyParser.json()) ; 
app.use(express.urlencoded({extended: true}))

// CONTROLLERS ; 
const categoriesController = require("./categories/CategoriesController") ; // Atribuindo a variável as rotas que estão dentro do controller ; 
const articlesController = require("./articles/ArticlesController") ; // Atribuindo a variável as rotas que estão dentro do controller ; 
const usersController = require("./user/UsersController") ; // Atribuindo a variável as rotas que estão dentro do controller ; 

app.use("/", categoriesController) ; // Utilizando as rotas que estão dentro do controller ; 
app.use("/", articlesController) ; // Utilizando as rotas que estão dentro do controller ; 
app.use("/", usersController) ; // Utilizando as rotas que estão dentro do controller ; 


// VIEW ENGINE ; 
app.set("view engine", "ejs") ; 

// STATIC ; 
app.use(express.static("public")) ; 

// DATABASE ; 
connection
    .authenticate()
    .then(() => console.log("Conexão com o banco feita com sucesso!"))
    .catch((error) => {console.log(error)})

// CRIAÇÃO DE ROTAS ; 

app.get("/", (req, res) => { // Criando a rota principal ; 
    Article.findAll({
        order: [
            ['id', 'DESC'],
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories}) ; 
        })
    })
})

app.get("/:slug", (req, res) => { 
    let slug = req.params.slug; 
    Article.findOne({
        where: { slug: slug }
    }).then(article => { // Renomeando para 'article' (singular)
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories }); // Alterando para 'article'
            })
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        console.log(error);
        res.redirect("/");
    });
});


app.get("/category/:slug", (req, res) => { // Criando a rota será responsável por mostrar todos os artigos de uma determinada categoria ;  
    let slug = req.params.slug ; 
    Category.findOne({
        where: {
            slug: slug
        }, include: [{model: Article}]
    }).then(category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })
        }
        else {
            res.redirect("/"); 
        }
    }).catch((error) => {res.redirect("/")})
})

// Criando o servidor ; 
app.listen(8080, () => {console.log("O servidor está rodando na porta 8080")})