import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Grid from 'gridfs-stream';
import imageRoutes from './routes/image.route.js';
import userRoutes from './routes/user.route.js';
import methodOverride from 'method-override'
dotenv.config();

const app = express();
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
const PORT = process.env.PORT || 5000;
const conn = mongoose.createConnection(process.env.CONNECTION_2);
        
app.get('/',(req,res)=>{
    var gfs = Grid(conn.db, mongoose.mongo);
    
    gfs.collection('uploads');
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
          res.render('index', { files: false });
        } else {
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
          res.render('index', { files: files });
        }
    });
    
})

app.use('/images',imageRoutes);
app.use("/users",userRoutes);

app.listen(PORT, ()=>console.log(`Server Runing on port: ${PORT}`))
mongoose.connect(process.env.CONNECTION_2,{useNewUrlParser:true,useUnifiedTopology:true})
.then(async ()=>{console.log("connected")})
.catch((error)=> console.log(error))

