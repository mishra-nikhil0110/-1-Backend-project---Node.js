const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const authenticate = require('../authenticate');

// const Dishes = require('../models/dishes');
const multer = require('multer');
const cors = require('./cors');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can uplaod only Image files!'), false);
    }
    cb(null, true);
};


const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })



    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation is not supported on /imageUpload');
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {

        res.statusCode = 200;
        res.setHeader('Content_Type', 'application/json');
        res.json(req.file);


    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /imageUpload');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation is not supported on /imageUpload');
    })




module.exports = uploadRouter;