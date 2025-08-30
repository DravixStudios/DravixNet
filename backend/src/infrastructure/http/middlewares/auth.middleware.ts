import {
    type Request,
    type Response,
    type NextFunction
} from 'express';

import { ResponseBuilder } from '@/infrastructure/ResponseBuilder';

const CheckRegisterBody = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json(
            new ResponseBuilder(400).addErrors([
                !req.body.username && 'Field username not in body',
                !req.body.email && 'Field email not in body',
                !req.body.password && 'Field password not in body',
            ].filter((e): e is string => typeof e === 'string')).build()
        )
    }

    const { username, email, password } = req.body;

    /* Long regex for checking the email */
    const emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    
    const bValidEmail: boolean = emailRegex.test(email);

    if(!bValidEmail) {
        return res.status(400).json(
            new ResponseBuilder(400).addError('Email not valid').build()
        );
    }

    if(username.length < 8 || password.length < 12) {
        return res.status(411).json(
            new ResponseBuilder(411).addErrors([
                username.length < 8 && 'Username must be at least 8 characters long',
                password.length < 12 && 'Password must be at least 12 characters long'
            ].filter((e): e is string => typeof e === 'string')).build()
        )
    }

    next();
}

const CheckLoginBody = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json(new ResponseBuilder(400).addErrors([
            !req.body.username && "Username not specified",
            !req.body.password && "Password required"
        ].filter((e): e is string => typeof e === 'string')).build());
    }

    next();
}

export { 
    CheckRegisterBody,
    CheckLoginBody
}