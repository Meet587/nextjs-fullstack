import dbConnect from "@/lib/dbConnect"
import { User, getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import UserModal from "@/model/User.model"
import { Message } from "@/model/User.model"

export async function POST(request: Request) {
    await dbConnect()

    const seassion = await getServerSession(authOptions)
    const user: User = seassion?.user as User

    if (!seassion || !user) {
        return Response.json({ message: "not authenticated", success: false }, { status: 401 })
    }

    const { userName, content } = await request.json()

    try {
        const user = await UserModal.findOne({ userName })

        if (!user) {
            return Response.json({ message: "user not found.", success: false }, { status: 404 })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({ message: "user is not accepting messages.", success: false }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }

        user.message.push(newMessage as Message)

        await user.save()

        return Response.json({ messages: "message sent successfully.", success: true }, { status: 200 })

    } catch (error) {
        console.log("error in send message.", error)
        return Response.json({ message: "error in send message.", success: false }, { status: 500 })
    }

}