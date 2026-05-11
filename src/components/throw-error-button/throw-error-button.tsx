import styles from './throw-error-button.module.scss';

export const ThrowErrorButton = ({ handleClick }: { handleClick: () => void }) => {
    return (
        <button className={styles.button} onClick={handleClick}>
            Throw error
        </button>
    );
};