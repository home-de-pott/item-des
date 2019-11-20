const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
 const imagesUrlArray =[];
 (async function(){
    try {
        aws.config.setPromisesDependency();
        aws.config.update({
            secretAccessKey:'T4uDjBcJONppniioJnyiD8pevMoKQy3TrSU+R0zG',
            accessKeyId:'AKIAIISHKZEIUP7RTT2A',
            region:'us-east-2'
        })
        const s3 = new aws.S3();
        const respons = await s3.listObjectsV2({
           
        Bucket: 'item-des'
    }).promise();
    for (let i =0; i< respons.Contents.length ;i++){
        str = 'https://item-des.s3.us-east-2.amazonaws.com/'+respons.Contents[i].Key,
        imagesUrlArray.push({img_id: str.slice(44,53)	,img_src: str})
        
        
    }
    // console.log(imagesUrlArray)
    } catch (e) {
        console.log('error in S3 multer', e)
    }

 })();
 module.exports = imagesUrlArray;







//  var params = {
//     Bucket: "itemsdescr", 
//     Key: "1 - dewalt-claw-hammers-dwht51054-c3_1000.jpg"
//    };
//    s3.getObject(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response
//      /*
//      data = {
//       AcceptRanges: "bytes", 
//       ContentLength: 3191, 
//       ContentType: "image/jpeg", 
//       ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
//       LastModified: <Date Representation>, 
//       Metadata: {
//       }, 
//       TagCount: 2, 
//       VersionId: "null"
//      }
//      */
//    });

// aws.config.update({
//     secretAccessKey:'BxM4w1ERSVt8+nmUpqO9lCYq6DOocTnTXp+etB2G',
//     accessKeyId:'AKIAIHYZI4VZK2YFEFTQ',
//     region:'us-east-2'
// })
// const s3 = new aws.S3();
// const respons = s3.listObjectsV2({
//     Bucket: 'prodect-images'
// });
// console.log(respons)

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     acl: 'public-read',
//     bucket: 'prodect-images',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })