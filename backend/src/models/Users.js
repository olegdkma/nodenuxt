import { db } from '../config/database.js';

export class User {
    static create(content) {
        const { id, email, password, roles } = content
        return new Promise((res,rej) => {
            const sql = `INSERT INTO users `
            db.run(sql, [id, email, password, roles], function(err) {
                if(err){
                    rej(err)
                } else{
                    res()
                }
            })

        })
    }
}