import { body } from "express-validator";

const alpErr="must only contain letters.";
const emailErr="must be a valid email address.";
const minPassErr="must be at least 6 characters."
const emptyErr="is required."

const validateRegistration = [
    body('first_name').trim().isAlpha("en-US").withMessage(`First name ${alpErr}`).notEmpty().withMessage(`First name ${emptyErr}`),
    body('last_name').trim().isAlpha("en-US").withMessage(`Last name ${alpErr}`).notEmpty().withMessage(`Last name ${emptyErr}`),
    body('username').trim().isEmail().withMessage(`Username ${emailErr}`).notEmpty().withMessage(`Username ${emptyErr}`),
    body('password').isLength({min:6}).withMessage(`Password ${minPassErr}`).notEmpty().withMessage(`Password ${emptyErr}`)
]

const validateLogin = [
    body('username').trim().isEmail().withMessage(`Username ${emailErr}`).notEmpty().withMessage(`Username ${emptyErr}`),
    body('password').notEmpty().withMessage(`Password ${emptyErr}`)
]

export { validateLogin, validateRegistration };