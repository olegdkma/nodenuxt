import {User} from "../models/Users.js";
import crypto from "node:crypto";


export const UserController = {
    async create(req,res){
        console.log('UserController.create called', req.body)
        const { password } = req.body
        const hash = crypto.createHash('sha256').update(password).digest('hex')
        const roles = JSON.stringify(['User'])

       try{
           console.log('About to call User.create')
           await User.create( { ...req.body, password: hash, roles})
           console.log(123324)
           return res.status(200).json({message: 'User created successfully'})
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