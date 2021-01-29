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

router.get("/getAllUsers", (req, res) => {
    data("SELECT * FROM user;")
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        });
});

router.get("/getClientsName", (req, res) => {
    data("SELECT first_name FROM client;")
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        })
});


router.get("/getContractsByNumber", (req, res) => {
    data("SELECT * FROM contract ORDER BY number DESC;")
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err)
        })
});


router.get("/getClientsByNameUser", (req, res) => {
    data(`SELECT user.first_name, client.first_name 
             FROM client 
             JOIN user 
                 ON client.id_user = user.id;`)
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        })
});

router.get("/getNumberOfContractsPerClient", (req, res) => {
    data(`SELECT count(id_client) AS contracts, client.first_name 
            FROM client JOIN contract ON client.id = contract.id_client 
             GROUP BY first_name;`)
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        })
});

router.get("/getClientsWithoutContract", (req, res) => {
    data(`SELECT * FROM client cl
             LEFT JOIN contract ct
                 on cl.id = ct.id_client
             WHERE ct.id_client IS NULL;`)
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err)
        })
});

router.get("/getContractsMoreThan6", (req, res) => {
    data(`SELECT *
             FROM contract
             WHERE id_term_contract > 2;`)
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        })
});

router.get("/getContractsDiferent1", (req, res) => {
    data("/getContractsDiferent1")
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        })
})

router.get("/getUsersStartWithJ", (req, res) => {
    data(`SELECT first_name
          FROM user
          WHERE first_name LIKE "J%";`)
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.send(err);
        })
});

//10. Mostrar cantidad de contratos con plazo de 3, 6 y 12 del cliente con más contratos

module.exports = router;