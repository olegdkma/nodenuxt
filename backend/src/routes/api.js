import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import fs from 'fs';
import { messageController } from '../controllers/messageController.js';
import { filesController } from '../controllers/filesController.js';

const router = express.Router();

// Ensure uploads keep original extension and store under backend/uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Target the shared uploads dir at backend/uploads
const uploadsDir = join(__dirname, '..', '..', 'uploads');
// Ensure the directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e8);
    const extension = extname(file.originalname) || '';
    cb(null, `file-${unique}${extension}`);
  }
});
const upload = multer({ storage });

// Message routes
router.post('/messages', messageController.create);
router.get('/messages', messageController.getAll);
router.get('/messages/:id', messageController.getById);
router.delete('/messages/:id', messageController.deleteById);

//files routes
router.post('/files', upload.single('file'), filesController.create);
router.put('/files/:id', upload.single('file'), filesController.update);
router.delete('/files/:id', filesController.delete);
router.get('/files',  filesController.getAll);

// Serve uploaded files also under /api/uploads if routed through here (extra safety)
// router.use('/uploads', express.static(join(__dirname, '..', 'uploads')));


export default router;
