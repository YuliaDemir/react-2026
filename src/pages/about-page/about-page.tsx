import rssLogo from '../../public/rss-logo.c19ce1b4.svg';
import styles from './about-page.module.scss';
import { LINKS } from '@const';
import { ButtonOrLink } from '@/components/button/button-or-link';

const rss = "https://rs.school/";

export const AboutPage = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>About</h1>

            <p className={styles.text}>
                Я бурундук. У меня 4 лапки и две полоски. Люблю скакалку и батут.
            </p>

            <a
                className={styles.schoolLink}
                href={rss}
                target="_blank"
                rel="noreferrer"
            >
                <img className={styles.schoolLogo} src={rssLogo} alt="RS School logo" />
            </a>

            <ButtonOrLink variant="primary" border="round-rectangle" to={LINKS.home} cn={styles.link}>
                Back to products
            </ButtonOrLink>
        </div>
    );
};