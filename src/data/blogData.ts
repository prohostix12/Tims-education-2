export type BlogSectionItem = {
  heading: string;
  body: string[];
  quote?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  subtitle?: string;
  day: string;
  month: string;
  year: string;
  dateString: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  comments: number;
  readTime: string;
  category: string;
  image: string;
  excerpt: string;
  content: {
    intro: string;
    keyTakeaways?: string[];
    sections: BlogSectionItem[];
    conclusion: string;
  };
  tags: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "svsu-december-2025-results",
    title: "SVSU December 2025 Session Exam Results Published",
    subtitle: "Swami Vivekanand Subharti University has officially announced the exam results for the December 2025 session.",
    day: "13",
    month: "Mar",
    year: "2026",
    dateString: "March 13, 2026",
    author: "TIMS Academic Desk",
    authorRole: "Senior Academic Coordinator",
    comments: 0,
    readTime: "4 min read",
    category: "University Updates",
    image: "/images/blog/svsu-results.jpg",
    excerpt:
      "Swami Vivekanand Subharti University (SVSU) has released the long-awaited results for the December 2025 examination session. Here is how candidates can check their marksheets and request revaluation.",
    content: {
      intro:
        "Swami Vivekanand Subharti University (SVSU) has officially declared the result of the December 2025 semester and annual examinations for all undergraduate and postgraduate distance learning programs. Students enrolled through TIMS Education can now seamlessly access their online scorecards and verified digital marksheets.",
      keyTakeaways: [
        "Results for UG & PG distance education streams are live on the official portal.",
        "Students can verify marksheets using their Enrollment Number and Date of Birth.",
        "Revaluation and mark verification window is open until March 28, 2026.",
        "TIMS student support desk is available to assist with marksheet verification and grade card queries."
      ],
      sections: [
        {
          heading: "How to Access Your SVSU Examination Results",
          body: [
            "Students can check their semester performance by visiting the SVSU student portal or by contacting the TIMS Education academic team.",
            "Make sure you have your Roll Number, Permanent Enrollment Number (PEN), and registered date of birth handy before accessing the login portal. If you encounter any login credentials issues, our support coordinators will verify your records instantly."
          ],
          quote: "Timely result verification ensures smooth progression to subsequent semesters without academic delay."
        },
        {
          heading: "Revaluation & Recounting Process",
          body: [
            "If a student notices discrepancies in their awarded marks or wishes to request a detailed revaluation of answer scripts, an official online application must be submitted within 15 days of the result publication.",
            "Our academic advisors at TIMS Education provide full guidance on submitting revaluation applications and tracking status updates until final revised scorecards are issued by the university."
          ]
        }
      ],
      conclusion:
        "Congratulations to all students who cleared their exams in this session! For further assistance regarding marksheets, degree certificates, or next semester registration, get in touch with TIMS Education today."
    },
    tags: ["SVSU", "Exam Results", "Distance Education", "University News", "TIMS Updates"]
  },
  {
    slug: "best-distance-education-kerala",
    title: "Best Distance Education Institution in Kerala",
    subtitle: "Discover why TIMS Education stands out as the premier choice for distance degree & online programs in Kerala.",
    day: "08",
    month: "Jan",
    year: "2026",
    dateString: "January 8, 2026",
    author: "TIMS Counseling Team",
    authorRole: "Career Guidance Expert",
    comments: 0,
    readTime: "5 min read",
    category: "Career Guidance",
    image: "/images/blog/best-distance-education-kerala.jpg",
    excerpt:
      "Kerala is known for high literacy rates and educational excellence. Explore how distance learning institutions like TIMS Education bridge the gap with UGC-DEB approved university degree programs.",
    content: {
      intro:
        "Kerala has long been a pioneer in literacy and quality education. With working professionals, homemakers, and students looking for flexible higher education avenues, choosing the best distance education institution is vital for a valid and successful career pathway.",
      keyTakeaways: [
        "Only select institutions offering UGC-DEB approved university affiliations.",
        "Flexible examination centers and comprehensive digital study materials.",
        "100% genuine admission assistance and complete academic support till graduation.",
        "Recognized degrees for Government jobs, UPSC, KPSC, and higher studies abroad."
      ],
      sections: [
        {
          heading: "Key Factors When Choosing Distance Education in Kerala",
          body: [
            "When selecting an educational center in Kerala for distance learning, validation of UGC-DEB approvals is mandatory. A degree obtained from an unapproved institution will not be valid for public sector recruitment or higher education.",
            "At TIMS Education, all affiliated university programs strictly align with National Education Policy (NEP) guidelines and possess recognized UGC-DEB approvals."
          ],
          quote: "Quality distance education empowers learners to upgrade qualifications without compromising career commitments."
        },
        {
          heading: "Why Students Prefer TIMS Education",
          body: [
            "TIMS Education provides end-to-end guidance from selecting the right course stream (BA, BCom, BBA, MA, MCom, MBA) to examination preparation, assignment submissions, and certificate delivery.",
            "With thousands of successful alumni across Kerala and the GCC region, TIMS has earned trust as a leading educational counseling center."
          ]
        }
      ],
      conclusion:
        "Take your career to the next level with accredited distance degrees. Contact TIMS Education counselors today to find the right degree program tailored to your career aspirations."
    },
    tags: ["Distance Learning", "Kerala Education", "Degree Programs", "UGC Approved", "Career Guidance"]
  },
  {
    slug: "online-degree-vs-distance-degree",
    title: "Online Degree vs Distance Degree: Which One Is Better?",
    subtitle: "A detailed comparison guide to help you choose between Online Mode and Distance Mode degree education.",
    day: "08",
    month: "Jan",
    year: "2026",
    dateString: "January 8, 2026",
    author: "TIMS Academic Desk",
    authorRole: "Education Strategy Lead",
    comments: 0,
    readTime: "6 min read",
    category: "Education Trends",
    image: "/images/blog/online-vs-distance-degree.jpg",
    excerpt:
      "Choosing between an online degree and a distance degree can be confusing. Discover the key differences in exams, delivery modes, flexibility, and global recognition.",
    content: {
      intro:
        "As flexible learning modes gain widespread popularity across India and internationally, students often wonder about the exact distinction between Online Degrees and Distance Degrees. While both cater to non-traditional learners, key differences exist in learning delivery, assessment mechanisms, and campus requirements.",
      keyTakeaways: [
        "Distance Education relies on printed study material, regional learning centers, and offline/pen-paper exams.",
        "Online Education offers 100% digital LMS lectures, interactive live sessions, and online proctored exams.",
        "Both modes hold equal academic validity when conferred by UGC-DEB recognized universities.",
        "Choose based on internet accessibility, schedule flexibility, and personal learning preferences."
      ],
      sections: [
        {
          heading: "Understanding Distance Education",
          body: [
            "Distance Education (ODL - Open and Distance Learning) is designed for students who prefer study modules, physical books, and periodic contact classes at approved study centers.",
            "Examinations in distance mode are typically conducted at designated university exam centers in a traditional written format."
          ]
        },
        {
          heading: "Understanding Online Education (OL)",
          body: [
            "Online Degrees are delivered entirely through a Learning Management System (LMS). Coursework, quizzes, video lectures, and faculty discussions happen digitally.",
            "Examinations are conducted online via AI-proctored platforms, enabling working professionals worldwide (such as GCC residents) to attempt exams from home."
          ],
          quote: "According to UGC regulations, Online and Distance degrees are equivalent in value to regular campus degrees for employment and higher education."
        }
      ],
      conclusion:
        "Whether you opt for Distance or Online mode, TIMS Education assists you in securing admission in top accredited universities. Reach out to our advisors for personal guidance."
    },
    tags: ["Online Degree", "Distance Degree", "Higher Education", "UGC Guidelines", "TIMS Education"]
  }
];

