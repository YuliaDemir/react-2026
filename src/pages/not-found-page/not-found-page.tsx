import { Link } from "react-router";

export const NotFoundPage = () => {
    return (
        <div>
            <h1>Page not found</h1>
            <Link to="/products">Go to products</Link>
        </div>
    );
};