import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import ServerError from '../utils/ServerError.js';

dotenv.config({
  path: path.resolve(process.cwd(), '../.env')
});

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
