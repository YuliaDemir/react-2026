import classNames from "classnames";
import style from "./button.module.scss";
import { Link } from "react-router";

type Props = {
    onClick?: () => void,
    type?: "button" | "submit",
    children: React.ReactNode,
    variant?: "primary" | "secondary" | "error",
    border?: "round" | "round-rectangle",
    to?: string,
    cn?: string,
}

export const ButtonOrLink = ({ onClick, type = "button", children, variant, border, to, cn, ...props }: Props) => {
    if (to) {
        return (
            <Link className={
                classNames(
                    variant && style[variant],
                    border && style[border],
                    cn
                )

            } onClick={onClick} to={to} {...props}>
                {children}
            </Link >
        )
    }

    return (
        <button className={classNames(
            variant && style[variant],
            border && style[border],
            cn
        )} type={type} onClick={onClick} {...props}>
            {children}
        </button>
    )
}