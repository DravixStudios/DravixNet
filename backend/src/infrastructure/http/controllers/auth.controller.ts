import {
    type Request,
    type Response,
} from 'express';

import { AuthService } from "@/application/auth/AuthService";
import { BcryptAdapter } from "@/infrastructure/auth/BcryptAdapter";
import { JwtAdapter } from "@/infrastructure/auth/JwtAdapter";
import { PrismaAuthRepository } from "@/infrastructure/auth/PrismaAuthRepository";
import { EnvAdapter } from "@/infrastructure/EnvAdapter";
import type { AuthUser } from '@/domain/auth/AuthUser';
import { EAuthErrorType, type AuthError } from '@/domain/auth/AuthError';
import { ResponseBuilder } from '@/infrastructure/ResponseBuilder';

const auth = new AuthService(PrismaAuthRepository, BcryptAdapter, JwtAdapter, EnvAdapter);

const ErrorToCode = (type: EAuthErrorType): number => {
    if (type & EAuthErrorType.UsernameExists || type & EAuthErrorType.EmailExists) {
        return 409;
    }

    if (type & EAuthErrorType.IncorrectPassword) {
        return 401;
    }

    if (type & EAuthErrorType.UserNotFound) {
        return 404;
    }

    if (type & EAuthErrorType.UndefinedError) {
        return 500;
    }

    return 500;
};

export class AuthController {
    static async register(req: Request, res: Response) {
        const { username, email, password } = req.body;
        
        const user: AuthUser | AuthError = await auth.register(username, email, password);
        if ('errors' in user) {
            const err: AuthError = user as AuthError;
            const code: number = ErrorToCode(err.type);
            return res.status(code).json(new ResponseBuilder(code).addErrors(err.errors).build());
        }

        res.status(200).json(new ResponseBuilder(200).build());
    }
}