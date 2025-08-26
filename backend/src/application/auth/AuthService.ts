import type { AuthUser } from "@/domain/auth/AuthUser";
import type { IAuthRepository } from "@/domain/auth/IAuthRepository";
import type { IHashProvider } from "@/domain/auth/IHashProvider";
import { EAuthErrorType, type AuthError } from "@/domain/auth/AuthError";

export class AuthService {
    constructor(
        private authRepository: IAuthRepository,
        private hashProvider: IHashProvider
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
}