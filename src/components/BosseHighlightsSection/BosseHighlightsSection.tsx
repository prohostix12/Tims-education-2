import "../ApprenticeshipSection/tims-apprenticeship-section.css";

const highlights = [
  {
    title: "Empowering with Skills",
    text: "BOSE focuses on imparting practical skills that are vital for personal, professional, and societal development. It empowers individuals to acquire competencies essential for success in diverse industries and domains.",
  },
  {
    title: "Flexible Learning Approach",
    text: "BOSE embodies a flexible learning approach, ensuring that education is not confined to traditional classrooms. It encourages learners to explore, learn, and grow at their own pace, fostering a culture of continuous learning.",
  },
  {
    title: "Skill-Centric Curriculum",
    text: "The curriculum at BOSE is meticulously designed, emphasizing skill development and practical application. It equips learners with hands-on experience, enabling them to thrive in today's competitive world.",
  },
  {
    title: "Inclusive Education",
    text: "BOSE is committed to providing inclusive education that caters to a diverse audience. It ensures that skill education is accessible to everyone, regardless of age, background, or location, enabling a broader demographic to benefit from its offerings.",
  },
  {
    title: "Industry-Relevant Training",
    text: "BOSE collaborates with industries and professionals to offer training programs aligned with current market needs. This ensures that learners are equipped with skills that are highly relevant and in demand.",
  },
];

export default function BosseHighlightsSection() {
  return (
    <section className="tims-apprenticeship-section">
      <div className="tims-apprenticeship-inner">
        <div className="tims-apprenticeship-card">
          <h2 className="tims-apprenticeship-card-title">
            Unveiling the Essence of BOSE: Skill Education and More
          </h2>
          <ol className="tims-apprenticeship-steps">
            {highlights.map((item) => (
              <li className="tims-apprenticeship-step" key={item.title}>
                <span className="tims-apprenticeship-step-number" aria-hidden="true" />
                <div>
                  <h3 className="tims-apprenticeship-step-title">{item.title}</h3>
                  <p className="tims-apprenticeship-step-text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
