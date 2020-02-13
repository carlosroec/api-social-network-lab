import mongoose from "mongoose";

export default class PostService {
    constructor(logger, postModel, friendModel) {
        this.logger = logger;
        this.postModel = postModel;
        this.friendModel = friendModel;
    }

    async Create({ content, isPublic, userID }) {
        try {
            this.logger.silly('Creating a Post record');

            const postRecord = await this.postModel.create({
                content,
                isPublic,
                userID
            });

            // const post = postRecord.toObject();

            // return { "_id": "5e4374940a6e1c7452b1f5a1", "user": { "_id": "5e436648036ca3727ad3e014", "name": "c", "email": "cc.com" }, "content": "same post 123", "isPublic": true, "removed": false, "createdAt": "2020-02-12T03:44:20.113Z", "updatedAt": "2020-02-12T03:49:35.337Z" };

            const posts = await this.friendModel.aggregate([
                {
                    "$match": { "userID": mongoose.Types.ObjectId(userID) }
                },
                {
                    "$lookup": {
                        "from": "posts",
                        "localField": "friendID",
                        "foreignField": "userID",
                        "as": "posts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$posts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "posts.userID",
                        "foreignField": "_id",
                        "as": "posts.user"
                    }
                },
                {
                    "$unwind": {
                        "path": "$posts.user",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$sort": {
                        "posts.createdAt": -1
                    }
                }
            ]);

            const postsWithUser = [];
            posts.forEach(post => {
                if (post.posts.user._id.toString() === userID.toString()) {
                    postsWithUser.push({
                        "_id": post.posts._id,
                        "user": {
                            "_id": post.posts.user._id,
                            "name": post.posts.user.name,
                            "email": post.posts.user.email,
                        },
                        "content": post.posts.content,
                        "isPublic": post.posts.isPublic,
                        "removed": false,
                        "createdAt": post.posts.createdAt,
                        "updatedAt": post.posts.updatedAt
                    });
                } else if (post.posts.isPublic) {
                    postsWithUser.push({
                        "_id": post.posts._id,
                        "user": {
                            "_id": post.posts.user._id,
                            "name": post.posts.user.name,
                            "email": post.posts.user.email,
                        },
                        "content": post.posts.content,
                        "isPublic": post.posts.isPublic,
                        "removed": false,
                        "createdAt": post.posts.createdAt,
                        "updatedAt": post.posts.updatedAt
                    });
                }
            });

            return postsWithUser;
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }

    async FindOne({ postID }) {
        try {
            this.logger.silly('Find a Post record');

            const post = await this.postModel.findById(postID);

            if (!post) {
                this.logger.error('Post not found');

                const err = new Error('Not Found');
                err.status = 404;
                
                throw err;
            }

            return post.toObject();
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }

    async Update({ postID, content, isPublic }) {
        try {
            this.logger.silly('Updating a Post record');

            const post = await this.postModel.findById(postID);

            if (!post) {
                this.logger.error('Post not found');

                const err = new Error('Not Found');
                err.status = 404;
                
                throw err;
            }

            post.content = content;
            post.isPublic = isPublic;
            
            const postUpdated = await post.save();
            console.log(postUpdated);

            return post.toObject();
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }

    async Destroy({ postID }) {
        try {
            this.logger.silly('Destroy a Post record');

            const post = await this.postModel.findById(postID);

            if (!post) {
                this.logger.error('Post not found');

                const err = new Error('Not Found');
                err.status = 404;
                
                throw err;
            }

            return post.remove();
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }

    async MyPosts({userID}) {
        try {
            this.logger.silly('Listing my Posts records');

            const posts = await this.friendModel.aggregate([
                {
                    "$match": { "userID": mongoose.Types.ObjectId(userID) }
                },
                {
                    "$lookup": {
                        "from": "posts",
                        "localField": "friendID",
                        "foreignField": "userID",
                        "as": "posts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$posts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "posts.userID",
                        "foreignField": "_id",
                        "as": "posts.user"
                    }
                },
                {
                    "$unwind": {
                        "path": "$posts.user",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$sort": {
                        "posts.createdAt": -1
                    }
                }
            ]);

            // const postsWithUser = posts.map(post => ({
            //     "_id": post.posts._id,
            //     "user": {
            //         "_id": post.posts.user._id,
            //         "name": post.posts.user.name,
            //         "email": post.posts.user.email,
            //     },
            //     "content": post.posts.content,
            //     "isPublic": post.posts.isPublic,
            //     "createdAt": post.createdAt,
            //     "updatedAt": post.updatedAt
            // }));

            const postsWithUser = [];
            posts.forEach(post => {
                if (post.posts.user._id.toString() === userID.toString()) {
                    postsWithUser.push({
                        "_id": post.posts._id,
                        "user": {
                            "_id": post.posts.user._id,
                            "name": post.posts.user.name,
                            "email": post.posts.user.email,
                        },
                        "content": post.posts.content,
                        "isPublic": post.posts.isPublic,
                        "removed": false,
                        "createdAt": post.posts.createdAt,
                        "updatedAt": post.posts.updatedAt
                    });
                } else if (post.posts.isPublic) {
                    postsWithUser.push({
                        "_id": post.posts._id,
                        "user": {
                            "_id": post.posts.user._id,
                            "name": post.posts.user.name,
                            "email": post.posts.user.email,
                        },
                        "content": post.posts.content,
                        "isPublic": post.posts.isPublic,
                        "removed": false,
                        "createdAt": post.posts.createdAt,
                        "updatedAt": post.posts.updatedAt
                    });
                }
            });

            return postsWithUser;
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }
}