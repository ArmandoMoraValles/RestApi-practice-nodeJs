const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysqlConection = require("../database");

data = (sql, dataArray) => {
    return new Promise((resolve, reject) => {
        mysqlConection.query(sql, dataArray, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

router.post("/CreateUser", (req, res) => {
    try {
        const { id, username, password, first_name, second_name, first_lastname, second_lastname } = req.body;
        const wordInPlainText = password;
        const rondasDeSal = 10;
        bcrypt.hash(wordInPlainText, rondasDeSal, (err, wordEncrypted) => {
            if (err) {
                res.json({ status: "Something went wrong encrypting" })
            } else {
                const dataArray = [id, username, wordEncrypted, first_name, second_name, first_lastname, second_lastname];
                data(`INSERT INTO user VALUES (? , ? ,?, 
                ? , ? , ? , 
               ?)`, dataArray).then(() => {
                    res.status(200).json({ status: "Valid Request" })
                }).catch((err) => {
                    res.status(500).json({ status: "Something went wrong" });
                })
            }
        })
    } catch (err) {
        res.status(500).json({ status: "Something went wrong" });
    }
});

// //Insertar usuario con contraseña encriptada
// router.post("/CreateUser", (req, res) => {
//     const { id, username, password, first_name, second_name, first_lastname, second_lastname } = req.body;
//     const wordInTextPlain = password;
//     const rondasDeSal = 10;
//     bcrypt.hash(wordInTextPlain, rondasDeSal, (err, wordEncrypted) => {
//         if (!err) {
//             const dataArray = [id, username, wordEncrypted, first_name, second_name, first_lastname, second_lastname]
//             mysqlConection.query(`INSERT INTO user VALUES (? , ? ,?, 
//                  ? , ? , ? , 
//                 ?)`, dataArray, (err, rows) => {
//                 if (!err) {
//                     res.status(200).json({ succes: "valid Request" });
//                 } else {
//                     res.status(500).json({ status: "Something went wrong", err: err })
//                 };
//             });
//         } else {
//             res.json({ status: "Something went wrong encrypting" })
//         }
//     });
// });

module.exports = router;