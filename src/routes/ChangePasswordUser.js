const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysqlConection = require("../database");

//Cambiar contraseña de usuarios
router.post("/getUser", (req, res) => {
    flagSearchBadPasswords = true;
    flagLogin = true;
    const { userName, Oldpassword, newPassword, confirmNewPassword } = req.body;
    const arrayData = [userName, Oldpassword];
    let jsonPass = [{}];
    mysqlConection.query(`SELECT * FROM bad_passwords`, (err, rows) => {
        jsonPass = JSON.parse(JSON.stringify(rows));
    });
    mysqlConection.query(`SELECT * FROM user WHERE username = ?`, arrayData, (err, rows) => {
        if (!err) {
            const jsonUser = JSON.parse(JSON.stringify(rows));
            if (jsonUser.length > 0) {
                bcrypt.compare("aezakmi", jsonUser[0].password, (err, coincidence) => {
                    flagLogin = coincidence;
                });
                if (newPassword === confirmNewPassword) {
                    jsonPass.map((value, index) => {
                        if (newPassword === value.password) {
                            flagSearchBadPasswords = false;
                        };
                    });
                    if (flagSearchBadPasswords === false || flagLogin === false) {
                        res.status(500).json({
                            success: false,
                            message: "Invalid Password",
                            code: 987123987
                        });
                    } else {
                        res.status(200).json({ succes: "valid Request" });
                        const wordInPlainText = newPassword;
                        const rondasDeSal = 10;
                        bcrypt.hash(wordInPlainText, rondasDeSal, (err, wordEncrypted) => {
                            const arrayDataEn = [wordEncrypted, userName];
                            console.log(wordEncrypted);
                            if (!err) {
                                mysqlConection.query(`UPDATE user SET password = ? WHERE username = ?;`, arrayDataEn, () => {});
                            } else {
                                res.json({ status: "Something went wrong encrypting" });
                            };
                        });
                    };
                } else {
                    console.log("Las contraseñas no coinciden");
                    res.status(500).json({ status: "Something went wrong", err: err });
                    //Si solo se ejecuta una respuesta no hay problema
                };
            } else {
                console.log("Usuario no encontrado");
                return;
            };
        };
    });
});



module.exports = router;