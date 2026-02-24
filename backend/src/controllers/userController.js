import {User} from "../models/Users.js";
import crypto from "node:crypto";
import jwt from 'jsonwebtoken';

export const UserController = {
    async create(req,res){
        console.log('UserController.create called', req.body)
        const { password } = req.body
        const hash = crypto.createHash('sha256').update(password).digest('hex')
        const roles = JSON.stringify(['User'])

       try{
           const user = await User.create( { ...req.body, password: hash, roles})
          const jwtT =  jwt.sign({
              id: 1,
           }, 'secret')

           return res.status(200).cookie('token', jwtT, {
               httpOnly: true
           }).json({message: 'User created successfully', jwt: jwtT})
       }catch(e){
            console.log('user.create err', e)
           return res.status(400).json({error:e})
       }
    },
    async getByID(req,res){
        const id = req.params.id
        try{
            const user = await User.getByID(id)
            return res.status(200).json({user})
        } catch(e){
            return res.status(400).json({error:e})
        }
    }
}