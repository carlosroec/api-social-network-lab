export default class PostService {
    constructor(logger, postModel) {
        this.logger = logger;
        this.postModel = postModel;
    }

    async Create({ content, isPublic, userID }) {
        try {
            this.logger.silly('Creating a Post record');

            const postRecord = await this.postModel.create({
                content,
                isPublic,
                userID
            });

            const post = postRecord.toObject();

            return post;
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


        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }
}