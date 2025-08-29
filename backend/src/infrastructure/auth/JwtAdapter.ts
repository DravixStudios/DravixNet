import type { ITokenData } from "@/domain/auth/ITokenData";
import type { ITokenProvider } from "@/domain/auth/ITokenProvider";
import jwt, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken';

export const JwtAdapter: ITokenProvider = {
    sign: async (payload: ITokenData, secret: string): Promise<string> => {
        const token: string = await jwt.sign(payload, secret);
        return token;
    },
    
    verify: async (token: string, secret: string): Promise<boolean> => {
        try {
        await jwt.verify(token, secret);
        return true;
    } catch (e) {
        return false;
    }
    }
}