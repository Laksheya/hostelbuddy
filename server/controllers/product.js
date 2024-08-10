import Product from "../models/product.js";
// import User from './models/User';
import User from '../models/user.js';
import Hostel from '../models/hostel.js';
// Define the function to get products metadata
export const getProductsMetadata = async (req, res) => {
    try {
        // Fetch all products with populated owner and hostel information
        const products = await Product.find()
            .populate({
                path: 'owner', // Populate the owner field
                select: 'name profileImage hostel', // Select the owner's name, profileImage, and hostel
                populate: {
                    path: 'hostel', // Populate the hostel field in User model
                    select: 'name' // Select only the name field from the Hostel model
                }
            })
            .exec();

        // Map the products to the desired format
        const result = products.map(product => ({
            ownerName: product.owner?.name || 'Unknown', // Check if owner exists and fetch name
            ownerImage: product.owner?.profileImage || null, // Check if owner exists and fetch profile image
            hostelName: product.owner?.hostel?.name || 'Unknown', // Check if hostel exists
            productImage: product.images || '', // Default to empty string if images is null
            description: product.description || '', // Default to empty string if description is null
            title: product.title || 'Untitled', // Default to 'Untitled' if title is null
            borrowerId: product.borrower || null, // Return borrower ID, or null if none
        }));

        // Return the result as a JSON response
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching products metadata:', error);
        return res.status(500).json({ message: 'Unable to fetch products metadata', error: error.message });
    }
};
// owner name owener hostelname profile image prduct image owner id owner iamge woner profile owner prifle description title id

export const addProduct = async (req, res) => {
    try {
        const productData = req.body

        if (!productData || !productData.title || !productData.category) {
            return res.status(400).json({
                success: false,
                error: "Missing entries"
            });
        }

        const product = await Product.create(productData);

        res.status(200).json({
            success: true,
            productData: product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}


export const editProduct = async (req, res) => {
    try {
        const { productData, productId } = req.body
        if (
            !productData.title ||
            !productData.category_id
        ) {
            return res.status(400).json({
                success: false,
                error: "Missing entries"
            })
        }

        const response = await uploadImage(req.files);

        if (!response.success) {
            throw new Error("Failed to upload image")
        }

        productData.images = response.urls;
        productData.owner_id = req.user._id;

        await Product.findByIdAndUpdate(
            productId,
            { productData }, // The update to apply
            { new: true }, // Options (e.g., return the updated document)
        );


    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body
        if (!productId) {
            return res.status(403).json({
                success: false,
                error: "Bad request"
            })
        }
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            })
        }

        if (product.owner_id != req.user._id) {
            return res.status(403).json({
                success: false,
                error: "Your are not authorized to delete this product"
            })
        }

        await Product.findByIdAndDelete(productId)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

export const getMyProduct = async (req, res) => {
    try {

    } catch (error) {

    }
}