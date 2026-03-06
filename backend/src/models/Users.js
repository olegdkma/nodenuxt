import { db } from '../config/database.js';

export class User {
    static create(content) {
        const { id, email, password, roles } = content
        console.log('User.create called with:', { email, password, roles })
        return new Promise((res,rej) => {
            console.log('Inside Promise, about to run SQL')
            const sql = `INSERT INTO users (email, password, roles) VALUES (?, ?, ? )`
            console.log('Executing SQL:', sql, [email, password, roles])
            db.run(sql, [email, password, roles], function(err) {
                console.log('db.run callback executed', { err, lastID: this.lastID })
                if(err){
                    console.log('Database error:', err)
                    rej(err)
                } else{
                    console.log('Database success, resolving')
                    res({id: this.lastID || 1, email});
                }
            })
            console.log('db.run called (callback not yet executed)')
        })
    }
    static getByID(id){
        return new Promise((res, rej) => {
            const sql = `SELECT * FROM users WHERE id = ?`
            db.get(sql, [id], function(err, row){
                if(err){
                    rej(err)
                }else{
                    res(row)
                }
            })
        })
    }
    static  getRefreshToken(token){
        return new Promise((res, rej) => {
            const sql = `SELECT * FROM refresh_tokens WHERE refresh_token =?`
            db.get(sql, [token], function(err, row){
                if(err){
                    rej(err)
                }else{
                    res(row)
                }
            })
        })
    }
    static saveRefreshToken(refreshToken, userID) {
        return new Promise((res, rej) => {
            const sql = 'INSERT INTO refresh_tokens (user_id, refresh_token) VALUES (?, ?) '
            db.run(sql, [userID, refreshToken], function(error, result)  {
                console.log(refreshToken, userID)
                if(error) {
                    console.log(error, 'error')
                   rej(error)
                } else {
                    console.log(result, 'INTO')
                    res()
                }
            })
        })
    }
    static deleteRefreshToken(userID) {
        return new Promise((res,rej) => {
            const sql = 'SELECT * from refresh_tokens WHERE user_id = ?' // ?? DELETE?
            db.run(sql, [userID], function (result, error) {
                if(error) {
                    rej(error)
                } else {
                    res()
                }
            })
        })
    }
    static getByEmail(email) {
        return new Promise(( res, rej) => {
            const sql = 'SELECT * from users WHERE email = ?'
            db.get(sql, [email], function(error, row) {
                if(error){
                    console.log(error, email, 'error em')
                    rej(error)
                } else {
                    res(row)
                }
            })
        })
    }
}