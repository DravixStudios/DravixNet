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
                    ...(bEmailExists ? ["User with that email already exists"] : []),
                    ...(bUsernameExists ? ["User with that username already exists"] : [])
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
                    "User not found"
                ]
            };

            return err;
        }

        const user: AuthUser = (await this.authRepository.findByUsername(username))!;

        const bValidPassword: boolean = await this.hashProvider.compare(password, user.password);

        if(!bValidPassword) {
            const err: AuthError = {
                type: EAuthErrorType.IncorrectPassword,
                errors: [
                    "Incorrect password"
                ]
            };

            return err;
        }

        const tokenSecret: string | null | undefined = this.secretProvider.tokenSecret;

        if(!tokenSecret) {
            const err: AuthError = {
                type: EAuthErrorType.UndefinedError,
                errors: [
                    "Error not defined"
                ]
            };

            return err;
        }

        const token: string = await this.tokenProvider.sign({username: user.username, steam_id: user.steam_id ? user.steam_id : 0}, tokenSecret);
        return token;
    }

    async findByUsername(username: string): Promise<AuthUser | AuthError> {
        const user: AuthUser | null = await this.authRepository.findByUsername(username);

        if(!user) {
            const err: AuthError = {
                type: EAuthErrorType.UserNotFound,
                errors: [
                    "Username not found"
                ]
            };

            return err;
        }

        return user;
    }
}