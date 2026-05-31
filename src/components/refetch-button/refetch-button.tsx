import { ButtonOrLink } from "../button/button-or-link";

import styles from "./refetch-button.module.scss";
import { useStateRefetchButton } from "@/utils/hooks/use-handle-refetch";

export const RefetchButton = () => {
    const { isMenuOpen, setIsMenuOpen, handleBlur, handleRefetch } = useStateRefetchButton();

    return (
        <div className={styles.root} onBlur={handleBlur}>
            <ButtonOrLink
                variant="error"
                border="round-rectangle"
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                Refetch
            </ButtonOrLink>

            {isMenuOpen && (
                <div className={styles.menu}>
                    <ButtonOrLink
                        type="button"
                        variant="secondary"
                        border="round-rectangle"
                        onClick={() => handleRefetch("current")}
                    >
                        Refetch current
                    </ButtonOrLink>

                    <ButtonOrLink
                        type="button"
                        variant="secondary"
                        border="round-rectangle"
                        onClick={() => handleRefetch("all")}
                    >
                        Clear entire cache
                    </ButtonOrLink>
                </div>
            )}
        </div>
    );
};