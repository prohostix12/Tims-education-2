import Link from "next/link";
import "./tims-universities-section.css";

type Accent = "red" | "navy";

type University = {
  name: string;
  slug: string;
  description: string;
  accent: Accent;
  /** Placeholder path — replace with the real image in /public later. */
  image: string;
};

const universities: University[] = [
  {
    name: "Aligarh Muslim University",
    slug: "amu",
    description:
      "Aligarh Muslim University (AMU): Shaping Futures, Empowering Minds Aligarh Muslim University...",
    accent: "red",
    image: "/images/aligrh_image.png",
  },
  {
    name: "Andhra University",
    slug: "andhra",
    description:
      "Andhra University Affiliations : AICTE, UGC Andhra University: Legacy of Excellence...",
    accent: "navy",
    image: "/images/andhra_image.png",
  },
  {
    name: "Guru Kashi University",
    slug: "guru-kashi",
    description: "View Website",
    accent: "red",
    image: "/images/universities/guru-kashi-university.jpg",
  },
];

function InstitutionIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M12 3 3 8.5 12 14l9-5.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6 11v5.2c0 1.5 2.7 3.3 6 3.3s6-1.8 6-3.3V11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M20 9v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Curved divider that blends the image into the card body below it. */
function CardDivider() {
  return (
    <svg
      className="tims-uni-card-divider"
      viewBox="0 0 300 32"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0,32 C90,0 210,0 300,32 Z" fill="currentColor" />
    </svg>
  );
}

export default function UniversitiesSection() {
  return (
    <section className="tims-universities-section">
      <div className="tims-universities-inner">
        <div className="tims-universities-heading-block">
          <span className="tims-universities-label">UNIVERSITIES &amp; BOARDS</span>
          <h2 className="tims-universities-title">Let&rsquo;s explore Degree/PG</h2>
        </div>

        <div className="tims-universities-grid">
          {universities.map((uni) => (
            <article
              key={uni.slug}
              className={`tims-uni-card tims-uni-card--${uni.accent}`}
            >
              <div className="tims-uni-card-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uni.image} alt={uni.name} />
              </div>

              <CardDivider />

              <div className="tims-uni-card-body">
                <span className="tims-uni-card-icon">
                  <InstitutionIcon />
                </span>

                <h3 className="tims-uni-card-title">{uni.name}</h3>

                <p className="tims-uni-card-description">{uni.description}</p>

                <Link href="#" className="tims-uni-card-button">
                  <span>View Service</span>
                  <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
