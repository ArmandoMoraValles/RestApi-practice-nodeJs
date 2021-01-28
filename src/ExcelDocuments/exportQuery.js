const excel = require('exceljs');
const mysqlConection = require('../database');
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
router.get("/exportTableClient", (req, res) => {

    fs.unlink('./src/ExcelDocuments/files/client.xlsx')
        .then(() => {
            console.log('File removed')
        }).catch(err => {
            console.error('Something wrong happened removing the file', err)
        });

    res.sendFile("/download.html", { root: __dirname });
    mysqlConection.query(`SELECT * FROM client`, (err, clients, fields) => {
        const jsonClient = JSON.parse(JSON.stringify(clients));
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Clients');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'First_name', key: 'first_name', width: 30 },
            { header: 'Second_name', key: 'second_name', width: 30 },
            { header: 'First_lastname', key: 'first_lastname', width: 10, },
            { header: 'Second_lasname', key: 'second_lasname', width: 10, },
            { header: 'Curp', key: 'curp', width: 10, },
            { header: 'Id_user', key: 'id_user', width: 10, },
            { header: 'Date', key: 'date', width: 10, }
        ];
        //Add array rows
        worksheet.addRows(jsonClient);
        //write to file
        workbook.xlsx.writeFile("src/ExcelDocuments/files/client.xlsx")
            .then(() => {
                console.log("File saved");
            }).catch((err) => {
                console.log(err);
            });
    });
});

router.get("/download/:id", (req, res) => {
    res.download("src/ExcelDocuments/files/" + req.params.id, req.params.id, (err) => {
        if (!err) {
            console.log("OK!");
        } else {
            console.log(err);
        }
    });
});

module.exports = router;