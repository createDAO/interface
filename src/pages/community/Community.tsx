import styles from './Community.module.css';

function Community() {
  const communityLinks = [
    {
      title: 'Telegram',
      description: 'Join our Telegram community for real-time discussions',
      url: 'https://t.me/createdao_org',
      icon: '💬'
    },
    {
      title: 'X',
      description: 'Follow us on X for the latest updates',
      url: 'https://x.com/createdao',
      icon: '🐦'
    },
    {
      title: 'Documentation',
      description: 'Learn how to create and manage DAOs',
      url: 'https://docs.createdao.org/',
      icon: '📚'
    },
    {
      title: 'GitHub',
      description: 'Contribute to our open-source projects',
      url: 'https://github.com/createdao',
      icon: '💻'
    }
  ];

  return (
    <div className={styles.container}>
      <h1>Community</h1>
      <p>Join our growing community of DAO creators and contributors</p>
      
      <div className={styles.linksGrid}>
        {communityLinks.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            className={styles.linkCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.icon}>{link.icon}</span>
            <h3>{link.title}</h3>
            <p>{link.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Community;
