const Sequelize = require("sequelize") ; // Importando a biblioteca "Sequelize" ; 
const connection = require("../database/database") ; // Importando a conexão com o banco de dados ; 

const Category = connection.define("categories", {
    
    title: { // Campo título ; 
        type: Sequelize.STRING, // Definindo o tipo como String ; 
        allowNull: false // Não permitindo valores null ;
    }, 
    slug: {
        type: Sequelize.STRING, // Definindo o tipo como String ; 
        allowNull: false // Não permitindo valores null ; 
    }
})

Category.sync({force: false}) ; // Cria a tabela no banco, caso ela não exista ;

module.exports = Category ; // Exportando para ser utilizado em outros arquivos ; 