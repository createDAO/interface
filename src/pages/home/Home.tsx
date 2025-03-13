import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to createDAO</h1>
        <p className={styles.heroSubtitle}>The future of decentralized organizations is here</p>
      </div>
      
      {/* Tutorial Banner */}
      <div className={styles.tutorialBanner}>
        <p>
          <span className={styles.highlight}>New to DAOs?</span> Check out our comprehensive guide: <a 
            href="https://daoforum.org/threads/how-to-create-your-own-dao.1/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.tutorialLink}
          >DAOForum: How to Create Your Own DAO</a>
        </p>
      </div>
      
      {/* Main Content Grid */}
      <div className={styles.grid}>
        {/* What are DAOs Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>What's the Big Deal About DAOs?</h2>
          <div className={styles.cardContent}>
            <p>
              Remember when Ethereum came out and everyone was like "Wow, this is going to change everything!" 
              Well, they were right, and now we're taking it to the next level with DAOs.
            </p>
            <p>
              DAOs are the democratized way of building organizations that the world desperately needs. 
              Think about it – you have an idea, you create a DAO, you explain your vision, and boom! 
              You can get initial funding and start building with a community that believes in you.
            </p>
            <p>
              No more begging VCs who don't understand your vision. No more corporate hierarchies 
              where the best ideas die in committee meetings. Just pure, democratic innovation.
            </p>
          </div>
        </div>
        
        {/* Alpha Warning Card */}
        <div className={`${styles.card} ${styles.warningCard}`}>
          <h2 className={styles.cardTitle}>Important: We're in Alpha!</h2>
          <div className={styles.cardContent}>
            <p>
              All our contracts are currently deployed <strong>ONLY</strong> on the Sepolia testnet. 
              We're talking alpha phase here, not even beta!
            </p>
            <p>
              While we're incredibly excited about what we're building, please understand that 
              we're still testing and improving everything.
            </p>
            <p>
              <strong>Always use the latest version</strong> of CreateDAO since older versions 
              might contain bugs and vulnerabilities. We're moving fast and fixing things as we go!
            </p>
            <p>
              Need Sepolia ETH for testing? <a 
                href="https://daoforum.org/threads/how-to-get-sepolia-eth.2/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.link}
              >DAOForum: How To Get Sepolia Eth</a>.
            </p>
          </div>
        </div>
        
        {/* 5 Steps Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create Your DAO in 5 Simple Steps</h2>
          <div className={styles.cardContent}>
            <p>Let's get to the fun part – creating your very own DAO! Head over to our create page and follow these steps:</p>
            
            <ul className={styles.steps}>
              <li><strong>Choose Your Network</strong> - Currently, we only support Sepolia testnet</li>
              <li><strong>Choose Your Version</strong> - ALWAYS select the latest version</li>
              <li><strong>Name Your DAO</strong> - Choose a name that reflects your vision</li>
              <li><strong>Configure Your Token</strong> - Set name, symbol, and total supply</li>
              <li><strong>Connect Wallet & Sign</strong> - Confirm the transaction to create your DAO</li>
            </ul>
            
            <a href="/create-dao" className={styles.ctaButton}>Create Your DAO</a>
          </div>
        </div>
        
        {/* Behind the Scenes Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>What Happens Behind the Scenes?</h2>
          <div className={styles.cardContent}>
            <p>
              When you click that magical "Create DAO" button, CreateDAO springs into action and creates 
              FOUR main core contracts for your DAO:
            </p>
            
            <div className={styles.contractGrid}>
              <div className={styles.contractItem}>
                <span className={styles.contractName}>Main DAO Core</span>
                The brain of your operation, handling governance and decision-making
              </div>
              <div className={styles.contractItem}>
                <span className={styles.contractName}>Treasury</span>
                Your DAO's bank account, securely holding assets
              </div>
              <div className={styles.contractItem}>
                <span className={styles.contractName}>Staking</span>
                Where your community can stake tokens to participate in governance
              </div>
              <div className={styles.contractItem}>
                <span className={styles.contractName}>ERC20 Token</span>
                Your very own token that powers everything
              </div>
            </div>
            
            <p>
              Here's the cool part – upon creation, YOU will receive 1 token from the total supply. 
              The rest of the tokens will be safely locked in the treasury for future distribution.
            </p>
          </div>
        </div>
        
        {/* DAO.cafe Next Steps Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>What's Next? DAO.cafe!</h2>
          <div className={styles.cardContent}>
            <p>
              Creating your DAO is just the beginning of your journey. The next step is to register 
              your newly created DAO at <a href="https://dao.cafe" target="_blank" rel="noopener noreferrer">DAO.cafe</a>. 
              This is where you'll:
            </p>
            
            <ul className={styles.list}>
              <li>Start managing your DAO with a user-friendly interface</li>
              <li>Launch presales to distribute tokens and raise funds</li>
              <li>Invite people to join your community and contribute to your vision</li>
            </ul>
            
            <p>
              Think of CreateDAO as the birth of your DAO, and DAO.cafe as the place where it grows up and becomes awesome.
            </p>
          </div>
        </div>
        
        {/* Final Thoughts Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Join the Revolution</h2>
          <div className={styles.cardContent}>
            <p>
              By creating your DAO today, you're not just starting a project; you're joining a revolution. 
              You're saying "yes" to a future where great ideas can thrive regardless of who proposed them 
              or how much money they had to begin with.
            </p>
            <p>
              DAOs are the next big thing after Ethereum itself. We're witnessing the evolution of human 
              organization – from hierarchical structures to truly democratic, transparent, and efficient communities.
            </p>
            <p>
              So what are you waiting for? Your DAO is just a few clicks away!
            </p>
            
            <a href="/create-dao" className={styles.ctaButton}>Get Started Now</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
