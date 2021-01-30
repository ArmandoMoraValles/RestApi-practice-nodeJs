const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysqlConection = require("../database");

//Fucionando esto con la rama main

//Obtener Datos
router.get("/getData/:id", (req, res) => {
    const { id } = req.params;
    mysqlConection.query(`SELECT * FROM client WHERE id = ?`, id, (err, rows) => {
        if (!err) {
            res.status(200).json(rows[0])
        } else {
            console.log(err);
            res.status(500).json({ status: "Something went wrong", err: err })
        }
    });
});

//Ruta para insertar datos en clientes
router.post("/putDataClient", (req, res) => {
    const { id, first_name, second_name, first_lastname, second_lasname, curp, id_user } = req.body;
    const ArrayData = [id, first_name, second_name, first_lastname, second_lasname, curp, id_user];
    mysqlConection.query(`INSERT INTO client VALUES (?,?,?,?,?,?,?)`, ArrayData, (err, rows) => {
        if (!err) {
            res.status(200).json({ succes: "valid Request" });
        } else {
            res.status(500).json({ status: "Something went wrong", err: err })
        };
    });
});

//Ruta para insertar datos en contratos
router.post("/putDataContract", (req, res) => {
    const { id, number, id_term_contract, id_client } = req.body;
    const arrayData = [id, number, id_term_contract, id_client];
    if (number && id_term_contract && id_client) {
        mysqlConection.query(`INSERT INTO contract VALUES (?, ?, ?, ?)`, arrayData, (err, rows) => {
            if (!err) {
                res.status(200).json({ succes: "valid Request" });
            } else {
                res.status(500).json({ status: "Something went wrong", err: err });
            };
        });
    } else {
        res.status(500).json({ error: "Missing data" });
    }
});

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

//Cambiar contraseña de usuarios
router.post("/changePasswordUser", (req, res) => {
    let flagSearchBadPasswords = true;
    let flagLogin = true;
    const { userName, Oldpassword, newPassword, confirmNewPassword } = req.body;
    const arrayData = [userName, Oldpassword];
    let jsonPass = [{}];
    mysqlConection.query(`SELECT * FROM bad_passwords`, (err, rows) => {
        jsonPass = JSON.parse(JSON.stringify(rows));
    });
    mysqlConection.query(`SELECT * FROM user WHERE username = ?`, arrayData, (err, rows) => {
        if (!err) {
            const jsonUser = JSON.parse(JSON.stringify(rows));
            console.log(jsonUser[0].password);
            if (jsonUser.length > 0) {
                console.log(Oldpassword);
                console.log(jsonUser[0].password);
                bcrypt.compare(Oldpassword, jsonUser[0].password, (err, coincidence) => {
                    flagLogin = coincidence;
                    if (newPassword === confirmNewPassword) {
                        jsonPass.map((value, index) => {
                            if (newPassword === value.password) {
                                flagSearchBadPasswords = false;
                            };
                        });
                        console.log("2", flagLogin);
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
                });
            } else {
                console.log("Usuario no encontrado");
                res.status(500).json({ status: "Something went wrong", err: err });
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