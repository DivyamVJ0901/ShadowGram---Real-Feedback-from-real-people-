import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/Schemas/signUpSchema";
import { isGeneratorFunction } from "util/types";


const UserNameQuerySchema = z.object({
    username: usernameValidation,
})

// We have to write get function so that we can check that whether username is valid or not

export async function GET(request: Request) {

    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username : searchParams.get('username')
        }
        // Validate with ZOD
        const res = UserNameQuerySchema.safeParse(queryParam) // Parsing safe then we will get schema otherwise not

        if(!res.success)
        {
            const usernameErrors = res.error.format().username?._errors || [] // It contains all types of errors 

            return new Response(
                JSON.stringify({
                    success : false,
                    message : usernameErrors?.length>0 ? usernameErrors.join(',') : "Invalid query parameter"
                }),
                {status : 400}
            )
        }

        const {username} = res.data

        const existingVerifiedUser = await UserModel.findOne({username , isVerified : true})
        if(existingVerifiedUser)
        {
            return new Response(
                JSON.stringify({
                    success : false,
                    message : "Username is already taken"
                }),
                {status : 400}
            )
        }

        return new Response(
            JSON.stringify({
                success : true,
                message : "username available"
            }),
            {status : 200}
        ) 
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                sucess: false,
                message: "Error arises"
            }), { status: 500 })
    }
}