import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;
const Friend = new mongoose.Schema(
    {
        userID: {
            type: ObjectId,
            required: true,
            index: true,
        },
        friendID: {
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
