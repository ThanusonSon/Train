var express = require('express');
const multer = require('multer');
const { param } = require('../app');
var router = express.Router();
const userSchema = require('../models/usermodel');
const orderSchema = require('../models/ordermodel');
const productSchema = require('../models/productmodel');
var bcrypt = require('bcrypt');

/*Config Upload File*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '_' + file.originalname)
  }
})
const upload = multer({ storage: storage })

/* ------- Start API Users ------- */
/* GET users listing. */
router.get('/:id', async function (req, res, next) {
  try {
    let params = req.params
    let querys = req.query
    let hash = await bcrypt.hash('1234',10);
    let compare = await bcrypt.compare('1234', hash)
    let users = await userSchema.find({})

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.toString())
  }
});

/* POST */
router.post('/', upload.single('profile'), async function (req, res, next) {
  try {
    let { name, age } = req.body

    let user = new userSchema({
      name,
      age,
      file: req.file.filename
    });

    let save = await user.save()

    res.status(200).send(save);
  } catch (error) {
    res.status(500).send(error.toString())
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

router.post('/', async function (req, res, next) {
  try {
    let { name, age } = req.body

    let user = new userSchema({
      name,
      age
    })

    let save = await user.save()

    res.status(200).send(save);
  } catch (error) {
    res.status(500).send(error.toString())
  }
});

router.put("/:id", async function(req, res, next) {
  try{
    let {name, age} = req.body
    let update = await userSchema.findByIdAndUpdate(req.params.id, {name:age},{new:true});
  }catch(error){
    res.status(500).send(error.toString());
  }
});

router.delete("/:id", async function(req, res, next) {
  try{
    let delete_user = await userSchema.findByIdAndDelete(req.params.id)

    res.status(200).send(delete_user);
  }catch(error){
    res.status(500).send(error.toString());
  }
});

/*Register*/
router.post('/api/v1/register', upload.single('profile'), async function(req, res, next) {
  try{
    let {name,pass,age,fname,lname} = req.body;
    let status = 0;
    let hashPass = await bcrypt.hash(pass,10);
    let Newuser = new userSchema({
      name,
      pass: hashPass,
      age,
      fname,
      lname,
      file: req.file.filename,
      status
    });
    let save = await Newuser.save()
    res.status(200).send(save);
  }catch(error){
    res.status(500).send(error.toString());
  }
});

/*approve admin*/

router.put('/api/v1/approve/:id', async function(req, res, next) {
  try {
    let { status } = req.body;
    let update = await userSchema.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
    return res.status(200).send({ status: update.status });
  } catch(error) {
    res.status(500).send(error.toString());
  }
});

/*Add Order*/
router.post('/api/v1/products/:id/order', async function(req, res, next) {
  try {
      const productId = req.params.id;
      let {order_name, quantity} = req.body;

      let product = await productSchema.findById(productId);
      // if (!product) {
      //     return res.status(404).send({
      //         message: 'Product not found',
      //         success: false
      //     });
      // }
      // if (product.amount <= 0) {
      //     return res.status(400).send({
      //         message: 'Product out of stock',
      //         success: false
      //     });
      // }
      let total = product.price * quantity;
      console.log(product.productname);

      let order = new orderSchema({
          product_id: req.params.id,
          name: product.productname,
          order_name,
          price: product.price,
          quantity,
          total
      });
      let createOrder = await order.save();
      product.unit -= quantity;
      await product.save();

      return res.status(201).send({
          data: createOrder,
          message: 'Create Order Success',
          success: true,
      });
  } catch (error) {
      return res.status(500).send({
          message: 'Create Order Fail',
          success: false,
      });
  }
});



module.exports = router;
