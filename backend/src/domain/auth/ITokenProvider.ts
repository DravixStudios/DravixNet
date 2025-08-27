export interface ITokenProvider {
    sign(payload: object, secret: string): Promise<string>;
    verify(token: string, secret: string): Promise<boolean>;
}