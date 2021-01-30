const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");


const data = (sql, arrayData) => {
    return new Promise((resolve, reject) => {
        mysqlConection.query(sql, arrayData, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

router.post("/putDataClient", async(req, res) => {
    try {
        const { id, first_name, second_name, first_lastname, second_lasname, curp, id_user } = req.body;
        const date = "CURRENT_TIMESTAMP";
        if (id && first_name && second_name && first_lastname && second_lasname && curp && id_user) {
            const arrayData = [id, first_name, second_name, first_lastname, second_lasname, curp, id_user, date];
            await data(`INSERT INTO client VALUES (?,?,?,?,?,?,?,?)`, arrayData).then(() => {
                    res.status(200).json({ succes: "valid Request" });
                })
                .catch((err) => {
                    res.status(500).json({ err: err });
                });

        } else {
            res.status(500).json({ error: "Missing data" });
        }
    } catch (err) {
        res.status(500).json({ status: "Something went wrong", err: err })
    }
});

module.exports = router;