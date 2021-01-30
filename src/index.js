const express = require("express");
const app = express(); //Esta funcion retorna un objeto
const morgan = require("morgan");

//settings //configuraciones del servidor
app.set("port", process.env.PORT || 3006);

//midlewars //funciones que se ejecutan antes de que se procese algo 
app.use(express.json()); //Si se recibe un json nuestro mudulo de expres lo entendera

//Routes //Manera de comunicar el servidor con el navegador
app.use("/api", require("./routes/CreateUser"));
app.use("/api", require("./routes/UpdateClientData"));
app.use("/api", require("./routes/ChangePasswordUser"));
app.use("/api", require("./routes/GetData"));
app.use("/api", require("./routes/InsertContract"));
app.use("/api", require("./routes/InsertClient"));
app.use("/api", require("./routes/querys"));
app.use(require("./routes/multer"));
app.use("/api", require("./routes/querys"));
app.use("/api", require("./excelDocuments/exportQuery"));

//Sataring the server
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
})