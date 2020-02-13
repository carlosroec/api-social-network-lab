import logger from '../../services/logger';
import UserModel from '../../models/user';

const attachCurrentUser = async (req, res, next) => {
    try {
        const userRecord = await UserModel.findById(req.token._id);

        if (!userRecord) {
            return res.sendStatus(401);
        }

        const currentUser = userRecord.toObject();
        Reflect.deleteProperty(currentUser, 'password');
        Reflect.deleteProperty(currentUser, 'salt');

        req.currentUser = currentUser;

        return next();
    } catch (e) {
        logger.error('Error attaching user to req: %o', e);

        return next(e);
    }
};

export default attachCurrentUser;
