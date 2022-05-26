import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { authRouter } from './routers/auth.router.js';
import { file_router } from './routers/file_upload.router.js';
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(__dirname)
dotenv.config()
const app = express()
const corsOption = {Credential: true, origin: process.env.ORIGIN_NAME || '*'}
app.use('/static',express.static(path.join(__dirname, 'static')))
app.use(cors(corsOption))
app.use(bodyParser.json())
app.use('/', authRouter, file_router)
app.get('/', (req, res) => {
  console.log(req)
  res.json({fdf:'fdfad'})
})

app.listen(process.env.PORT || 8000, ()=> {
  console.log(`server is listening to port ${process.env.PORT}`)
})