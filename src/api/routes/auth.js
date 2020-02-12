import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
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

    route.post('/signin', 
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            })
        }),
        async (req, res, next) => {
            logger.debug('Calling Sign-In endpoint with body: %o', req.body);

            try {
                const { email, password } = req.body;
                const authServiceInstance = new AuthService(logger, userModel);
                const { user, status, token } = await authServiceInstance.SignIn(email, password);

                return res.json({ user, status, token }).status(200);
            } catch(e) {
                logger.error('error: %o', e);

                return next(e);
            }
        }
    );
}
