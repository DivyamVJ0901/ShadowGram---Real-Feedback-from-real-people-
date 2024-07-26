import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User

    if (!session || !_user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authenticated'
            }), { status: 401 }
        );
    }
    
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' }, // Unwind is use only for arrays 
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }, // Grouping of all the objects
        ]).exec();

        if (!user || user.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'User not found'
                }), { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: user[0].messages
            }), { status: 200 }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Internal server error'
            }), { status: 500}
        );
    }
}