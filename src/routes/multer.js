const express = require("express");
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./files")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .pdf,  format allowed!'));
        }
    }
});

router.get('/upload', (req, res) => {
    res.sendFile("/index.html", { root: __dirname });

});

router.post('/subir', upload.single("file"), (req, res, err) => {
    console.log(req.file);
    res.send("file upleado correctly")
});

module.exports = router;