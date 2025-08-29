import type { ITokenData } from "@/domain/auth/ITokenData";
import type { ITokenProvider } from "@/domain/auth/ITokenProvider";
import jwt, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken';

interface JwtTokenData extends JwtPayload {
    username: string;
    steam_id: string | number;
}

export const JwtAdapter: ITokenProvider = {
    sign: async (payload: ITokenData, secret: string): Promise<string> => {
        const token: string = await jwt.sign(payload, secret);
        return token;
    },
    
    verify: async (token: string, secret: string): Promise<ITokenData | null> => {
        try {
            const decoded: JwtTokenData = await jwt.verify(token, secret) as JwtTokenData;
            return {
                username: decoded.username,
                steam_id: decoded.steam_id
            };
        } catch(e) {
            return null;
        }
    }
}