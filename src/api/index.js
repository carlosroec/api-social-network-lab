import { Router } from 'express';
import auth from './routes/auth';
import friend from './routes/friend';
import post from './routes/post';

export default () => {
    const app = Router();

    auth(app);
    friend(app);
    post(app);

    return app;
}