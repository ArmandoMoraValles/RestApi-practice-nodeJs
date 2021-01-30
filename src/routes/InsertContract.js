const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");

const data = (sql, arrayData) => {
    return new Promise((resolve, reject) => {
        mysqlConection.query(sql, arrayData, (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

router.post("/putDataContract", async(req, res) => {
    try {
        const { id, number, id_term_contract, id_client } = req.body;
        const arrayData = [id, number, id_term_contract, id_client];
        if (id && number && id_term_contract && id_client) {
            await data(`INSERT INTO contract (id, number, id_term_contract, id_client) VALUES (?,?,?,?)`, arrayData).then(() => {
                    res.status(200).json({ status: "Valid Request" })
                })
                .catch(err => {
                    res.status(500).json({ status: "Something went wrong" });
                });
        } else {
            res.status(500).json({ status: "Something went wrong" })
        }
    } catch (err) {
        res.status(500).json({ status: "Something went wrong" });
    }
});

module.exports = router;