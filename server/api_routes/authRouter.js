import { Router } from "express";
import * as db from "../db/queries.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import ServerError from "../utils/ServerError.js";
import { validationResult, matchedData } from "express-validator";
import { validateLogin, validateRegistration } from "../controller/validator.js";
const authRouter = Router();

authRouter.post('/login', validateLogin, async (req, res, next) => {
    const error = validationResult(req);
    if ( !error.isEmpty() ) {
        const errObj = {};
        error.array().forEach(err=>errObj[err.path]=err.msg);
        next(new ServerError('VALIDATION_ERROR', 'Invalid input', 400, errObj));
        return;
    }
    const { username, password } = matchedData(req);
    try{
        const user = await db.getUser(username);
        if ( !user ) {
            throw new ServerError('UNAUTHORIZED', 'Invalid username or password', 401);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch ) {
            throw new ServerError('UNAUTHORIZED', 'Invalid username or password', 401);
        }
        const secret = process.env.PRIVATE_KEY;
        const token = jwt.sign({ user_id: user.user_id, username }, secret);
        res.status(200).json({
            message: 'Login success',
            token})
    }catch (err) {
        next(err);
    }
});

authRouter.post('/register', validateRegistration, async(req, res, next) => {
    const error = validationResult(req);
    if ( !error.isEmpty() ) {
        const errObj = {};
        error.array().forEach(err=>errObj[err.path]=err.msg);
        next(new ServerError('VALIDATION_ERROR', 'invalid input', 400, errObj));
        return;
    }
    const { first_name, last_name, username, password } = matchedData(req);
    try{
        const hashedPass = await bcrypt.hash(password, 10);
        const user_id = await db.registerUser( first_name, last_name, username, hashedPass);
        const secret = process.env.PRIVATE_KEY;
        const token = jwt.sign({ user_id, username }, secret);
        res.status(201).json({
            message: 'Registration success',
            token})
    }catch (err) {
        if ( err.code === '23505' ){
            return next(new ServerError('USERNAME_ALREADY_EXIST', 'Username already exists', 401));
        }
        next(err)
    }
})

export default authRouter;