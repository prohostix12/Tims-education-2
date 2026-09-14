"use client";

import { useEffect, useState } from "react";
import "./tims-team-section.css";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  accentBg?: string;
};

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Sujith Kumar",
    role: "Senior Academic Counselor",
    image: "",
  },
  {
    id: "tm-2",
    name: "Fathima Rishna",
    role: "Admission Coordinator",
    image: "",
  },
  {
    id: "tm-3",
    name: "Rahul K. Nair",
    role: "Student Support Officer",
    image: "",
  },
  {
    id: "tm-4",
    name: "Aiswarya V. P.",
    role: "Degree Program Advisor",
    image: "",
  },
  {
    id: "tm-5",
    name: "Muhammed Rashid",
    role: "NIOS Course Specialist",
    image: "",
  },
];

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c1.5-4.2 4.8-6.2 8-6.2s6.5 2 8 6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TeamMembersSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);

  useEffect(() => {
    async function loadBackendTeamMembers() {
      try {
        const res = await fetch("/api/team-members");
        const data = await res.json();
        if (data.teamMembers && Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
          const published = data.teamMembers.filter((m: any) => m.isPublished);
          if (published.length > 0) {
            setTeamMembers(
              published.map((item: any) => ({
                id: item.id,
                name: item.name,
                role: item.role,
                image: item.image || undefined,
                accentBg: item.accentBg || "#E91D24",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load team members from DB:", err);
      }
    }
    loadBackendTeamMembers();
  }, []);

  // Duplicate list for seamless infinite left-to-right marquee loop
  const loopMembers = [...teamMembers, ...teamMembers];

  return null;
  /*
  return (
    <section className="tims-team-section">
      <div className="tims-team-inner">
        <div className="tims-team-heading-wrap">
          <span className="tims-team-label">DEDICATED PROFESSIONALS</span>
          <h2 className="tims-team-heading">
            Our <span>Team Member</span>
          </h2>
          <p className="tims-team-subtitle">
            Meet the dedicated academic coordinators, career advisors, and student support specialists guiding your educational journey at TIMS.
          </p>
        </div>

        <div className="tims-team-marquee">
          <div className="tims-team-track">
            {loopMembers.map((member, index) => (
              <div className="tims-team-card" key={`${member.id}-${index}`}>
                <div className="tims-team-card-header">
                  <span className="tims-team-card-role">{member.role}</span>
                  <h3 className="tims-team-card-name">{member.name}</h3>
                </div>

                <div className="tims-team-photo-container">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="tims-team-portrait-img"
                    />
                  ) : (
                    <div className="tims-team-placeholder-space">
                      <PersonIcon />
                      <span className="tims-team-placeholder-text">Team Member</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
  */
}