export function parseBlogDate(input?: string | Date) {
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let d: Date | null = null;

  if (input) {
    if (input instanceof Date) {
      d = input;
    } else if (typeof input === "string" && input.trim()) {
      const trimmed = input.trim();
      const nativeDate = new Date(trimmed);
      if (!isNaN(nativeDate.getTime())) {
        d = nativeDate;
      } else {
        const matchDMY = trimmed.match(/^(\d{1,2})[\s\-\/]+([a-zA-Z]+)[\s\-\/]+(\d{4})$/);
        const matchMDY = trimmed.match(/^([a-zA-Z]+)[\s\-\/]+(\d{1,2})[,\s\-\/]+(\d{4})$/);

        if (matchDMY) {
          const dayNum = parseInt(matchDMY[1], 10);
          const monthStr = matchDMY[2].toLowerCase();
          const yearNum = parseInt(matchDMY[3], 10);
          const monthIndex = monthsShort.findIndex((m) => m.toLowerCase() === monthStr.slice(0, 3));
          if (monthIndex !== -1) {
            d = new Date(yearNum, monthIndex, dayNum);
          }
        } else if (matchMDY) {
          const monthStr = matchMDY[1].toLowerCase();
          const dayNum = parseInt(matchMDY[2], 10);
          const yearNum = parseInt(matchMDY[3], 10);
          const monthIndex = monthsShort.findIndex((m) => m.toLowerCase() === monthStr.slice(0, 3));
          if (monthIndex !== -1) {
            d = new Date(yearNum, monthIndex, dayNum);
          }
        }
      }
    }
  }

  if (!d || isNaN(d.getTime())) {
    d = new Date();
  }

  const day = String(d.getDate()).padStart(2, "0");
  const monthIndex = d.getMonth();
  const month = monthsShort[monthIndex];
  const year = String(d.getFullYear());
  const dateString = `${monthsFull[monthIndex]} ${d.getDate()}, ${year}`;
  const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day}`;

  return { day, month, year, dateString, isoDate };
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.slug !== currentSlug).slice(0, limit);
}



