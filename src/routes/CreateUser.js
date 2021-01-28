const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysqlConection = require("../database");

//Insertar usuario con contraseña encriptada
router.post("/CreateUser", (req, res) => {
    const { id, username, password, first_name, second_name, first_lastname, second_lastname } = req.body;
    const wordInTextPlain = password;
    const rondasDeSal = 10;
    bcrypt.hash(wordInTextPlain, rondasDeSal, (err, wordEncrypted) => {
        if (!err) {
            const dataArray = [id, username, wordEncrypted, first_name, second_name, first_lastname, second_lastname]
            mysqlConection.query(`INSERT INTO user VALUES (? , ? ,?, 
                 ? , ? , ? , 
                ?)`, dataArray, (err, rows) => {
                if (!err) {
                    res.status(200).json({ succes: "valid Request" });
                } else {
                    res.status(500).json({ status: "Something went wrong", err: err })
                };
            });
        } else {
            res.json({ status: "Something went wrong encrypting" })
        }
    });
});
//Backup
module.exports = router;