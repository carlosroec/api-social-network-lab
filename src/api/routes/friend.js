import { Router } from 'express';
import FriendService from '../../services/friend';
import logger from '../../services/logger';
import friendModel from '../../models/friend';

const route = Router();

export default (app) => {
    app.use('/friend', route);

    route.post('/add', async (req, res, next) => {
        logger.debug('Calling Add endpoint with body: %o', req.body);

        try {
            const friendServiceInstance = new FriendService(logger, friendModel);
            const friend = await friendServiceInstance.Add(req.body);

            return res.status(201).json(friend);
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });

    route.post('/my-friends', async (req, res, next) => {
        logger.debug('Calling My Friend endpoint with body:  %o', req.body);

        try {
            const friendServiceInstance = new FriendService(logger, friendModel);
            const myFriends = await friendServiceInstance.MyFriends(req.body);

            return res.status(200).json(myFriends);
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });
}
