var express = require("express");
const multer = require("multer");
const { param } = require("../app");
var router = express.Router();
const userSchema = require("../models/usermodel");
const productSchema = require("../models/productmodel");
const orderSchema = require("../models/ordermodel");

var bcrypt = require("bcrypt");
const ordermodel = require("../models/ordermodel");

const authenticateAdminToken = async (req, res, next) => {
    const token = req.headers.authorization;
  
    if (token === "admin") {
      return next();
    } else {
  
      return res.status(401).send({
        message: 'Unauthorized',
        success: false
      });
    }
  };

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
        res.status(200).send({data:orders,message:"View All Order Success",success:true});
    }catch (error) {
        res.status(500).send({data:error.toString(),message:"View All Order Fail",success:false});
    }
});

/*View Product It have Oreder*/
router.get("/api/v1/product/:id/order", async function (req, res, next) {
    try{
        let product = await productSchema.findById(req.params.id);
        let order = await orderSchema.find();
        console.log("==> "+product.productname);
        res.status(200).send({data:product,order,message:"View product Success",success:true});
    }catch (error){
        res.status(500).send({data:error.toString(),message:"View product fail",success:false});
    }
});

/*View All Product*/
router.get("/api/v1/product/", async function (req, res, next) {
    try{
        let products = await productSchema.find();
        
        res.status(200).send({data:products,message:"View product Success",success:true});
    }catch (error) {
        res.status(500).send({data:error.toString(),message:"View product fail",success:false});
    }
  
});

/*Viwe 1 Product*/
router.get("/api/v1/product/:id", async function (req, res, next) {
    try{
        let order = await orderSchema.find({product_id:req.params.id});
        res.status(200).send({data:order,message:"View product",success:true});
    }catch (error) {
        res.status(500).send({data:error.toString(),message:"View product fail",success:false});
    }
  
});

/*Add Product*/
router.post('/api/v1/product/', upload.single('product_file'), async function(req, res, next) {
    try{
        const { productname, price, unit } = req.body;
        const status = "In Stock";
        try{
            let product = await productSchema.findOne({ productname : req.body.productname})
            console.log(product.productname);
            if (product.productname === req.body.productname) {
                let updateproduct = await product.save();
                product.unit = parseInt(product.unit) + parseInt(req.body.unit);
                await product.save();
                return res.status(201).send({
                    data: updateproduct,
                    message: 'Add Product Success',
                    success: true,});
            }
        }catch (error) {
            const newProduct = await productSchema({
                productname, 
                price,
                unit,
                file: req.file.filename,
                status
            });
          let save = await newProduct.save();
          return res.status(200).send({
            data : save,
            message: 'Add Product Success',
            success: true});
        }
      }catch(error){
        return res.status(500).send({
            data : error.toString(),
            message: 'Add Product Failure',
            success: false});
      }
    });


/*Edit Product*/
router.put("/api/v1/product/:id", upload.single("product_file"), async function (req, res, next) {
    try{
        let { productName, price, unit, type } = req.body;
        let update = await productSchema.findByIdAndUpdate(req.params.id, { productName: productName, price:price, unit:unit, type:type, file:req.file.filename }, { new: true });
        return res.status(200).send({ productName: update.productName, price: update.price, unit:unit.update, type:type.update , message: 'Updated product Success',success: true});
    }catch (error) {
        res.status(500).send({data:error.toString(),message: 'Error updating product',success: false});
    }
});

/*Delete Product*/
router.delete("/api/v1/product/:id", async function (req, res, next) {
    try{
        let delete_product = await productSchema.findByIdAndDelete(req.params.id)
        res.status(200).send({data:delete_product,message: 'Product deleted successfully',success: true});
        console.log("Delete Product Success");
    }catch (error) {
        res.status(500).send({data: error.toString(),message: 'Product deleted fail',success:false});
    }
});


router.put('/api/v1/approve/:id', authenticateAdminToken, async function(req, res, next) {
    try {
      let { status } = req.body;
      let update = await userSchema.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
      return res.status(200).send({ data: update.status,message:"Approve Success",success:true });
    } catch(error) {
      res.status(500).send({data:error.toString(),message:"Approve fail",success:false});
    }
  });





module.exports = router;
