import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import config from '../config';

export default class AuthService {
    constructor(logger, userModel) {
        this.logger = logger;
        this.userModel = userModel;
    }

    async SignUp({ name, username, email, password }) {
        try {
            const salt = randomBytes(32);

            this.logger.silly('Hashing password');
            const hashedPassword = await argon2.hash(password, { salt });

            this.logger.silly('Creating user DB record');
            const userRecord = await this.userModel.create({
                name,
                email,
                salt: salt.toString('hex'),
                password: hashedPassword,
            });

            this.logger.silly('Generating JWT');
            const token = this.generateToken(userRecord);
            
            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');

            return { user, token };
        } catch (e) {
            this.logger.error(e);

            throw e;
        }
    }

    async SignIn(email, password) {
        const userRecord = await this.userModel.findOne({ email });

        if (!userRecord) {
            throw new Error('User not registered');
        }

        this.logger.silly('Checking password');
        const validPassword = await argon2.verify(userRecord.password, password);

        if (!validPassword) {
            throw new Error('Invalid Password');
        }

        this.logger.silly('Password is valid!');
        this.logger.silly('Generating JWT');
        const token = this.generateToken(userRecord);

        // Update last visit field
        userRecord.lastVisit = new Date();
        await userRecord.save();

        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');

        return { user, token };
    }

    generateToken(user) {
        const today = new Date();
        const exp = new Date(today);

        exp.setDate(today.getDate() + 60);

        this.logger.silly(`Sign JWT for userId: ${user._id}`);

        return jwt.sign(
            {
                _id: user._id,
                role: user.role,
                name: user.name,
                exp: exp.getTime() / 1000,
            }, 
            config.jwtSecret
        );
    }
}
