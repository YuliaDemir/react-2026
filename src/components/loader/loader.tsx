import styles from './loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
};