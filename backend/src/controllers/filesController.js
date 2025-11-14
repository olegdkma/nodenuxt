import { File } from "../models/Files.js";
import fs from "fs";
import path from "path";
import crypto from "node:crypto";


function createHash(path) {
    const buffer = fs.readFileSync( path)
    const hash = crypto.createHash('sha256')
    hash.update(buffer)
    return hash.digest('hex')
}
export const filesController =  {
    async create (req, res) {
        const filePath = path.join(process.cwd(), "uploads", req.file.filename);

        const hash = createHash(filePath)

        try{
            const fileCreate = await File.create({...req.body, file: req.file, hash});
            if(fileCreate){
                res.status(201).json({success:true, data:fileCreate})
            }
        } catch(err){
            console.log('❌ DEBUG: Error in filesController:', err);
            console.log('❌ DEBUG: Error stack:', err.stack);
            res.status(400).json({error:err})
        }

    },
    async delete(req,res) {
        try{
            const id = req.params.id;

            await File.delete(id)
            res.status(200).json({l: 'lh'})
        }catch(e) {
            res.status(400).json({err: 1234})
        }
    },
    async update(req, res) {
        try{
            const id = req.params.id;
            const { name, description } = req.body;
            const file_path = req.file ? req.file.filename : req.body.file_path;
            const currentFile = await File.getById(id)
            let hash = currentFile.hash
            console.log(req.file)
            if(req.file){
                const filePath = path.join(process.cwd(), "uploads", file_path);

                const newFileHash = createHash(filePath)
                if(hash !== newFileHash) {
                    hash = newFileHash
                }
            }
            
            const fileUpdated = await File.update({ id, name, description, file_path, hash });
            return res.status(200).json({success:true, data:fileUpdated})
        } catch(err){
            console.log('❌ DEBUG: Error in filesController:', err);
            res.status(400).json({error:err})
        }
    },
    async getAll (req, res) {
        try{
            const data = await File.getAll();
            res.status(200).json({ success:true, data:data });
        } catch (err) {
            res.status(400).json({error:err})
        }
    }
}