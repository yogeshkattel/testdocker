import multer from 'multer';
const maxSize = 2 * 1024 * 1024;

let FileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./static')

  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--'+String(req.user._user_id)+'--'+file.originalname.replace(/ /g,''))
  },

  
});

const setup = multer({
  storage: FileStorageEngine,
  limits: {fileSize: maxSize},
});


const upload = (req, res, next) => {
  // console.log(req)
  const upload = setup.single('image')
  upload(req, res, (err) => {
    // console.log(req.file)
    if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(401).json({message: 'The file Max file size exceeded'})
    next()
  })
}

const multiUpload = (req, res, next) => {
  const upload = setup.array('image',4);
  upload(req, res, (err)=> {
    if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(401).json({message: 'The File Max size exceeded'})
    next()
  })
}




export {
  upload,
  multiUpload
}