import { Router } from 'express';
import AuthService from '../../services/auth';
import logger from '../../services/logger';
import userModel from '../../models/user';

const route = Router();

export default (app) => {
    app.use('/auth', route);

    route.post('/signup', async (req, res, next) => {
        logger.debug('Calling Sign-Up endpoint with body: %o', req.body);

        try {
            const authServiceInstance = new AuthService(logger, userModel);
            const { user, token } = await authServiceInstance.SignUp(req.body);

            return res.status(201).json({ user, token });
        } catch (err) {
            logger.error('error', err);

            return next(err);
        }
    });
}
