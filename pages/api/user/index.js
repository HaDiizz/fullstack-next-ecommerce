import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import auth from '../../../middleware/auth'


connectDB()

export default async (req, res) => {
    switch(req.method) {
        case "PATCH":
            await uploadInfor(req, res)
            break;
        case "GET":
            await getUser(req, res)
            break;
    }
}

const uploadInfor = async (req, res) => {
    try {
        // console.log(req.body)
        const result = await auth(req, res)
        const {name, avatar, telephone} = req.body

        const newUser = await Users.findOneAndUpdate({_id: result.id}, {name, avatar, telephone})

        res.json({
            msg: "Update Successfully",
            user: {
                name,
                avatar,
                email: newUser.email,
                role: newUser.role,
                telephone
            }
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}


const getUser = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid."})
        const users = await Users.find().select('-password')
        res.json({users})

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}