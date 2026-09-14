import "./tims-skill-courses.css";

type SkillCourse = {
  title: string;
  category: string;
  duration: string;
  eligibility: string;
  description: string;
  topics: string[];
};

const skillCourses: SkillCourse[] = [
  {
    title: "Digital Marketing & Social Media",
    category: "Marketing & Growth",
    duration: "3 - 6 Months",
    eligibility: "10th / Plus Two / Any Graduate",
    description:
      "Master search engine optimization (SEO), Google Ads, social media marketing, content creation, and analytics to boost brand presence.",
    topics: ["SEO & Keyword Strategy", "Google Ads & PPC Campaigns", "Meta & Instagram Marketing", "Analytics & Reporting"],
  },
  {
    title: "Full-Stack Web Development",
    category: "Software & IT",
    duration: "6 Months",
    eligibility: "Plus Two / Any Degree",
    description:
      "Build modern, responsive websites and full-stack web applications using HTML5, CSS3, JavaScript, React, Node.js, and databases.",
    topics: ["HTML5, CSS3 & Responsive UI", "JavaScript & React.js", "Node.js & API Integration", "MongoDB & SQL Databases"],
  },
  {
    title: "Tally Prime & GST Accounting",
    category: "Finance & Accounts",
    duration: "3 Months",
    eligibility: "10th / Plus Two / Commerce",
    description:
      "Gain practical computerized accounting expertise covering Tally Prime, GST returns, e-invoicing, payroll management, and financial audits.",
    topics: ["Tally Prime Setup & Vouchers", "GST Filing & E-Way Bills", "Payroll & TDS Computation", "Financial Reports & Auditing"],
  },
  {
    title: "Data Analytics & Python Basics",
    category: "Data Science",
    duration: "4 - 6 Months",
    eligibility: "Plus Two / Science / Graduates",
    description:
      "Learn data visualization, statistical analysis, Advanced Excel, Python for data manipulation, and PowerBI business dashboarding.",
    topics: ["Advanced Excel & Pivot Tables", "Python Data Libraries (Pandas/NumPy)", "PowerBI Dashboard Creation", "Business Data Insights"],
  },
  {
    title: "Graphic Design & UI/UX Essentials",
    category: "Design & Media",
    duration: "3 - 6 Months",
    eligibility: "10th / Plus Two / Any Learner",
    description:
      "Create stunning visuals, branding materials, and digital product user interfaces using industry-standard tools like Photoshop, Illustrator, and Figma.",
    topics: ["Adobe Photoshop & Illustrator", "Branding & Poster Design", "Figma Wireframing & UI Kits", "User Experience (UX) Principles"],
  },
  {
    title: "Office Automation & Secretarial Practice",
    category: "Administration",
    duration: "3 Months",
    eligibility: "10th / Plus Two",
    description:
      "Develop executive office administration skills including MS Office suite, professional email correspondence, document management, and communication.",
    topics: ["MS Word, Excel & PowerPoint", "Business Email Etiquette", "Record Keeping & Archiving", "Executive Soft Skills"],
  },
];

const highlights = [
  {
    icon: "🏆",
    title: "Recognized Certification",
    description: "Receive valuable industry certificates upon course completion.",
  },
  {
    icon: "🕒",
    title: "Flexible Timings",
    description: "Choice of regular, weekend, or online interactive batches.",
  },
  {
    icon: "🛠️",
    title: "100% Practical Training",
    description: "Hands-on learning with real-world case studies & projects.",
  },
  {
    icon: "💼",
    title: "Career Assistance",
    description: "Resume guidance, interview prep & placement support.",
  },
];

export default function SkillCoursesSection() {
  return (
    <section className="tims-skill-section">
      <div className="tims-skill-inner">
        {/* Header */}
        <div className="tims-skill-header">
          <span className="tims-skill-rule" aria-hidden="true" />
          <span className="tims-skill-label">JOB-ORIENTED LEARNING</span>
          <h1 className="tims-skill-heading">
            Empower Your Future with In-Demand Skill Courses
          </h1>
          <p className="tims-skill-intro">
            Tirur Institute of Management Studies offers industry-tailored short-term and professional skill development programs designed to accelerate your career growth and employment opportunities.
          </p>
        </div>

        {/* Highlights Bar */}
        <div className="tims-skill-highlights-grid">
          {highlights.map((item) => (
            <div key={item.title} className="tims-skill-highlight-card">
              <span className="tims-skill-highlight-icon">{item.icon}</span>
              <div>
                <h3 className="tims-skill-highlight-title">{item.title}</h3>
                <p className="tims-skill-highlight-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="tims-skill-courses-grid">
          {skillCourses.map((course) => (
            <div key={course.title} className="tims-skill-course-card">
              <div>
                <span className="tims-skill-course-badge">{course.category}</span>
                <h2 className="tims-skill-course-title">{course.title}</h2>
                <p className="tims-skill-course-desc">{course.description}</p>

                <div className="tims-skill-course-meta">
                  <span className="tims-skill-meta-item">
                    ⏱️ <strong>Duration:</strong> {course.duration}
                  </span>
                  <span className="tims-skill-meta-item">
                    🎓 <strong>Eligibility:</strong> {course.eligibility}
                  </span>
                </div>
              </div>

              <div>
                <ul className="tims-skill-course-topics">
                  {course.topics.map((topic) => (
                    <li key={topic} className="tims-skill-topic-item">
                      <span className="tims-skill-topic-bullet" aria-hidden="true" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
