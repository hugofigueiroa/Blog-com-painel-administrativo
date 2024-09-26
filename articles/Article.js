const Sequelize = require("sequelize") ; // Importando a biblioteca "Sequelize" ; 
const connection = require("../database/database") ; // Importando a conexão com o banco de dados ; 
const Category = require("../categories/Category") ; // Importando a categoria para fazer o relacionamento entre as tabelas ; 

const Article = connection.define("articles", { // Criando a tabela no banco de dados ; 
   
    title: { // Campo título ; 
        type: Sequelize.STRING, // Definindo o tipo como String ; 
        allowNull : false // Não permitindo valores null ; 
        }, 
    slug: { // Campo slug ; 
        type: Sequelize.STRING, // Definindo o tipo como String ; 
        allowNull : false // Não permitindo valores null ; 
    }, 
    body: { // Campo body ; 
        type: Sequelize.TEXT, // Definindo o tipo como Text ; 
        allowNull : false // Não permitindo valores null ; 
    }
})

 // Fazendo o relacionamento entre as tabelas ; 
Category.hasMany(Article) ; // Uma categoria tem muitos artigos ; 
Article.belongsTo(Category) ; // Um artigo pertence a uma categoria ; 

Article.sync({force: false}) // Cria a tabela no banco, caso ela não exista ; 

module.exports = Article ; // Exportando para ser utilizado em outros arquivos ; 