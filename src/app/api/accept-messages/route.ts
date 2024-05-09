import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect()

    const seassion = await getServerSession(authOptions)
    const user: User = seassion?.user as User

    if (!seassion || !user) {
        return Response.json({ message: "not authenticated", success: false }, { status: 401 })
    }

    const userId = <any>user?._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModal.findOneAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true })

        if (!updatedUser) {
            return Response.json({ message: "faiel to update accept messages.", updatedUser, success: false }, { status: 500 })
        }
        return Response.json({ message: "update accept message successfully.", success: true }, { status: 200 })
    } catch (error) {
        console.log("field to update accept messages.", error)
        return Response.json({ message: "field to update accept messages.", success: false }, { status: 500 })
    }
}