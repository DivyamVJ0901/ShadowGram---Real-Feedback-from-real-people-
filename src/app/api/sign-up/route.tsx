import dbConnect from "@/lib/dbConnect"; // DB connection har ek route pe lagta hai kyuki Next.js edge pe chalta haioi
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"
import sendverificationmail from "../../../../emails/VerificationEmail";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingUserVerifiedByUsername) {
            return new Response(
                JSON.stringify({
                    sucess: false,
                    message: "USername is already taken"
                })
                , { status: 400 })
        }

        const existingUserbyEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        sucess: false,
                        message: "User already exist with this username"
                    })
                    , { status: 400 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserbyEmail.save();
            }
        }
        else {
            // For new user
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1); // Here expiryDate is an object hai aur object se pehle let / const kuch bhi ho , object memory ke ander ek reference point hai jo ki pura area hai uske ander values change hoti rehti hai  

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }


        // Send Verification mail
        const emailResponse = await sendverificationmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: email.message
                }), { status: 400 })
        }


        return new Response(
            JSON.stringify({
                sucess: true,
                message: "User registered successfully"
            })
            , { status: 200 })
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                sucess: false,
                message: "Error in registering user"
            }), { status: 400 })

    }
}