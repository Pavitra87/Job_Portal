const PrismaClient=require('@prisma/client')
const prisma=PrismaClient();


//create
const createJobCategory=async(req,res)=>{
    const {name,description}=req.body;

    try {
        const jobcategory=await prisma.jobcategory.create({
            data:{name,description}
        })
        res.status(200).json(jobcategory)
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message})
    }
}

//update
const updateJobCategory=async(req,res)=>{
    const {id}=req.params;

    try {
        const updateCategory=await prisma.jobcategory.update({
            where:{id:Number(id)}
        })
res.status(200).json(updateCategory)
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message})
    }
}

//delete
const deleteCategory=async(req,res)=>{
    const {id}=req.params;

    try {
        const deletecategory=await prisma.jobcategory.delete({
            where:{id:Number(id)}
        })
        res.status(200).json(deletecategory)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message})
    }
}

//get 
const getCategories=async(req,res)=>{
    try {
        const getallcategories=await prisma.jobcategory.findMany()
        res.status(200).json(getallcategories)
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message}) 
    }
} 

module.exports={createJobCategory,updateJobCategory,deleteCategory,getCategories}