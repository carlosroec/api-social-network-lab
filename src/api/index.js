import { Router } from 'express';
import auth from './routes/auth';
import friend from './routes/friend';

export default () => {
    const app = Router();

    auth(app);
    friend(app);

    return app;
}