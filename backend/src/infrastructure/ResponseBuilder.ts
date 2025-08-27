export class ResponseBuilder {
    private statusCode: number = 200;
    private errors: Array<string> = [];
    private data: object = {};

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

    addError(error: string): ResponseBuilder {
        this.errors.push(error);
        return this;
    }

    addErrors(errors: Array<string>): ResponseBuilder {
        this.errors = [...this.errors, ...errors];
        return this;
    }

    addData(data: object) {
        this.data = data;
        return this;
    }

    build() {
       const messages: Map<number, string> = new Map([
            [200, "OK"],
            [201, "Created"],
            [204, "No Content"],
            [400, "Bad Request"],
            [401, "Unauthorized"],
            [403, "Forbidden"],
            [404, "Not Found"],
            [409, "Conflict"],
            [411, "Length Required"],
            [500, "Internal Server Error"],
            [502, "Bad Gateway"],
            [503, "Service Unavailable"],
        ]);

        return {
            code: this.statusCode,
            data: this.data,
            message: messages.get(this.statusCode),
            has_errors: this.errors.length > 0 ? true : false,
            errors: this.errors
        }
    }
}