import mongoose from "mongoose";


const ImageSchema = new mongoose.Schema({
    
    name:String,
    img:{
        data:Buffer,
        contentType:String
    }
})

const ImageModel = mongoose.model('Image',ImageSchema);
export default ImageModel;