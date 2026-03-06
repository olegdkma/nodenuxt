import {User} from "../models/Users.js";
import crypto from "node:crypto";
import jwt from 'jsonwebtoken';

function createAccessPair(user) {
    const jwtT =  jwt.sign({
        id: user.id,
    }, 'secret', {expiresIn: 1})
    const jwtTRefresh =  jwt.sign({
        id: user.id,
    }, 'refresh_secret')
    return {
        token: jwtT,
        refreshToken: jwtTRefresh
    }
}
 function attachCookiesToRes(res, {token, refreshToken} = {}) {
    return res.cookie('token', token, {
        httpOnly: true,
    }).cookie('refreshToken', refreshToken, {
        httpOnly: true,
    })
}
export const UserController = {
    async login(req, res) {
        try{
            const {email, password} = req.body
            console.log(req.body)
            const existingUser = await User.getByEmail(email)
            console.log(email, existingUser, '123')
            if(existingUser ) {
                const hash = crypto.createHash('sha256').update(password).digest('hex')
                console.log(hash, existingUser.password, '22')

                if( hash === existingUser.password) {
                    const {token, refreshToken} = createAccessPair(existingUser)
                    await User.saveRefreshToken(refreshToken, existingUser.id)
                    return attachCookiesToRes(res, {token, refreshToken}).status(200).json({message: 'we are loged'})
                }
            }
            return res.status(401).json({message: 'Not correct credentials'})
        } catch (e) {
            console.log(e)
        }
    },
    async logOut(req, res) {
      try{
          const token = req.cookies.token;
          console.log('logout ,  token' , token)
          res.clearCookie('token').clearCookie('refreshToken', {path: 'refresh'})
          if(token) {
              const existingUser = jwt.verify(token, 'secret')
              await User.deleteRefreshToken( existingUser.id)
          }
          return res.status(200).json({message: 'loged'})
      } catch (e) {
          console.log(e)
      }
    },
    async refreshToken(req, res) {
        try{
            const tokenRefresh = req.cookies.refreshToken;

            const existingUser = jwt.verify(tokenRefresh, 'refresh_secret')
            console.log('existingUser', existingUser)

            if(!existingUser) {
                return res.status(400)
            }

            const userWithToken = await User.getRefreshToken(tokenRefresh)
            console.log('userWithToken', userWithToken)

            if(!userWithToken || userWithToken.user_id !== existingUser.id) {
                return res.status(400)
            }
            const {token, refreshToken} = createAccessPair({...userWithToken, id: userWithToken.user_id})
            console.log(token, refreshToken, 'before cook')
            await User.saveRefreshToken(refreshToken, userWithToken.user_id)
            return attachCookiesToRes(res, {token, refreshToken}).status(200).json({message: 'loged'})
        }catch (e) {
            console.log('error',e)
        }
    },
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
           const jwtTRefresh =  jwt.sign({
               id: 1,
           }, 'refresh_secret')

           await User.saveRefreshToken(jwtTRefresh, user.id)
           return res.cookie('token', jwtT, {
               httpOnly: true
           }).cookie('refreshToken', jwtTRefresh, {
               httpOnly: true,
               path: '/refresh'
           }).status(200).json({message: 'User created successfully', jwt: jwtT})
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