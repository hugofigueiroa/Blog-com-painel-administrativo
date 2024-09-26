const Sequelize = require("sequelize") ; // Importando a biblioteca "Sequelize" ; 
const connection = require("../database/database") ; // Importando a conexão com o banco de dados ; 

const User = connection.define("users", {
    
    email: { // Campo título ; 
        type: Sequelize.STRING, // Definindo o tipo como String ; 
        allowNull: false // Não permitindo valores null ;
    }, 
    senha: {
        type: Sequelize.STRING, // Definindo o tipo como String ; 
        allowNull: false // Não permitindo valores null ; 
    }
})

User.sync({force: false}) ; // Cria a tabela no banco, caso ela não exista ;

module.exports = User ; // Exportando para ser utilizado em outros arquivos ; 