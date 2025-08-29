import type { AuthUser } from "@/domain/auth/AuthUser";
import type { IAuthRepository } from "@/domain/auth/IAuthRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PrismaAuthRepository: IAuthRepository = {
    findByUsername: async (username: string): Promise<AuthUser | null> => {
        const user = await prisma.users.findUnique({where: {username}});

        if(!user) return null;

        return {
            username: user.username,
            email: user.email,
            password: user.password,
            steam_id: user.steam_id
        }
    },
    emailExists: async (email: string): Promise<boolean> => ((await prisma.users.count({where: {email}})) > 0),
    usernameExists: async (username: string): Promise<boolean> => ((await prisma.users.count({where: {username}})) > 0),
    save: async (user: AuthUser) => {
        const savedUser: AuthUser = await prisma.users.create({data: {
            username: user.username,
            email: user.email,
            password: user.password,
            steam_id: user.steam_id ?? null
        }});

        return savedUser;
    }
}