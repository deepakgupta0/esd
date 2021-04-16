import express from "express";
import mongoose from "mongoose";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });

//Import Item Model
import Item from "../models/itemSchema.js";

const router = express.Router();

//Get All Of The Data From The DataBase
router.route('/items').get((req, res, next) => {
    Item
        .find()
        .select('name price date _id img')
        .exec()
        .then(items => {
            if (items.length < 1) {
                return res.status(404).json({
                    message: `items not found...`
                });
            } else {
                return res.status(200).json(items);
            }
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});


//Seed Items To The DataBase
router.route('/item/seed').post(upload.single('img'), (req, res, next) => {
    console.log(req.file);
    console.log("-----------------------------------------");
    let item = new Item({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        img: req.file.path
    });
    return item
        .save()
        .then(item => {
            return res.status(200).json({
                success: true,
                item: item
            });
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});



export default router;