import jwt from 'jsonwebtoken';
import { errorHandelr } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if(!token) return next(errorHandelr(401, 'You are not authenticated !'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(errorHandelr(403, 'Invalid token !'));

        req.user = user;
        next();
    });
}