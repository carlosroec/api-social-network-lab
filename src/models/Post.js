import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;
const Post = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Please enter a content'],
            index: true,
        },
        isPublic: {
            type: Boolean,
            index: true,
        },
        userID: {
            type: ObjectId,
            required: true,
            index: true,
        }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('Post', Post);
