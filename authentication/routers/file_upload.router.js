import express from 'express';
import {upload, multiUpload} from '../middlewares/file_upload.middleware.js';
import { AuthenticateToken } from '../middlewares/auth.middleware.js';
import { file_upload, multi_file_upload, get_files,delete_file } from '../controllers/file_upload.controllers.js';
const router = express.Router();

router.post('/single', [AuthenticateToken, upload], file_upload)
router.post('/multi', [AuthenticateToken, multiUpload], multi_file_upload)
router.post('/files', AuthenticateToken, get_files)
router.post('/file/:id/delete',AuthenticateToken,delete_file)


export {
  router as file_router
} 