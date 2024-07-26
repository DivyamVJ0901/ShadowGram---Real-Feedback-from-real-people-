import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
            return new Response(
                JSON.stringify({ message: 'User not found', success: false }),
                { status: 404 }
            );
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessage) {
            return new Response(
                JSON.stringify({ message: 'User is not accepting messages', success: false }),
                { status: 403 } // 403 Forbidden status
            );
        }

        const newMessage = { content, createdAt: new Date() };
        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return new Response(
            JSON.stringify({ message: 'Message Sent successfully', success: true }),
            { status: 201 } 
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error', success: false}),
            { status: 500 } 
        );
    }
}