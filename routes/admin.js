var express = require("express");
const multer = require("multer");
const { param } = require("../app");
var router = express.Router();
const userSchema = require("../models/usermodel");
const productSchema = require("../models/productmodel");
const orderSchema = require("../models/ordermodel");

var bcrypt = require("bcrypt");
const ordermodel = require("../models/ordermodel");

/*Config Upload File*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

/* ------- Start API Users ------- */
/* GET users listing. */
router.get("/:id", async function (req, res, next) {
  try {
    let params = req.params;
    let querys = req.query;
    let hash = await bcrypt.hash("1234", 10);
    let compare = await bcrypt.compare("1234", hash);
    let users = await userSchema.find({});

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

/* POST */
router.post("/", upload.single("profile"), async function (req, res, next) {
  try {
    let { name, age } = req.body;

    let user = new userSchema({
      name,
      age,
      file: req.file.filename,
    });

    let save = await user.save();

    res.status(200).send(save);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('Method get');
// });

// router.get('/:id', async function(req, res, next) {
//   try{
//     let params = req.params
//     let query = req.query

//     let user = await userSchema.find({})
//     res.status(200).send({
//       params,
//       query
//   });
//   }catch(error){
//     res.status(500).send(error.toString());
//   }

// });

router.post("/", async function (req, res, next) {
  try {
    let { name, age } = req.body;

    let user = new userSchema({
      name,
      age,
    });

    let save = await user.save();

    res.status(200).send(save);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let { name, age } = req.body;
    let update = await userSchema.findByIdAndUpdate(
      req.params.id,
      { name: age },
      { new: true }
    );
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let delete_user = await userSchema.findByIdAndDelete(req.params.id);

    res.status(200).send(delete_user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

/*View All Order*/
router.get("/api/v1/order/", async function (req, res, next) {
    try{
        let orders = await orderSchema.find();
        res.status(200).send(orders);
    }catch (error) {
        res.status(500).send(error.toString());
    }
});

/*View Product It have Oreder*/
router.get("/api/v1/product/:id/order", async function (req, res, next) {
    try{
        let product = await productSchema.findById(req.params.id);
        let order = await orderSchema.find();
        console.log("==> "+product.productname);
        res.status(200).send({product,order});
    }catch (error){
        res.status(500).send(error.toString());
    }
});

/*View All Product*/
router.get("/api/v1/product/", async function (req, res, next) {
    try{
        let products = await productSchema.find();
        
        res.status(200).send(products);
    }catch (error) {
        res.status(500).send(error.toString());
    }
  
});

/*Viwe 1 Product*/
router.get("/api/v1/product/:id", async function (req, res, next) {
    try{
        let order = await orderSchema.find({product_id:req.params.id});
        res.status(200).send(order);
    }catch (error) {
        res.status(500).send(error.toString());
    }
  
});

/*Add Product*/

router.post('/api/v1/product/', upload.single('product_file'), async function(req, res, next) {
    try{
        const { productname, price, unit } = req.body; // แก้ไขชื่อตัวแปรเป็น productName
        const status = "In Stock";
        const newProduct = await productSchema({
              productname, // แก้ชื่อตัวแปรเป็น productName
              price,
              unit,
              file: req.file.filename,
              status
          });
        let save = await newProduct.save();
        res.status(200).send(save);
  
      }catch(error){
        res.status(500).send(error.toString());
      }
    });


/*Edit Product*/
router.put("/api/v1/product/:id", upload.single("product_file"), async function (req, res, next) {
    try{
        let { productName, price, unit, type } = req.body;
        let update = await productSchema.findByIdAndUpdate(req.params.id, { productName: productName, price:price, unit:unit, type:type, file:req.file.filename }, { new: true });
        return res.status(200).send({ productName: update.productName, price: update.price, unit:unit.update, type:type.update });
    }catch (error) {
        res.status(500).send(error.toString());
    }
});

/*Delete Product*/
router.delete("/api/v1/product/:id", async function (req, res, next) {
    try{
        let delete_product = await productSchema.findByIdAndDelete(req.params.id)
        res.status(200).send(delete_product);
        console.log("Delete Product Success");
    }catch (error) {
        res.status(500).send(error.toString());
    }
});





module.exports = router;
