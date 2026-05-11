import { Link } from "react-router";

export const AboutPage = () => {
    return (
        <div className="container">
            <h1>About</h1>

            <p>
                This is a product application where you can browse products, search by
                name, and navigate through pages.
            </p>

            <Link to="/products">Back to products</Link>
        </div>
    );
};