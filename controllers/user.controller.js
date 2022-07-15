import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const tokenList = {}
import User from '../models/user.model.js';

export const signin = async (req,res)=>{
    const {email,password} = req.body;
    try {

        const existingUser = await User.findOne({email});
        if(!existingUser) return res.status(404).json({message:"User doesn't exists"});
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        console.log(isPasswordCorrect)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Password"});
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},'test',{expiresIn:"1h"});
        res.status(200).json({result:existingUser,token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}
export const signup = async (req,res)=>{
    const {email,password,firstName,lastName,confirmPassword} = req.body;
    console.log(req.email)
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exists"});
        if(password != confirmPassword) return res.status(400).json({message:"Passwords don't match"});
        
        const hashedPassword = await bcrypt.hash(password,12);
        console.log(hashedPassword)
        const result = await User.create({email,password:hashedPassword,name:`${firstName} ${lastName}`})
        
        const token = jwt.sign({email:result.email,id:result._id},'test',{expiresIn:"1h"});

        const refreshToken = jwt.sign(user, "secrer-refresh", { expiresIn: 86000})
        const response = {
            "status": "Logged in",
            "token": token,
            "refreshToken": refreshToken,
        }
        tokenList[refreshToken] = response

        res.status(201).json({result,token})


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"});
        
    }
}

export const RefreshToken=async(req,res)=>{
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
}