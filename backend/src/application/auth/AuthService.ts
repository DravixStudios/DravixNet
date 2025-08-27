import type { AuthUser } from "@/domain/auth/AuthUser";
import type { IAuthRepository } from "@/domain/auth/IAuthRepository";
import type { IHashProvider } from "@/domain/auth/IHashProvider";
import type { ITokenProvider } from "@/domain/auth/ITokenProvider";
import { EAuthErrorType, type AuthError } from "@/domain/auth/AuthError";
import type { ISecretProvider } from "@/domain/ISecretProvider";

export class AuthService {
    constructor(
        private authRepository: IAuthRepository,
        private hashProvider: IHashProvider,
        private tokenProvider: ITokenProvider,
        private secretProvider: ISecretProvider
    ) {}

    async register(username: string, email: string, password: string): Promise<AuthUser | AuthError> {
        const bEmailExists = await this.authRepository.emailExists(email);
        const bUsernameExists = await this.authRepository.usernameExists(username);
        if(bEmailExists || bUsernameExists) {
            const err: AuthError = {
                type: (bEmailExists ? EAuthErrorType.EmailExists : 0x00) | (bUsernameExists ? EAuthErrorType.UsernameExists : 0x00),
                errors: [
                    ...(bEmailExists ? "AuthError.EmailExists" : []),
                    ...(bUsernameExists ? "AuthError.UsernameExists" : [])
                ]
            };

            return err;
        }

        const hashedPassword = await this.hashProvider.hash(password, 12);

        const user: AuthUser = { username, email, password: hashedPassword };
        const savedUser: AuthUser = await this.authRepository.save(user);

        return savedUser;
    }

    async login(username: string, password: string): Promise<string | AuthError> {
        const bUserExists = await this.authRepository.usernameExists(username);
        if(!bUserExists) {
            const err: AuthError = {
                type: EAuthErrorType.UserNotFound,
                errors: [
                    "AuthError.UserNotFound"
                ]
            };

            return err;
        }

        const user: AuthUser = await this.authRepository.findByUsername(username);

        const bValidPassword: boolean = await this.hashProvider.compare(password, user.password);

        if(!bValidPassword) {
            const err: AuthError = {
                type: EAuthErrorType.InvalidPassword,
                errors: [
                    "AuthError.InvalidPassword"
                ]
            };

            return err;
        }

        const tokenSecret: string | null | undefined = this.secretProvider.tokenSecret;

        if(!tokenSecret) {
            const err: AuthError = {
                type: EAuthErrorType.UndefinedError,
                errors: [
                    "AuthError.UndefinedError"
                ]
            };

            return err;
        }

        const token: string = await this.tokenProvider.sign({username: user.username, steam_id: user.steam_id ? user.steam_id : 0}, tokenSecret);
        return token;
    }
}