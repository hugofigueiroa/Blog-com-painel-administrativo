const Sequelize = require("sequelize") ; // Importando a biblioteca "sequelize" ; 

const connection = new Sequelize("guiapress", "root", "05092005hb", {  // Atribuindo a variável "connection" um objeto do tipo sequelize ; 
    host: "localhost", 
    dialect: "mysql",
    timezone: "-03:00"
}) ;

module.exports = connection ; // Exportando a conexão para que ela possa ser usada por outros arquivos ; 