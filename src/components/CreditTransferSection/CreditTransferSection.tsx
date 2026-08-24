import "./tims-credit-transfer.css";

const benefits = [
  {
    title: "Recognizing Your Prior Learning:",
    text: "We acknowledge the academic efforts you've put into your previous studies. Credit transfer allows recognition of your prior learning, ensuring you don't have to start from scratch.",
  },
  {
    title: "Cost-Efficient Education:",
    text: "Credit transfer can result in significant cost savings. You won't need to pay for courses you've already studied, making education more affordable and accessible.",
  },
  {
    title: "Accelerating Your Progress:",
    text: "By transferring credits, you can accelerate your academic progress. This means completing your program faster and moving closer to your educational goals efficiently.",
  },
  {
    title: "Tailored Academic Pathways:",
    text: "Transfer credits strategically to tailor your academic pathway. Choose courses that align with your interests and career aspirations, creating a personalized learning journey.",
  },
  {
    title: "Enabling Higher Degree Pursuits:",
    text: "Credit transfer can make pursuing higher degrees more feasible. It provides a stepping stone for your academic advancement, allowing you to pursue a master's or other higher-level programs.",
  },
];

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export default function CreditTransferSection() {
  return (
    <section className="tims-credit-section">
      <div className="tims-credit-inner">
        <div className="tims-credit-header">
          <span className="tims-credit-rule" aria-hidden="true" />
          <span className="tims-credit-label">Service</span>
          <h1 className="tims-credit-heading">
            Credit Transfer Services: Seamlessly Continue Your Academic Journey
          </h1>
          <h2 className="tims-credit-subheading">Unlocking the Potential of Credit Transfer</h2>
          <p className="tims-credit-intro">
            Credit transfer allows you to make the most of your educational investments.
            Here&rsquo;s why it matters:
          </p>
        </div>

        <div className="tims-credit-card">
          <div className="tims-credit-benefits">
            {benefits.map((benefit) => (
              <div className="tims-credit-benefit" key={benefit.title}>
                <span className="tims-credit-benefit-icon" aria-hidden="true">
                  <TargetIcon />
                </span>
                <div>
                  <h3 className="tims-credit-benefit-title">{benefit.title}</h3>
                  <p className="tims-credit-benefit-text">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
