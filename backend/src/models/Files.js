import { db } from '../config/database.js';

export class File {
    static create(content) {
        const { name, description, file, hash } = content;

        return new Promise((resolve, reject) => {
            const file_path = file.filename;
            const sql = 'INSERT INTO files (name, description,file_path, hash) VALUES (?, ?, ?, ?)';
            console.log('🔍 DEBUG: SQL params:', [name, description, file_path]);

            db.run(sql, [name, description, file_path, hash], function (err){
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
    static delete(id){
        return new Promise((res,rej) => {
            const sql = 'DELETE FROM FILES WHERE id = ?'
            db.run(sql, [id], function(err) {
                if(err){
                    rej(err)
                } else {
                    res(true)
                }
            })

        })
    }
    static update(content) {
        const { id, name, description, file, hash, file_path } = content;
        console.log('🔍 DEBUG: File.update called with:', content);


        return new Promise((resolve, reject) => {

            const sql = 'UPDATE files SET name = ?, description = ?, file_path = ?, hash = ?  WHERE id = ?';
            console.log('🔍 DEBUG: SQL params:', [name, description, file_path, id, hash]);
            
            db.run(sql, [name, description, file_path, hash, id], function(err) {
                if(err) {
                    console.log('❌ DEBUG: Database update error:', err);
                    reject(err);
                } else {
                    console.log('✅ DEBUG: Database update successful, changes:', this.changes);
                    // For UPDATE, use this.changes to check if any row was updated
                    resolve({id: id, changes: this.changes});
                }
            })
        })
    }
    static getById(id) {
        return new Promise((res, rej) => {
            const sql = 'SELECT * FROM files WHERE id = ?';

            db.get( sql, [Number(id)], function(err, row){
                if(err){
                    console.log('❌ DEBUG: Database update error:', err);
                    rej(err)
                } else {
                    console.log('✅ 1111DEBUG: Database update successful, changes:',row, id);

                    res(row)
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