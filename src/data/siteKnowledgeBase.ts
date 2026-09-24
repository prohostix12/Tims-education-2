export interface CourseOffering {
  name: string;
  category: string;
  description: string;
  eligibility?: string;
  duration?: string;
  universitiesOrBoards?: string[];
  keyFeatures?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OfficeLocation {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface DirectorInfo {
  name: string;
  role: string;
}

export interface SiteKnowledgeBase {
  company: {
    name: string;
    fullName: string;
    establishedYear: number;
    experienceYears: string;
    tagline: string;
    summary: string;
    mission: string;
    keyAchievements: string[];
    awards: string[];
  };
  offerings: {
    sslcPlusTwo: CourseOffering;
    degreeAndPostGraduation: CourseOffering;
    btechAndMtech: CourseOffering;
    diplomaCourses: CourseOffering;
    skillCourses: CourseOffering;
    apprenticeshipProgram: CourseOffering;
  };
  specialServices: {
    creditTransfer: {
      name: string;
      summary: string;
      description: string;
      benefits: string[];
    };
    certificateAttestation: {
      name: string;
      summary: string;
      description: string;
      types: string[];
    };
    studyMaterialsAndTma: {
      name: string;
      summary: string;
      description: string;
    };
  };
  universityPartners: string[];
  offices: {
    headOffice: OfficeLocation;
    edapalOffice: OfficeLocation;
  };
  faqs: FAQItem[];
  leadership: DirectorInfo[];
}

const siteKnowledgeBase: SiteKnowledgeBase = {
  company: {
    name: "TIMS Education",
    fullName: "Tirur Institute of Management Studies",
    establishedYear: 2009,
    experienceYears: "18+ Years",
    tagline: "Learning Without Boundaries - Learning Anytime, Anywhere for Success",
    summary:
      "TIMS Education (Tirur Institute of Management Studies) is a premier educational institution established in 2009 in Kerala. It provides accessible, high-quality distance and online education, degree programs, SSLC/Plus Two courses, and educational guidance across India and the GCC region.",
    mission:
      "To make higher education accessible to every section of society through accredited university partnerships, flexible learning options, and personalized student guidance.",
    keyAchievements: [
      "Over 18 years of academic excellence in educational counseling",
      "50,000+ students mentored and guided to successful graduation",
      "Official partner with top UGC-DEB approved universities and recognized boards"
    ],
    awards: [
      "Awarded 'Best Admission Partner' by Swami Vivekanand Subharti University (SVSU), presented by Prof. (Dr.) Mahavir Singh, Director, CDOE."
    ]
  },

  offerings: {
    sslcPlusTwo: {
      name: "SSLC & Plus Two (10th & 12th Standard)",
      category: "Schooling / Secondary Education",
      description:
        "Flexible 10th (SSLC) and 12th (Plus Two) education options through NIOS (National Institute of Open Schooling), BOSSE (Board of Open Schooling and Skill Education), and Jamia Urdu Aligarh. Enables students who failed, dropped out, or missed schooling to complete secondary education smoothly.",
      eligibility:
        "Anyone looking to complete 10th or 12th standard. 10th completion required for 12th admission; basic literacy/age criteria for 10th.",
      duration: "Flexible pacing (Fast-track/Stream options available based on board rules)",
      universitiesOrBoards: [
        "NIOS (National Institute of Open Schooling - MHRD Govt of India)",
        "BOSSE (Board of Open Schooling and Skill Education)",
        "Jamia Urdu Aligarh"
      ],
      keyFeatures: [
        "UGC, PSC, UPSC, and international embassy recognized certificates",
        "Flexible exam centers and study schedules",
        "Full Tutor Mark Assignment (TMA) guidance and study material distribution",
        "On-Demand examination options"
      ]
    },

    degreeAndPostGraduation: {
      name: "Undergraduate & Postgraduate Degree Programs (Distance & Online)",
      category: "Higher Education / University Degrees",
      description:
        "Comprehensive Bachelor's and Master's degree programs in Arts, Commerce, Science, Business, and IT, offered via distance learning (ODL) and online mode (OL) from UGC-DEB recognized universities.",
      eligibility:
        "Plus Two (12th) passed for Bachelor's programs; Bachelor's degree completed for Master's programs.",
      duration: "Undergraduate (UG): 3 Years | Postgraduate (PG): 2 Years",
      universitiesOrBoards: [
        "Aligarh Muslim University (AMU CDOE & Online)",
        "Swami Vivekanand Subharti University (SVSU)",
        "Suresh Gyan Vihar University (SGVU)",
        "Mizoram University Online",
        "Guru Kashi University (GKU)",
        "Andhra University",
        "Annamalai University",
        "Bharathiyar University"
      ],
      keyFeatures: [
        "Available courses include BA, BCom, BSc, BBA, BCA, MA, MCom, MSc, MBA, MCA",
        "100% valid for Kerala PSC, UPSC, Central Govt jobs, and foreign higher studies/WES",
        "Online proctored exams for GCC/working professionals or physical exam centers",
        "Digital LMS study access plus printed books"
      ]
    },

    btechAndMtech: {
      name: "B.Tech & M.Tech Programs (Flexible / Distance Mode)",
      category: "Engineering & Technology",
      description:
        "Engineering degree programs designed specifically for working professionals and diploma holders wanting to upgrade their technical qualifications while continuing their jobs.",
      eligibility:
        "Diploma in Engineering or 12th (Science/PCM) for B.Tech; B.Tech/BE completed for M.Tech.",
      duration: "B.Tech: 3-4 Years (Lateral entry available) | M.Tech: 2 Years",
      keyFeatures: [
        "Flexible weekend or evening learning structures for working technicians/engineers",
        "Industry-relevant curriculum with practical credit evaluations",
        "Valid for career advancement, promotions, and private/MNC jobs"
      ]
    },

    diplomaCourses: {
      name: "Diploma Programs (Management, Technical & Paramedical)",
      category: "Vocational & Professional Diplomas",
      description:
        "Short-term and long-term specialized diploma programs in business management, information technology, engineering trades, and health/paramedical fields.",
      eligibility: "10th (SSLC) or 12th (Plus Two) depending on the specific diploma stream.",
      duration: "6 Months to 2 Years depending on course level",
      keyFeatures: [
        "Skill-focused practical knowledge for quick job entry",
        "Recognized diploma certifications for job placement in India and GCC"
      ]
    },

    skillCourses: {
      name: "Skill Development & Certificate Courses",
      category: "Skill Training & Certification",
      description:
        "Short-term job-oriented skill courses aimed at boosting employability in IT, digital marketing, accounting, language proficiency, and administration.",
      keyFeatures: [
        "Hands-on practical training",
        "Flexible timing suitable for working professionals and students"
      ]
    },

    apprenticeshipProgram: {
      name: "Apprenticeship Program",
      category: "Career & On-the-Job Training",
      description:
        "Practical workplace apprenticeship opportunities allowing learners to gain real hands-on industry experience alongside academic qualification.",
      keyFeatures: [
        "Direct industry exposure",
        "Certificate of completion for enhanced resume value"
      ]
    }
  },

  specialServices: {
    creditTransfer: {
      name: "Credit Transfer & One-Year Degree Restart (Break-in-Study Support)",
      summary:
        "Transfer previously passed subjects to a new university degree program without restarting from Year 1.",
      description:
        "If you discontinued your degree or failed in previous university exams, credit transfer allows you to carry forward your completed subjects/credits. You only need to appear for remaining subjects, saving time and money.",
      benefits: [
        "Saves time and money",
        "Avoids repeating passed subjects",
        "Enables fast-track graduation from recognized UGC-DEB universities"
      ]
    },

    certificateAttestation: {
      name: "Accredited Certificate Attestation Services",
      summary:
        "Complete attestation and verification processing for educational certificates.",
      description:
        "Assistance with authentication and attestation of educational certificates for higher studies abroad, GCC employment visas, and immigration procedures.",
      types: [
        "HRD (Human Resource Development) Attestation",
        "MEA (Ministry of External Affairs) Attestation",
        "Embassy Attestation (UAE, Saudi, Qatar, Oman, Kuwait, Bahrain, etc.)",
        "Apostille & WES Verification support"
      ]
    },

    studyMaterialsAndTma: {
      name: "Study Materials & Tutor Mark Assignment (TMA) Assistance",
      summary: "Comprehensive learning materials, previous year papers, and assignment guidance.",
      description:
        "TIMS Education provides printed books, digital notes, and step-by-step guidance for NIOS Tutor Mark Assignments (TMA) and university semester assignments."
    }
  },

  universityPartners: [
    "Swami Vivekanand Subharti University (SVSU)",
    "Aligarh Muslim University (AMU - CDOE)",
    "Suresh Gyan Vihar University (SGVU)",
    "Mizoram University Online",
    "Guru Kashi University (GKU)",
    "Andhra University",
    "Annamalai University",
    "Bharathiyar University",
    "NIOS (National Institute of Open Schooling)",
    "BOSSE (Board of Open Schooling & Skill Education)",
    "Jamia Urdu Aligarh"
  ],

  offices: {
    headOffice: {
      name: "TIMS Head Office (Tirur)",
      address: "2nd Floor, Pamls Tower, near Central Bank, Thazhepalam, Tirur, Kerala 676101",
      phone: "+91 9961967777",
      email: "info@timseducation.com"
    },
    edapalOffice: {
      name: "TIMS Edapal Office",
      address: "2nd Floor, Al Madeela Complex, Calicut Road, Edappal 679576, Malappuram DT, Kerala",
      phone: "+91 9526387777",
      email: "info@timseducation.com"
    }
  },

  faqs: [
    {
      question: "Are the degrees from TIMS Education recognized for Govt Jobs & PSC?",
      answer:
        "Yes, all university degree programs facilitated by TIMS Education are UGC-DEB approved. They are 100% valid for Kerala PSC, UPSC, Central Govt jobs, bank exams, and higher studies in India and abroad."
    },
    {
      question: "What is Credit Transfer and how does it help discontinued students?",
      answer:
        "Credit Transfer lets students who failed or discontinued their degree carry forward the marks/credits of subjects they already passed. You only study and write exams for the remaining subjects, enabling you to complete your degree faster."
    },
    {
      question: "Can working professionals in Gulf/GCC take exams online?",
      answer:
        "Yes! Many of our partner university programs (like AMU Online, SVSU, SGVU, Mizoram Online) offer 100% online proctored examinations that can be attempted from home anywhere in the world, including GCC countries."
    },
    {
      question: "How can I complete SSLC (10th) or Plus Two (12th) if I failed earlier?",
      answer:
        "You can enroll in NIOS or BOSSE open schooling through TIMS Education. You get credit transfer (TOC) for passed subjects, flexible exam options, and full assignment/study material support."
    },
    {
      question: "What certificate attestation services does TIMS Education offer?",
      answer:
        "TIMS handles HRD, MEA, Embassy attestations (UAE, Saudi, Qatar, Kuwait, Oman), Apostille, and WES verification support for education documents required for foreign employment or visa processing."
    },
    {
      question: "How can I contact TIMS Education for admission guidance?",
      answer:
        "You can call our Head Office in Tirur at +91 9961967777 or Edapal Office at +91 9526387777, email info@timseducation.com, or fill out the enquiry form on our website."
    }
  ],

  leadership: [
    { name: "Adv ShoukathAli Pootheri", role: "Founder & Director" },
    { name: "Nabeel CM", role: "Managing Director" },
    { name: "Mohamed Shameem", role: "CEO & Director" },
    { name: "Mr Jamsheer Backer", role: "Founder & Managing Director" },
    { name: "Dr. K. P. Abdullah", role: "Academic Director" }
  ]
};

export default siteKnowledgeBase;
