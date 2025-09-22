import { File } from "../models/Files.js";

export const filesController =  {
    async create (req, res) {
        try{
            const fileCreate = await File.create({...req.body, file: req.file});
            if(fileCreate){
                res.status(201).json({success:true, data:fileCreate})
            }
        } catch(err){
            console.log('❌ DEBUG: Error in filesController:', err);
            console.log('❌ DEBUG: Error stack:', err.stack);
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