import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'
import Token from '../../../models/tokenModel'

connectDB()

export default async (req, res) => {
    switch(req.method) {
        case "POST":
            await login(req, res)
            break;
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await Users.findOne({email})
        if(!user) return res.status(400).json({err: 'กรุณาตรวจสอบอีเมลและรหัสผ่านของคุณ'})

        if(user.isVerified === false) {
            const token = await Token.findOne({userId: user._id})
            if(!token) {
                //delete user
                await Users.deleteOne({_id: user._id})
                return res.status(400).json({err: 'กรุณาสมัครสมาชิกใหม่อีกครั้ง'})
            }
            return res.status(400).json({err: 'กรุณายืนยันอีเมลของคุณ'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({err: 'อีเมล/รหัสผ่านไม่ถูกต้อง'})

        const access_token = createAccessToken({id: user._id})
        const refresh_token = createRefreshToken({id: user._id})

        return res.json({
            msg: 'เข้าสู่ระบบสำเร็จ',
            refresh_token,
            access_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root,
                telephone: user.telephone
            }
        })

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}