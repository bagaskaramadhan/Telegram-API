const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, res, cb)=>{
        cb(null, 'src/uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage,
    limits: {fileSize: 200000},
    fileFilter(req, file, callback){
      if(file.originalname.match(/\.(jpg|jpeg)\b/)) {
        callback(null, true)
      }else{
        callback('Wrong image type', null)
      }
    }
})

module.exports = upload