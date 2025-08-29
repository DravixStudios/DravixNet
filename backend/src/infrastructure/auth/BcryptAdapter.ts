import type { IHashProvider } from "@/domain/auth/IHashProvider";
import bcrypt from 'bcrypt';

export const BcryptAdapter: IHashProvider = {
    hash: async (payload: string, rounds: number): Promise<string> => {
        const hashed: string = await bcrypt.hash(payload, rounds);
        return hashed;
    },

    compare: async (plain: string, hashed: string): Promise<boolean> => {
        const result: boolean = await bcrypt.compare(plain, hashed);
        return result;
    }
}