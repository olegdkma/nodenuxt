import { db } from '../config/database.js';

export class File {
    static create(content) {
        const { name, description, file } = content;
        console.log('  - name:', [name, description, file]);


        return new Promise((resolve, reject) => {
            const file_path = file.filename;
            const sql = 'INSERT INTO files (name, description,file_path) VALUES (?, ?, ?)';
            console.log('🔍 DEBUG: SQL params:', [name, description, file_path]);

            db.run(sql, [name, description, file_path], function (err){
                if (err) {
                    console.log('❌ DEBUG: Database error:', err);
                    reject(err);
                } else {
                    console.log('✅ DEBUG: Database insert successful, lastID:', this.lastID);
                    resolve({id: this.lastID || 1, name, description});
                }
            })
        })
    }
    static getAll () {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM files';
            db.all(sql,[], function (err, results) {
                console.log(results);
                resolve(results);
            })
        })
    }
}