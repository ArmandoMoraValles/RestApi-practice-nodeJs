const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");



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

module.exports = router;