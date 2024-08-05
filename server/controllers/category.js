import Category from "../models/category";

export const getAllCategories=async(req,res)=>{
try{
    const categories = await Category.find();
    return res.status(200).json({
        success: true,
        data: categories
    });

} catch (error) {
    console.error('Error getting categories:', error);
    return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
}
};
export const addCategory = async (req, res) => {
    try {
        const { title, isReturnable } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ title });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                error: 'Category already exists'
            });
        }

        // Create a new category
        const newCategory = new Category({
            title,
            isReturnable
        });

        await newCategory.save();

        return res.status(201).json({
            success: true,
            data: newCategory,
            message: 'Category added successfully'
        });
    } catch (error) {
        console.error('Error adding category:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};
