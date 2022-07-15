import multer from 'multer';
import {v4} from 'uuid';
import path from 'path'
import crypto from 'crypto'
import mongoose from 'mongoose';
import {GridFsStorage} from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();
const storage = new GridFsStorage({
    url: process.env.CONNECTION_URL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

const fileFilter = (req,file,cb)=>{
    let fileEnum = ['image/png','image/jpg','image/jpeg'];
    if(!fileEnum.includes(file.mimetype)){
        cb(new Error("Type is invalid"));
    }
    else{

        cb(null,true);
    }
}

const uploads=multer({storage:storage,fileFilter:fileFilter})

export default uploads