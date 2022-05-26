
import pool from "../db.js";
import fetch from "node-fetch";
import fs from 'fs';
const file_upload = async (req, res) => {
  try {
    console.log(req.file)
    if(!req.file) return res.status(400).json({message: "Some error occurred file couldn't be uploaded"})
    if(!req.file.destination) return res.status(400).json({message: "Multiple files cant be uploaded"})
    
    const {mimetype, path} = req.file;
    
    const query = await pool.query("INSERT INTO files(owner,file,mime_type) VALUES($1, $2, $3) RETURNING *",[req.user._user_id, path, mimetype])
    
    return res.status(200).json({message: "file uploaded successfully"})
  } catch(err) {
    console.log(err)
    if (err.code)
    return res.status(500).json({message : 'Internal Server Error'})
  }
}

const multi_file_upload = async (req, res) => {
  try{
    // console.log(req.file)
    return res.status(200).json({message: 'files uploaded successfully'})
  } catch(err) {
    // console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const get_files = async (req, res) => {
  try {
    const { _user_id } = req.user;
    console.log(_user_id)
    const query = await pool.query("SELECT * FROM files WHERE owner=$1", [_user_id]);
    console.log(query)
    return res.status(200).json({data: query.rows[0]})
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const delete_file = async (req, res) => {
  try {
    const {_user_id } = req.user;
    const { id } = req.params;
    if(!id) return res.status(400).json({message:' id is required'})
    const query = await pool.query("DELETE FROM files where owner=$1 and id=$2 RETURNING * ", [_user_id, id])
    if (query.rowCount ===0) return res.status(400).json({message: 'file not found'})
    const file_path = query.rows[0].file
    fs.rm(file_path, (err) => {
      console.log(err);
    })
    return res.status(200).json({message: "File Deleted"})
  } catch(err) {
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}


export {
  file_upload,
  multi_file_upload,
  get_files,
  delete_file,

}