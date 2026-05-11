import type { ErrorHandler } from "../../utils/error-handler";

export const ErrorDisplay = ({ error }: { error: ErrorHandler }) => {

    return (
        < div className="error-display" >
            <h2>An error occurred</h2>
            <p>{error.getErrorMessageByStatus()}</p>
        </div >
    );
}