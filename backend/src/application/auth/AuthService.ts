import type { AuthUser } from "@/domain/auth/AuthUser";
import type { IAuthRepository } from "@/domain/auth/IAuthRepository";
import { EAuthErrorType, type AuthError } from "@/domain/auth/AuthError";

export class AuthService {
    constructor(
        private authRepository: IAuthRepository
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

        const user: AuthUser = { username, email, password };
        const savedUser: AuthUser = await this.authRepository.save(user);
        
        return savedUser;
    }
}