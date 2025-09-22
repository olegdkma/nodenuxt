import { db } from '../config/database.js';

export class Message {
  // Create a new message
  static create(content) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO messages (content) VALUES (?)';
      db.run(sql, [content], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            content,
            created_at: new Date().toISOString()
          });
        }
      });
    });
  }

  // Get all messages
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get message by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM messages WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Delete message by ID
  static deleteById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM messages WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
}
