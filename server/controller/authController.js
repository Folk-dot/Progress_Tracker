import jwt from 'jsonwebtoken';
import 'dotenv/config';
import ServerError from '../utils/ServerError.js';

export default function authMiddleware (req, res, next) {
    const secret = process.env.PRIVATE_KEY;
    try{
        const authHeader = req.headers.authorization;
        if ( !authHeader ) {
            throw new Error();
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next(); 
    }catch (err) {
        next(new ServerError("Authentication failed", 401));
    }
}
