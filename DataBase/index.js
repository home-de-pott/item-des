const mysql      = require('mysql');
const allItems = require('./allItems.js')
const s3Images = require('../server/services/multer_s3.js')
require('dotenv').config();
const connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'Ip2RZ22uSq',
  password : process.env.password,
  database : 'Ip2RZ22uSq',
  Port: 3306
});
 

//  console.log('add')
const getOneItemInfo = function(id,cb) {
  const oneItemData =[];
  connection.query(`select * from itemDescription WHERE itemDescription.id = ${id}`, function (error, results, fields) {
    if (error){
      cb(error)
    }else{
      oneItemData.push(results)
    }  
  });
  connection.query(`select * from itemImages WHERE itemImages.img_id = ${id}`, function (error, results, fields) {
    if (error){
      cb(error)
    }else{
      oneItemData.push(results)
      connection.query(`select id,name,price from itemDescription WHERE itemDescription.category = '${oneItemData[0][0].category}'`, function (error, results, fields) {
        if (error){
          cb(error)
        }else{
          const relatedItemsInfo =[];
          for(let i =0;i<3;i++){
            relatedItemsInfo.push(results[i])
          }
          oneItemData.push(relatedItemsInfo)
          const relatedItemsImages =[];
          
          for(let i =0;i<oneItemData[2].length;i++){
            connection.query(`select img_src from itemImages WHERE itemImages.img_id = '${oneItemData[2][i].id}'`, function (error, results, fields) {
              if (error){
                cb(error)
              }else{
                // console.log(results[0].img_src)
                relatedItemsImages.push(results[0].img_src)
                if(relatedItemsImages.length ===4 || relatedItemsImages.length === oneItemData[2].length){
                  oneItemData.push(relatedItemsImages)
                  cb(null,oneItemData)
                }
               

              }
            });
          }
     
        }
      });
    }
  });
}


function addAllImages(err,imagesArray){
  if (err){
    throw err
  } else{
    for(let i =0 ;i<imagesArray.length;i++){
      connection.query(`INSERT INTO itemImages (img_id, img_src) VALUES (${imagesArray[i].img_id}, '${imagesArray[i].img_src}');`, function (error, results, fields) {
        if (error) throw error;
        // console.log(imagesArray[0])
      });
    }
  }
  
}

//  console.log(allItems)
// function addAllItems(){
//   for(let i =0 ;i<allItems.length;i++){
//     connection.query(`INSERT INTO itemDescription VALUES (${allItems[i].id}, '${allItems[i].name}', "${allItems[i].description}", ${allItems[i].price},'${allItems[i].brand}','${allItems[i].category}');`, function (error, results, fields) {
//       if (error) throw error;
//       console.log(allItems[0])
//     });
//   }
// }
// addAllItems()

module.exports={getOneItemInfo, addAllImages}