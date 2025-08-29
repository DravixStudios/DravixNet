import type { ITokenData } from "./ITokenData";

export interface ITokenProvider {
    sign(payload: ITokenData, secret: string): Promise<string>;
    verify(token: string, secret: string): Promise<boolean>;
}