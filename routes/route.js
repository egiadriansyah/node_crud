const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Pastikan path ke model user benar
const multer = require('multer');

// Konfigurasi penyimpanan gambar
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Pastikan folder uploads ada atau dibuat secara otomatis
    },
    filename: function (req, file, cb) {
        // Ganti file.filename dengan file.fieldname
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('image'); // 'image' harus sesuai dengan nama field di form upload Anda

// insert an user into database
router.post('/add', upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.path, // Gunakan req.file.path untuk mendapatkan path lengkap file
    });

    try {
        await user.save();
        // Asumsi Anda menggunakan session untuk menyimpan pesan (pastikan express-session diinstal dan dikonfigurasi)
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get("/add", (req, res) => {
    // Pastikan Anda memiliki view 'add_users' yang sesuai
    res.render('add_users', { title: 'Add User' });
});

module.exports = router;
