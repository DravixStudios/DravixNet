import type { ISecretProvider } from "@/domain/ISecretProvider";

const {
    TOKEN_SECRET
} = process.env;

export const EnvAdapter: ISecretProvider = {
    tokenSecret: TOKEN_SECRET || null
}