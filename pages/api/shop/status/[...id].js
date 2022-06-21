import connectDB from '../../../../utils/connectDB'
// import Users from '../../../models/userModel'
import auth from '../../../../middleware/auth'
import Shop from '../../../../models/shopModel'

connectDB()

export default async (req, res) => {
    switch(req.method) {
        case "PATCH":
            await updateStatus(req, res)
            break;
    }
}

const updateStatus = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'seller') 
            return res.status(400).json({err: "TEST Authentication is not valid."})

        const {id} = req.query
        const {status, isHalal} = req.body
        

        await Shop.findOneAndUpdate({_id: id}, {status, isHalal})
        res.json({msg: 'อัพเดทข้อมูลสำเร็จ', status, isHalal})

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}


