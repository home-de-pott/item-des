const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const s3Images = require('./services/multer_s3.js')
const db = require('../DataBase/index.js')
const port = 3022;
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('client'))
app.use('/items/:id', express.static('client'))


app.get('/items-data/:id',(req,res)=>{
  db.getOneItemInfo(Number(req.params.id),(err,respons)=>{
    if(err){

      throw err ;
      
      res.send(err)
    }else{
      // console.log(respons[3])
        res.send(respons)
   
    }
  })
}) 
 app.post('/gg', (req, res) => {
  //  console.log(s3Images)
  //  const imagesArray =[]
  //  for(let i =0 ; i< s3Images.length ;i++){
  //    const obj ={}
  //    obj['img_id']=Number(s3Images[i].slice(44,53))
  //    obj['img_src']= s3Images[i]
  //    imagesArray.push(obj)
  //  }
  //  console.log(imagesArray)
  db.addAllImages(null,s3Images);
  res.send('HEY!')
})
 
app.listen(port,()=>console.log('listning on host: '+' port: '+port))