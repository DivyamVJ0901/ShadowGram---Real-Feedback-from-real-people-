import dbConnect from "@/lib/dbConnect"; // DB connection har ek route pe lagta hai kyuki Next.js edge pe chalta hai
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, password } = await request.json()
        const existingUser = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (!existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User does not exist or is not verified"
                })
                , { status: 400 })
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Incorrect password"
                })
                , { status: 400 })
        }


        return new Response(
            JSON.stringify({
                success: true,
                message: "User logged in successfully",
            })
            , { status: 200 })
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error in logging in"
            }), { status: 400 })

    }
}
