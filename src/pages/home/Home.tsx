import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to createDAO</h1>
      <p>Discover and create DAOs with ease</p>
      
      <p className={styles.intro}>Create your DAO in minutes with just one transaction. Here's how it works:</p>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Deploy Your DAO</h2>
        <ul className={styles.steps}>
          <li>Visit the 'Create DAO' section in the header menu to access our deployment form</li>
          <li>You'll only pay the network's gas fees - our service is completely free</li>
        </ul>
        
        <div className={styles.contractList}>
          <h4>Your deployment will automatically create four key smart contracts:</h4>
          <div className={styles.contractItem}>
            <span className={styles.contractName}>Main DAO Contract:</span>
            Controls governance and voting
          </div>
          <div className={styles.contractItem}>
            <span className={styles.contractName}>Token Contract:</span>
            Manages voting power distribution
          </div>
          <div className={styles.contractItem}>
            <span className={styles.contractName}>Treasury Contract:</span>
            Handles all DAO assets
          </div>
          <div className={styles.contractItem}>
            <span className={styles.contractName}>Staking Contract:</span>
            Enables vote multipliers up to 2x based on staking duration
          </div>
        </div>

        <div className={styles.important}>
          Important: Save all contract addresses after deployment.
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Register Your DAO</h2>
        <p>
          Once deployed, register your DAO on <a href="https://dao.cafe" target="_blank" rel="noopener noreferrer" className={styles.link}>dao.cafe</a> to access management features. You'll need to stake 1 DAO token in your staking contract to verify ownership.
        </p>
      </div>
    </div>
  );
}

export default Home;
