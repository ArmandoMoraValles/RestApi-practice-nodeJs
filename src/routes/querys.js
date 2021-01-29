const express = require("express");
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

//6.  Mostrar clientes sin contrato
router.get("/getClientsWithoutContract", (req, res) => {
    mysqlConection.query(`SELECT * FROM client cl
        LEFT JOIN contract ct
            on cl.id = ct.id_client
        WHERE ct.id_client IS NULL;`, (err, rows) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json({ status: "Wrong query" });
        };
    });
});

//7. Mostrar contratos con plazo a 6 meses
router.get("/getContractsMoreThan6", (req, res) => {
    mysqlConection.query(`SELECT *
        FROM contract
        WHERE id_term_contract > 2;`, (err, rows) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json({ status: "Wrong query" });
        };
    });
});

//8. Mostrar contratos con plazo diferente a 1 mes
router.get("/getContractsDiferent1", (req, res) => {
    mysqlConection.query(`SELECT *
        FROM contract
        WHERE id_term_contract != 1;`, (err, rows) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json({ status: "Wrong query" });
        };
    })
});

//9. Mostrar cuantos nombres de un usuario empieza con “J”
router.get("/getUsersStartWithJ", (req, res) => {
    mysqlConection.query(`SELECT first_name
        FROM user
        WHERE first_name LIKE "J%";`, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            res.json({ state: "Wrong query" });
        };
    });
});

//10. Mostrar cantidad de contratos con plazo de 3, 6 y 12 del cliente con más contratos

module.exports = router;