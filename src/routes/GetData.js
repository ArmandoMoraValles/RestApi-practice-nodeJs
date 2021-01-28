const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");

router.get("/getData/:id", (req, res) => {
    const { id } = req.params;
    mysqlConection.query(`SELECT * FROM user WHERE id = ?`, id, (err, rows) => {
        if (!err) {
            res.status(200).json(rows[0])
        } else {
            console.log(err);
            res.status(500).json({ status: "Something went wrong", err: err })
        }
    });
});

module.exports = router;