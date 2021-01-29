const express = require("express");
const { rmSync, rm } = require("fs");
const router = express.Router();
const mysqlConection = require("../database");

const data = (sql) => {
    return new Promise((resolve, reject) => {
        mysqlConection.query(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

router.get("/getAllusers", async(req, res) => {

    try {
        const rows = await data("SELECT * FROM user;");
        res.json(rows)
    } catch (err) {
        res.send(err(err))
    }

});

router.get("/getClientsName", async(req, res) => {
    try {
        const rows = await data("SELECT first_name FROM client;");
        res.send(rows)
    } catch (err) {
        res.send()
    }
});

router.get("/getClientsByNameUser", async(req, res) => {
    try {
        const rows = await data(`SELECT user.first_name, client.first_name 
        FROM client 
        JOIN user 
            ON client.id_user = user.id;`);
        res.json(rows);
    } catch (err) {
        res.send(err);
    }
});

router.get("/getNumberOfContractsPerClient", async(req, res) => {
    try {
        const rows = await data(`SELECT count(id_client) AS contracts, client.first_name 
                     FROM client JOIN contract ON client.id = contract.id_client 
                      GROUP BY first_name;`);
        res.json(rows);
    } catch (err) {
        res.send(err);
    }
});

router.get("/getClientsWithoutContract", async(req, res) => {
    try {
        const rows = await data(`SELECT * FROM client cl
                      LEFT JOIN contract ct
                          on cl.id = ct.id_client
                      WHERE ct.id_client IS NULL;`);
        res.json(rows);
    } catch (err) {
        res.send(err)
    }
});

router.get("/getContractsMoreThan6", async(req, res) => {
    try {
        const rows = await data(`SELECT *
        FROM contract
        WHERE id_term_contract > 2;`);
        res.json(rows);
    } catch (err) {
        res.send(err);
    }
});

router.get("/getContractsDiferent1", async(req, res) => {
    try {
        const rows = await data(`SELECT *
        FROM contract
        WHERE id_term_contract != 1;`)
        res.json(rows);
    } catch (err) {
        res.send(err);
    }
});

router.get("/getUsersStartWithJ", async(req, res) => {
    try {
        const rows = await data(`SELECT first_name
                   FROM user
                   WHERE first_name LIKE "J%";`);
        res.json(rows);
    } catch (err) {
        res.send(err);
    }
});

// router.get("/getUsersStartWithJ", (req, res) => {
//     data(`SELECT first_name
//           FROM user
//           WHERE first_name LIKE "J%";`)
//         .then((rows) => {
//             res.json(rows);
//         })
//         .catch((err) => {
//             res.send(err);
//         })
// });

module.exports = router;