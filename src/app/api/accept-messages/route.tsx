import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User // Here we have used assertion

    if (!session || !user) {
        return new Response(
            JSON.stringify({
                sucess: false,
                message: "Not authenticated"
            }), { status: 401 })
    }

    const userId = user._id 
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage : acceptMessages },
            { new: true }
        )

        if (updatedUser) {
            return new Response(
                JSON.stringify({
                    sucess: false,
                    message: "Failed to update user status to accept messages"
                }), { status: 401 })
        }

        return new Response(
            JSON.stringify({
                sucess: true,
                message: "Message acceptance status updated successfully"
            }), { status: 200 })
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                sucess: false,
                message: "Failed to update user status to accept messages"
            }), { status: 500 })
    }
}


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User // Here we have used assertion

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                sucess: false,
                message: "Not authenticated"
            }), { status: 401 })
    }

    const userId = user._id


    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return new Response(
                JSON.stringify({
                    sucess: false,
                    message: "User not found"
                }), { status: 404 })
        }

        return new Response(
            JSON.stringify({
                sucess: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            }), { status: 200 })
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                sucess: false,
                message: "Failed to message acceptance"
            }), { status: 500 })
    }
}

