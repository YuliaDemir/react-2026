import styles from './loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.loader} role="status" aria-label="Loading">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
};