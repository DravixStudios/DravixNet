export interface IHashProvider {
    hash(payload: string, rounds: number): Promise<string>;
}