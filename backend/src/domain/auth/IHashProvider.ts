export interface IHashProvider {
    hash(payload: string, rounds: number): Promise<string>;
    compare(plain: string, hashed: string): Promise<boolean>;
}