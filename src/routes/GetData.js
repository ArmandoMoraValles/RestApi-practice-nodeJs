const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");

const data = (sql, id) => {
    return new Promise((resolve, reject) => {
        mysqlConection.query(sql, id, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

router.get("/getData/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const rows = await data(`SELECT * FROM client WHERE id = ?`, id);
        res.json(rows);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;