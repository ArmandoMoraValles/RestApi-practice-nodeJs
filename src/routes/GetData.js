const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");

// router.get("/getData/:id", (req, res) => {
//     const { id } = req.params;
//     mysqlConection.query(`SELECT * FROM user WHERE id = ?`, id, (err, rows) => {
//         if (!err) {
//             res.status(200).json(rows[0])
//         } else {
//             console.log(err);
//             res.status(500).json({ status: "Something went wrong", err: err })
//         }
//     });
// });

const data = (sql, id) => {
    return new Promise((resolve, reject) => {
        mysqlConection.query(sql, id, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });

    })
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