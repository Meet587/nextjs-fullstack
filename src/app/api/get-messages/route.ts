import dbConnect from "@/lib/dbConnect"
import UserModal from "@/model/User.model"
import { User, getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"


export async function GET(request: Request) {
    await dbConnect()

    const seassion = await getServerSession(authOptions)
    const user: User = seassion?.user as User

    if (!seassion || !user) {
        return Response.json({ message: "not authenticated", success: false }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user?._id)
    try {
        const user = await UserModal.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])

        if (!user || user.length === 0) {
            return Response.json({ message: "user not found.", success: false }, { status: 404 })
        }

        return Response.json({ messages: user[0].messages, success: true }, { status: 200 })

    } catch (error) {
        console.log("error in get user detail.", error)
        return Response.json({ message: "error in get user detail.", success: false }, { status: 500 })
    }

}