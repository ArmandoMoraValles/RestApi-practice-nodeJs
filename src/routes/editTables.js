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

//Actualizar datos de cliente
router.post("/updateClient", (req, res) => {
    const { id, newFirstName, newSecondName, newFirstLastname, newSecondLasname, newCurp, newIdUser } = req.body;
    let oldFirstName, oldSecondName, oldFirstLastname, oldSecondLasname, oldCurp, oldIdUser;
    const oldData = [];
    const newData = [newFirstName, newSecondName, newFirstLastname, newSecondLasname, newCurp, newIdUser, id];
    let oldChanges = "",
        newChanges = "";
    let flag = false;
    mysqlConection.query(`SELECT first_name, second_name, first_lastname, second_lasname, curp, id_user 
    FROM client WHERE id = ?`, id, (err, rows) => {
        if (!err) {
            const jsonClientData = JSON.parse(JSON.stringify(rows));
            jsonClientData.map((value) => {
                oldFirstName = value.first_name;
                oldSecondName = value.second_name;
                oldFirstLastname = value.first_lastname;
                oldSecondLasname = value.second_lasname;
                oldCurp = value.curp;
                oldIdUser = value.id_user;
                oldData.push(oldFirstName, oldSecondName, oldFirstLastname, oldSecondLasname, oldCurp, oldIdUser);
            });
            mysqlConection.query(`UPDATE client SET first_name = ?, second_name = ?, 
            first_lastname = ? ,second_lasname = ?, curp = ?, id_user = ? WHERE id = ?;`, newData, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            for (let i = 0; i < oldData.length; i++) {
                if (oldData[i] !== newData[i]) {
                    oldChanges += `${oldData[i]}, `;
                    newChanges += `${newData[i]}, `;
                    flag = true;

                }
            }
            const changeData = [id, oldChanges, newChanges];
            console.log(flag);
            if (flag) {
                mysqlConection.query(`INSERT into data_move_clients (client_id, old_data, new_data) VALUES (? , ? , ?)`, changeData);
            }
            res.json(rows);
        } else {
            res.send(err);
        }
    });
});

module.exports = router;