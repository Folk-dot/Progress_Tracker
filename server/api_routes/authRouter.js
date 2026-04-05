import { Router } from "express";
import * as db from "../db/queries.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import ServerError from "../utils/ServerError.js";
const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try{
        const user = await db.getUser(username);
        if ( !user ) {
            throw new ServerError('Invalid username or password', 401);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch ) {
            throw new ServerError('Invalid username or password', 401);
        }
        const secret = process.env.PRIVATE_KEY;
        const token = jwt.sign({ user_id: user.user_id, username }, secret);
        res.status(200).json({
            message: 'Login success',
            token})
        return; 
    }catch (err) {
        next(err);
    }
});

authRouter.post('/register', async(req, res, next) => {
    const { first_name, last_name, username, password } = req.body;
    try{
        const hashedPass = await bcrypt.hash(password, 10);
        const user_id = await db.registerUser( first_name, last_name, username, hashedPass);
        const secret = process.env.PRIVATE_KEY;
        const token = jwt.sign({ user_id, username }, secret);
        res.status(201).json({
            message: 'Registration success',
            token})
        return;
    }catch (err) {
        if ( err.code === '23505' ){
            return next(new ServerError('Username already exists', 401));
        }
        next(err)
    }
})

export default authRouter;