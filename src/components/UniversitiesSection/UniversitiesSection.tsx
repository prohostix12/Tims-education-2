import Link from "next/link";
import "./tims-universities-section.css";

type Accent = "red" | "navy";

type University = {
  name: string;
  slug: string;
  href: string;
  description: string;
  accent: Accent;
  image: string;
};

const universities: University[] = [
  {
    name: "Aligarh Muslim University",
    slug: "amu",
    href: "/universities/degree-pg/aligarh-muslim-university",
    description:
      "Aligarh Muslim University (AMU): Shaping Futures, Empowering Minds with recognized distance & online degree programs.",
    accent: "red",
    image: "/images/aligrh_image.png",
  },
  {
    name: "Swami Vivekanand Subharti University",
    slug: "svsu",
    href: "/universities/degree-pg/swami-vivekanand-subharti-university",
    description:
      "Swami Vivekanand Subharti University (SVSU): UGC & DEB approved online and distance learning programs.",
    accent: "navy",
    image: "/images/swami-logo.webp",
  },
  {
    name: "Guru Kashi University",
    slug: "guru-kashi",
    href: "/universities/degree-pg/guru-kashi-university",
    description:
      "Guru Kashi University: Prominent institution offering accredited distance degree, credit transfer, and PG courses.",
    accent: "red",
    image: "/images/universities/guru-kashi-university.jpg",
  },
  {
    name: "Mizoram University",
    slug: "mizoram",
    href: "/universities/degree-pg/mizoram-university",
    description:
      "Mizoram University: A Central University offering accredited online degree, diploma, and master programs.",
    accent: "navy",
    image: "/images/andhra_image.png",
  },
  {
    name: "Suresh Gyan Vihar University",
    slug: "sgvu",
    href: "/universities/degree-pg/suresh-gyan-vihar-university",
    description:
      "Suresh Gyan Vihar University (SGVU): NAAC 'A+' accredited university providing flexible distance education.",
    accent: "red",
    image: "/images/bg-1.png",
  },
  {
    name: "Andhra University",
    slug: "andhra",
    href: "/universities/degree-pg/andhra-university",
    description:
      "Andhra University: Legacy of excellence with AICTE & UGC approved distance and online degree courses.",
    accent: "navy",
    image: "/images/andra-logo.webp",
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
          <h2 className="tims-universities-title">Explore Partner Universities</h2>
        </div>

        <div className="tims-universities-grid">
          {universities.map((uni) => (
            <article
              key={uni.slug}
              className={`tims-uni-card tims-uni-card--${uni.accent}`}
            >
              <Link href={uni.href} className="tims-uni-card-image-link" aria-label={`View details for ${uni.name}`}>
                <div className="tims-uni-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uni.image} alt={uni.name} />
                </div>
              </Link>

              <CardDivider />

              <div className="tims-uni-card-body">
                <span className="tims-uni-card-icon">
                  <InstitutionIcon />
                </span>

                <h3 className="tims-uni-card-title">
                  <Link href={uni.href} style={{ color: "inherit", textDecoration: "none" }}>
                    {uni.name}
                  </Link>
                </h3>

                <p className="tims-uni-card-description">{uni.description}</p>

                <Link href={uni.href} className="tims-uni-card-button">
                  <span>View Details</span>
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
