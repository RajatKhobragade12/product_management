const express = require('express');
const router = express.Router();

const { register, login } = require("../controllers/userController");
const { addProduct, quotations } = require("../controllers/productController");

router.post("/register", register);
router.post("/login", login);


router.post("/products", addProduct);
router.get("/quotations", quotations);





module.exports = router;