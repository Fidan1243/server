import mongoose from "mongoose";
import fs, { read } from 'fs';
import dotenv from 'dotenv'

import GridFsStream from 'gridfs-stream';
import ImageModel from "../models/image.model.js";
import { name } from "ejs";

dotenv.config();


const conn = mongoose.createConnection(process.env.CONNECTION_2);
export const getImages = async(req,res)=>{
    try {
        //gfs global olduğu zaman problem çıxardığı üçün function'ın içərisində qeydiyattan keçirmək lazımdır
        //Grid və ya GridFsStream işlətməyin hər hansısa bir fərqi yoxdur
        var gfs =GridFsStream(conn.db, mongoose.mongo);
        //database fsdə hansı direction(collection)'dan istifadə etməli olduğumuzu mütləq qeyd etmək lazımdır
        gfs.collection('uploads');
        gfs.files.find().toArray((err, files) => {
            // File yoxlanışı aparırıq ki, doğrudan da içərisində bir data var ya yox
            if (!files || files.length === 0) {
              res.render('index', { files: false });
            } else {
                let st="";
                //file behavior üçün booleanları set edirik
              files.map(file => {
                if (
                  file.contentType === 'image/jpeg' ||
                  file.contentType === 'image/png'
                ) {
                  file.isImage = true;

                } else {
                  file.isImage = false;
                }
              });
              res.json(files);
            }
          });
        
    } catch (err) {
        return  res.status(404).json({error: err.message})
    }

} 

export const getImageByName = async(req,res)=>{
    try {
        var gfs =GridFsStream(conn.db, mongoose.mongo);
        
        gfs.collection('uploads');

        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // gfs ilə readStreaming yaratmaq problemlər yarada bilər. Bu problem böyük bir ehtimal ilə bucket itemları
            // check edə bilməməsidir. Ona görə də multer storagedə set ettiyimiz
            // bucketname vasitəsi ilə GridFSBucket yaradıb birbaşa Bucketdən müraciət edirik
            var gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'uploads'
              });
            // File check
            if (!file || file.length === 0) {
              return res.status(404).json({
                err: 'No file exists'
              });
            }
        
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
              // bucketdəki file _id'yə bərabər olan objecti taparaq yüklənməsini təmin edir 
              const readStream = gridfsBucket.openDownloadStream(file._id);
              // yüklənən fileın response body'yə yazılmasını təmin edir
              readStream.pipe(res);
            } else {
              res.status(404).json({
                err: 'Not an image'
              });
            }
          });
    } catch (error) {
        
    }
}

export const deleteImage = async(req,res)=>{
    var gfs =GridFsStream(conn.db, mongoose.mongo);
        
        gfs.collection('uploads');
        
        gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
    
        res.redirect('/');
      });
}

export const createImage = async(req,res)=>{
    // Image avtomatik yaranır və ana səhifəyə geri qayıdırıq
    res.redirect('/');


}