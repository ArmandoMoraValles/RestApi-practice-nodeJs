const mysql = require("mysql");

//Por lo general regresa un objeto
const mysqlConection = mysql.createConnection({
    host: "localhost",
    user: "mora",
    password: "12345",
    database: "prueba"
});

mysqlConection.connect((err)=>{
    if(err){
        console.log(err);
        return;
    } else {
        console.log("Database connect");
    }
});

module.exports = mysqlConection;