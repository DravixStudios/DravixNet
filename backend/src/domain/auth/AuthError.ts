export enum EAuthErrorType {
    EmailExists = 1 << 0,
    UsernameExists = 1 << 1,
    UserNotFound = 1 << 2,
    InvalidPassword = 1 << 3,
    UndefinedError = 0xFF
}

export interface AuthError {
    type: EAuthErrorType;
    errors: Array<string>;
}