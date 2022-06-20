import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import auth from '../../../../middleware/auth'
import Shop from '../../../../models/shopModel'

connectDB()

export default async (req, res) => {
    switch(req.method) {
        case "PATCH":
            await updateAccept(req, res)
            break;
        case "DELETE":
            await deleteUser(req, res)
            break;
    }
}


const updateAccept = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin' && !result.root) 
            return res.status(400).json({err: "Authentication is not valid."})

        const {id} = req.query //id of shop
        const {accepted} = req.body

        await Shop.findOneAndUpdate({_id: id}, {accepted})
        res.json({msg: 'Updated Succesfully', accepted})

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}


const deleteUser = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin' || !result.root) 
            return res.status(400).json({err: "Authentication is not valid."})

        const {id} = req.query

        await Users.findByIdAndDelete(id)
        res.json({msg: 'Deleted Succesfully'})

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}