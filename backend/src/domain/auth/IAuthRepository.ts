import type { AuthUser } from "./AuthUser";

export interface IAuthRepository {
    findByUsername(username: string): Promise<AuthUser | null>;
    emailExists(email: string): Promise<boolean>;
    usernameExists(username: string): Promise<boolean>;

    save(user: AuthUser): Promise<AuthUser>;
}