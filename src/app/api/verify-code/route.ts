import dbConnect from '@/lib/dbConnect'
import UserModal from '@/model/User.model'
import { z } from 'zod'
import { userNameValidation } from '@/schemas/signUpSchema'

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userName, code } = await request.json()
        const decodedUserName = decodeURIComponent(userName)
        const user = await UserModal.findOne({ userName: decodedUserName })
        if (!user) {
            return Response.json({ message: "user not found.", success: false }, { status: 500 })
        }

        const isCodeValide = user.verifyCode === code
        const isCodeNotExpierd = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValide && isCodeNotExpierd) {
            user.isVerified = true
            user.save()
            return Response.json({ message: "account verified.", success: true }, { status: 200 })
        } else if (!isCodeNotExpierd) {
            return Response.json({ message: "verification code is expired, please sign up again to get a new code.", success: false }, { status: 400 })
        } else {
            return Response.json({ message: "inccorect verification code.", success: false }, { status: 400 })
        }

    } catch (error) {
        console.log("error in verifying user", error)
        return Response.json({ message: "error in verifying user", success: false }, { status: 500 })
    }
}