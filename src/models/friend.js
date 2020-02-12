import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;
const Friend = new mongoose.Schema(
    {
        myID: {
            type: ObjectId,
            required: true,
            index: true,
        },
        myFriendID: {
            type: ObjectId,
            required: true,
            index: true,
        }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('Friend', Friend);
