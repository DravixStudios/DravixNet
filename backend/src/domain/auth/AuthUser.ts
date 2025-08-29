export interface AuthUser {
    username: string;
    email: string;
    password: string;
    steam_id?: string | null;
}