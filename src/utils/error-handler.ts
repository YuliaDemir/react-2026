export class ErrorHandler extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);

        this.status = status;

        Object.setPrototypeOf(this, ErrorHandler.prototype);
    }

    getErrorMessageByStatus(): string {
        if (this.status < 400) {

            return "Unexpected response status";
        }

        switch (this.status) {
            case 400:
                return "Invalid request. Please check the data and try again.";

            case 401:
                return "You need to sign in to continue.";

            case 403:
                return "You do not have permission to perform this action.";

            case 404:
                return "The requested product was not found.";

            case 408:
                return "The request took too long. Please try again.";

            case 409:
                return "There is a conflict with the current data.";

            case 422:
                return "Some fields contain invalid data.";

            case 429:
                return "Too many requests. Please try again later.";

            case 500:
                return "Something went wrong on the server. Please try again later.";

            case 502:
                return "The server received an invalid response. Please try again later.";

            case 503:
                return "The service is temporarily unavailable. Please try again later.";

            case 504:
                return "The server took too long to respond. Please try again later.";

            default:
                if (this.status >= 400 && this.status < 500) {
                    return "Something went wrong with the request.";
                }

                if (this.status >= 500) {
                    return "Something went wrong on our side. Please try again later.";
                }

                return "Unexpected error occurred.";
        }
    }

}