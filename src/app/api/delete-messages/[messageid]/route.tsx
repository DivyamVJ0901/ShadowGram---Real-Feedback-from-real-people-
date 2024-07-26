import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  if (!session || !_user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages : { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Message not found or already deleted' }),
        { status: 404 }
      );
      
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Message deleted' }),
      { status:  201}
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error in deleting message' }),
      { status: 500}
    );
  }
}