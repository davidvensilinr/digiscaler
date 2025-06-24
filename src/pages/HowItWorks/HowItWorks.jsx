import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      title: "Sign Up",
      description: "Create your account as either a brand or creator to get started.",
      icon: "📝"
    },
    {
      title: "Complete Your Profile",
      description: "Add details about your brand or creator profile to help others find you.",
      icon: "🛠️"
    },
    {
      title: "Discover & Connect",
      description: "Browse through creators or brands and send connection requests.",
      icon: "🔍"
    },
    {
      title: "Collaborate",
      description: "Work together on campaigns, sponsorships, or content creation.",
      icon: "🤝"
    },
    {
      title: "Grow Together",
      description: "Track your performance and build long-term partnerships.",
      icon: "📈"
    }
  ];

  return (
    <div className="how-it-works">
      <div className="hero-section">
        <h1>How It Works</h1>
        <p>Simple steps to connect brands with creators for successful collaborations</p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-number">{index + 1}</div>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="cta-section">
        <h2>Ready to get started?</h2>
        <div className="cta-buttons">
          <button className="cta-button primary">Join as Brand</button>
          <button className="cta-button secondary">Join as Creator</button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;