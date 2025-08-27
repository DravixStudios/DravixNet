import 'dotenv/config';
import type { ISecretProvider } from "@/domain/ISecretProvider";

const {
    TOKEN_SECRET,
    PORT
} = process.env;

export const EnvAdapter: ISecretProvider = {
    tokenSecret: TOKEN_SECRET || null,
    port: PORT || '3000'
}