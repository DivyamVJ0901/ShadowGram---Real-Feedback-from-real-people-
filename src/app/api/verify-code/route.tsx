import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/Schemas/signUpSchema";

export async function POST(request : Request) {
    await dbConnect()

    try {
        const {username , code} = await request.json()
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username : decodeUsername})

        if(!user)
        {
            return new Response(
                JSON.stringify({
                    success : false,
                    message : "User not found"
                }),
                {status : 500}
            )
        }

        const isCodeValid = user.verifyCode === code

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired)
        {
            user.isVerified = true;
            await user.save()

            return new Response(
                JSON.stringify({
                    success : true,
                    message : "Account verified successfully"
                }),
                {status : 200}
            )
        }
        else if(!isCodeNotExpired)
        {
            return new Response(
                JSON.stringify({
                    success : false,
                    message : "Verification code has expired , please signup again"
                }),
                {status : 400}
            )
        }
        else
        {
            return new Response(
                JSON.stringify({
                    success : false,
                    message : "Incorrect verification code n"
                }),
                {status : 400}
            )
        }
        
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message : "Error in verifying user"
            }),
            {status : 500})
    }
}