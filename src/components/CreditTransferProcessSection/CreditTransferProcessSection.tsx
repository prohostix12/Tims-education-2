import "../CreditTransferSection/tims-credit-transfer.css";

const steps = [
  {
    title: "Credit Evaluation:",
    subSteps: [
      "Submit your academic transcripts and relevant documents for evaluation.",
      "Our expert team will review your credits and determine the transferable courses.",
    ],
  },
  {
    title: "Credit Approval and Mapping:",
    subSteps: [
      "Once evaluated, we'll approve the transferable credits and map them to equivalent courses in your chosen program.",
    ],
  },
  {
    title: "Customized Academic Plan:",
    subSteps: [
      "Receive a customized academic plan detailing the courses you need to complete to fulfill the program requirements.",
    ],
  },
  {
    title: "Seamless Integration:",
    subSteps: [
      "Your approved credits seamlessly integrate into your academic journey, allowing you to progress efficiently.",
    ],
  },
];

export default function CreditTransferProcessSection() {
  return (
    <section className="tims-credit-section">
      <div className="tims-credit-inner">
        <div className="tims-credit-card">
          <h2 className="tims-credit-card-title">How Our Credit Transfer Services Work</h2>
          <p className="tims-credit-text">Our Credit Transfer Services follow a streamlined process:</p>

          <ol className="tims-credit-steps">
            {steps.map((step) => (
              <li className="tims-credit-step" key={step.title}>
                <h3 className="tims-credit-step-title">{step.title}</h3>
                <ul className="tims-credit-substeps">
                  {step.subSteps.map((subStep) => (
                    <li className="tims-credit-substep" key={subStep}>
                      {subStep}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="tims-credit-card">
          <h2 className="tims-credit-card-title">Partner with TIMS Education for a Smooth Transition</h2>
          <p className="tims-credit-text">
            At TIMS Education, we&rsquo;re committed to making your academic journey as
            seamless as possible. Our{" "}
            <strong className="tims-credit-highlight">Credit Transfer Services</strong> are
            tailored to ensure that your prior learning is recognized and contributes to your
            current educational pursuits.
          </p>
          <p className="tims-credit-text">
            Explore our <strong className="tims-credit-highlight">Credit Transfer Services</strong>{" "}
            and make the most of your academic achievements. Your progress matters, and
            we&rsquo;re here to support your educational aspirations!
          </p>
        </div>
      </div>
    </section>
  );
}
