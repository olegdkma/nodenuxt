import {User} from "../models/Users.js";


export const UserController = {
    async create(req,res){
        const { password } = req.body
        const hash = crypto.createHash('sha256').update(password).digest('hex')
        const roles = JSON.stringify(['User'])

       try{
           await User.create( { ...req.body, password: hash, roles})
           return res.status(200)
       }catch(e){
            console.log('user.create err', e)
           return res.status(400)
       }
    }
}