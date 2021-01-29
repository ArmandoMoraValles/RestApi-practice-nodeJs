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

router.get("/getData/:id", (req, res) => {
    const { id } = req.params;
    data("SELECT * FROM user WHERE id = ?", id).then((rows) => {
        res.json(rows);
    }).catch((err) => {
        console.log(err);
    })
});

module.exports = router;