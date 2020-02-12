import { Router } from 'express';
import PostService from '../../services/post';
import logger from '../../services/logger';
import postModel from '../../models/post';

const route = Router();

export default (app) => {
    app.use('/post', route);

    // Create a Post
    route.post('/', async (req, res, next) => {
        logger.debug('Calling Create endpoint with body: %o', req.body);

        try {
            const postServiceInstance = new PostService(logger, postModel);
            const post = await postServiceInstance.Create(req.body);

            return res.status(201).json(post);
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });

    // Find a Post
    route.get('/:postID', async (req, res, next) => {
        logger.debug('Calling Create endpoint with body: %o', req.params);

        try {
            const postServiceInstance = new PostService(logger, postModel);
            const post = await postServiceInstance.FindOne(req.params);

            return res.status(200).json(post);
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });

    // Update a Post
    route.put('/', async (req, res, next) => {
        logger.debug('Calling Update endpoint with body: %o', req.body);

        try {
            const postServiceInstance = new PostService(logger, postModel);
            const post = await postServiceInstance.Update(req.body);

            return res.status(200).json(post);
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });

    // Destroy a Post
    route.delete('/:postID', async (req, res, next) => {
        logger.debug('Calling Create endpoint with body: %o', req.params);

        try {
            const postServiceInstance = new PostService(logger, postModel);
            const post = await postServiceInstance.Destroy(req.params);

            return res.status(200).json(post);
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });
}
