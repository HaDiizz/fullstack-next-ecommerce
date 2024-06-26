import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import jwt from 'jsonwebtoken'
import { createAccessToken } from '../../../utils/generateToken'

connectDB()

export default async (req, res) => {
    try {
        const rf_token = req.cookies.refreshtoken
        if(!rf_token) return res.status(400).json({err: 'Please login first.'})

        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN)
        if(!result) return res.status(400).json({err: 'Your token is incorrect / expired.'})

        const user = await Users.findById(result.id)
        if(!user) return res.status(400).json({err: 'User does not exists.'})

        const access_token = createAccessToken({id: user._id})
        return res.json({
            access_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root,
                telephone:user.telephone,
                _id: user._id

            }
        })

    } catch (err) {
        res.status(500).json({err: "Your session has been expired. Please refresh your app."})
    }
}

