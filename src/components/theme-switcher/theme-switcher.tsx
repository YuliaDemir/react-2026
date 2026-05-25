import { useTheme } from '@/dark-light-theme/use-theme';
import styles from './theme-switcher.module.scss';
import { ButtonOrLink } from '../button/button-or-link';

export const ThemeSwitcher = () => {

    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
        <ButtonOrLink
            cn={styles.switcher}
            type="button"
            onClick={toggle}
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
            <span className={styles.icon} aria-hidden="true">
                {isDark ? '🌙' : '☀️'}
            </span>

            <span className={styles.text}>{isDark ? 'Dark' : 'Light'}</span>

            <span className={styles.track} aria-hidden="true">
                <span className={styles.thumb} />
            </span>
        </ButtonOrLink>
    );
};