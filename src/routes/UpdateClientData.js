const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysqlConection = require("../database");

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