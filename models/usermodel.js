const multer = require('multer');
const { router } = require("../app");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {type: String, unique: true, required: true},
  pass: {type: String},
  fname: {type: String},
  lname: {type: String},
  age: {type: Number},
  file: {type:String},
  status: {type: String}
},
{
    timestamps: true
});



const userModel = mongoose.model('User', userSchema);
module.exports = userModel;

module.exports = mongoose.model("users", userSchema);

// const products = new mongoose.Schema({
//   product_name: { type: String },
//   price: { type: Number },
//   amount: { type: Number },
// });
// module.exports = mongoose.model("products", products);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cd(null, "./public/images");
//     },
//     filename: function (req, file, cb) {
//       cd(null, new Date().getTime()+"_"+file.originalname);
//     },
//   });
// const upload = multer({storage: storage})

// router.post("/", async function (req, res, next) {
//   try {
//     const { product_name, price, amount } = req.body;
//     let newProduct = new productModel({
//       product_name: product_name,
//       price: price,
//       amount: amount,
//     });
//     let product = await newProduct.save();
//     return res.status(201).send({
//       data: product,
//       message: "create success",
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "create fail",
//       success: false,
//     });
//   }
// });

// router.get("/", async function (req, res, next) {
//   try {
//     let products = await productModel.find();
//     return res.status(200).send({
//       data: products,
//       message: "get success",
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Server error",
//       success: false,
//     });
//   }
// });

// router.get("/:id", async function (req, res, next) {
//   try {
//     let id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).send({
//         message: "Invalid id",
//         success: false,
//         error: ["ID is not a ObjectId"],
//       });
//     }
//     let products = await productModel.findById(id);
//     return res.status(200).send({
//       data: products,
//       message: "success",
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Server error",
//       success: false,
//     });
//   }
// });

// router.put("/:id", async function (req, res, next) {
//     try{
//         let id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).send({
//         message: "Invalid id",
//         success: false,
//         error: ["ID is not a ObjectId"],
//       });
//     }
//     await productModel.updateOne(
//         {_id: mongoose.Types.ObjectId(id)},
//         {$set: req.body}
//     );
//     let product = await productModel.findById(id);
//     return res.status(200).send({
//       data: product,
//       message: "update success",
//       success: true,
//     });
//     } catch (error){
//         console.log(error.message);
//         return res.status(500).send({
//             message: "Server error",
//             success: false,
//         });
//     }
// });

// router.delete("/:id", async function (req,res,next){
//     try{
//         let id = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send({
//             message: "Invalid id",
//             success: false,
//             error: ["ID is not a ObjectId"],
//         });
//         } 
//         await productModel.deleteOne({_id: mongoose.Types.ObjectId(id)});
//         return res.status(200).send({
//             message: "delete success",
//             success: true,
//         });
//     }catch(err){
//         return res.status(500).send({
//             message: "Server error",
//             success: false,
//         });
//     }
// });

// router.post("/", upload.single("image"), async function (req, res, next) {
//     try{
//       let nameImage = "rambo.jpg";
//       if (req.file){
//         nameImage = req.file.filename;
//       }
//       const {name, price, amount} = req.body;
//       let newProduct = new productModel({
//         name: name,
//         price: price,
//         amount: amount,
//         img: nameImage,
//       });
//       let product = await newProduct.save();
//       res.send({
//         data: product,
//         message: "create successfully",
//         success: true,
//       })
//     }catch(error){
//       res.status(500).send({
//         message: "create failed",
//         success: false,
//       })
//     }
//   });

