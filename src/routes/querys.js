const express = require("express");
const router = express.Router();
const mysqlConection = require("../database");

//1. Mostrar todos los usuarios
router.get("/getAllUsers", (req, res) => {
    mysqlConection.query(`SELECT * FROM user;`, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            res.json({ status: "Wrong query" })
        };
    });
});

//2. Mostrar nombres de clientes
router.get("/getClientsName", (req, res) => {
    mysqlConection.query(`SELECT first_name FROM client;`, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            res.json({ status: "Wrong query" })
        };
    });
});

//3. Mostrar contratos en orden descendiente por numero
router.get("/getContractsByNumber", (req, res) => {
    mysqlConection.query(`SELECT * FROM contract 
        ORDER BY number DESC;`, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            res.json({ status: "Wrong query" });
        };
    });

});

//4. Mostrar clientes de un usuario con el nombre del usuario
router.get("/clientsByNameUser", (req, res) => {
    mysqlConection.query(`SELECT user.first_name, client.first_name 
        FROM client 
        JOIN user 
            ON client.id_user = user.id;`, (err, rows) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json({ status: "Wrong query" });
        };
    });
});

//5. Mostrar cantidad de contratos por cliente
router.get("/getNumberOfContractsPerClient", (req, res) => {
    mysqlConection.query(`SELECT count(id_client) AS contracts, client.first_name 
        FROM client JOIN contract ON client.id = contract.id_client 
        GROUP BY first_name;`, (err, rows) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json({ status: "Wrong query" });
        };
    });
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