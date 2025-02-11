import { FC } from 'react';
import styles from './Footer.module.css';

const Footer: FC = () => {
  // Get version from package.json
  const version = 'v' + import.meta.env.VITE_APP_VERSION || '0.1.0';
  // Get commit hash from environment variable (set during build)
  const commitHash = import.meta.env.VITE_COMMIT_HASH || 'development';
  const shortHash = commitHash.slice(0, 7);
  
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span>
          {version} (
          <a
            href={`https://github.com/dikodev/createDAO/commit/${commitHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {shortHash}
          </a>
          )
        </span>
      </div>
    </footer>
  );
};

export default Footer;
