import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs" // Because we have to checek password
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    }); 
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }
                    const isPasswordCorrect = await bcrypt.compare( credentials.password , user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks : {
        async jwt({token , user}){
            // Here token is getting all the values from user
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMesages = user.isAcceptingMesages,
                token.username = user.username
            }

            return token;
        },
        async session({session , token}){
            // Here session is getting all the values from the token
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMesages = token.isAcceptingMesages
                session.user.username = token.username
            }
            return session;
        },
    },
    pages : {
        signIn : "/sign-in" // We are using Next.js , All the work will be done by next auth . We donot have to work on our own. All the control will be in Nextauth's hand
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET_KEY,
}