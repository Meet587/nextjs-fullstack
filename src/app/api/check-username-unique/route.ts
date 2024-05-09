import dbConnect from '@/lib/dbConnect'
import UserModal from '@/model/User.model'
import { z } from 'zod'
import { userNameValidation } from '@/schemas/signUpSchema'

const UserNameQuerySchema = z.object({
    userName: userNameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const qureyParams = {
            userName: searchParams.get("userName")
        }
        const decodedUserName = decodeURIComponent(qureyParams.userName !== null ? qureyParams.userName : "")

        // validate with zode
        const result = userNameValidation.safeParse(decodedUserName)
        console.log("resultresultresultresult", result)
        if (!result.success) {
            const userNameErrors = result.error.format()._errors || []
            return Response.json({ message: userNameErrors.length > 0 ? userNameErrors.join(", ") : "Invalid query poarams", success: false }, { status: 400 })
        }

        const { userName } = <any>result.data

        const existingUserName = await UserModal.findOne({ userName, isVarified: true })

        if (existingUserName) {
            return Response.json({ message: "user name is alredy taken.", success: false }, { status: 400 })
        }
        return Response.json({ message: "user name is unique.", success: true }, { status: 200 })


    } catch (error) {
        console.log("error in checking user name.", error)
        return Response.json({ message: "error in checkoing username.", success: false }, { status: 500 })
    }
}