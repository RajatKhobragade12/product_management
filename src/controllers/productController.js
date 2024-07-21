const productModel = require('../models/productModel');
const userModel = require("../models/userModel");
const { generatePdf } = require("../services/pdfGenerator")
const { verifyToken } = require("../middleware/auth");


async function addProduct(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        let products = req.body;
        if (!products || !Array.isArray(products)) {
            return res.status(400).send('Invalid products array');
        }


        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');

        }

        const productWithGST = products.map(product => {
            const total = product.rate * product.qty
            return {
                ...product,
                total,
                userId: user._id
            }
        })

        const pdfUrl = await generatePdf(productWithGST);
        const productsWithPdf = productWithGST.map(product => {
            return {
                ...product,
                pdf: pdfUrl
            }
        })
        const savedProducts = await productModel.insertMany(productsWithPdf);
        res.status(201).json({ message: 'Products created successfully', products: savedProducts });

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })


    }



}


async function quotations(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');

        }
        const quotations = await productModel.find({ userId: user._id });
        let allPdf = quotations.map((pdf) => {
            return pdf.pdf
        })
        let uniquePdf = [...new Set(allPdf)];
        return res.status(200).json({ quotations: uniquePdf });


    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }

}


module.exports = {
    addProduct,
    quotations
}