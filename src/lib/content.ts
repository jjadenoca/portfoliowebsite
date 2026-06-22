// Single source of truth for site content.
// Edit values here to update the site.

export const profile = {
  name: "Jaden Oca",
  title: "Data Professional",
  location: "New York, NY",
  openTo: "Open to relocation",
  email: "jadenesoca@gmail.com",
  phone: "281-467-4955",
  linkedin: "https://www.linkedin.com/in/jadenoca",
  github: "https://github.com/jjadenoca",
  medium: "https://medium.com/@jadenesoca",
  mediumUsername: "jadenesoca",
  substack: "https://substack.com/@jadenoca",
  resumeUrl: "/JadenOcaSummer2026Resume.pdf",
  headshot: "/headshot.jpeg",
  bio: "2+ years of experience in data science and analytics at Fortune 100 companies. Currently building AI workflow infrastructure for a media startup. Built ML pipelines automating 95% of claims review, delivered analytics supporting 70% YoY revenue growth, and deployed AI tools adopted by 100-person departments. Skilled in Python, SQL, and Claude Code.",
  longBio:
    "2+ years of experience in data science and analytics at Fortune 100 companies. Currently building AI workflow infrastructure for a media startup. Built ML pipelines automating 95% of claims review, delivered analytics supporting 70% YoY revenue growth, and deployed AI tools adopted by 100-person departments. Skilled in Python, SQL, and Claude Code.",
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  blurb: string;
  bullets: string[];
  tech?: string[];
  // Local image path under /public, e.g. "/logos/capitalone.png"
  logo?: string;
};

export const experiences: Experience[] = [
  {
    company: "No Dice",
    role: "AI and Social Media Consultant",
    location: "New York, NY",
    start: "2026",
    end: "Present",
    blurb: "Media and wellness startup with 100K+ subscribers across platforms and 1K+ app users",
    bullets: [
      "Building automated content research pipeline using Claude Code and Grok API to surface trending X content and deliver briefs directly to founders via Notion MCP, reducing research time and increasing content output",
      "Scraping and analyzing top-performing LinkedIn posts to build proprietary dataset informing daily content strategy and engagement benchmarking",
      "Collaborating directly with founders to identify operational bottlenecks and architect AI workflow infrastructure across content, research, and distribution functions",
    ],
    tech: ["Claude Code", "Grok API", "Python", "Notion"],
    logo: "/logos/nodice.svg",
  },
  {
    company: "Capital One",
    role: "Associate Business Analyst",
    location: "Plano, TX",
    start: "August 2025",
    end: "2026",
    blurb: "Fortune 100 bank with $470B+ in assets across 100M+ customers",
    bullets: [
      "Built AI assistant in Gemini grounded in reporting metrics and internal terminology to accelerate onboarding, data synthesis, and policy lookup by 90% for 100-person department",
      "Informed forecasts and GTM decisions for auto dealer lead generation platform by tracking churn, ARR, loan NPV, and customer lifetime value across 20K dealers, contributing to 70% YoY revenue growth",
      "Built SQL reporting infrastructure from scratch to analyze transaction data across 20K dealerships and $1B+ in auto loan originations, ensuring reproducibility with Git",
      "Conducted competitive analyses across SaaS product portfolio, leveraging Gemini for Deep Research to benchmark pricing and offerings against four key competitors",
      "Partnered with Product Managers, data engineers, and sales teams to implement GTM policy changes, serving as liaison between technical and commercial stakeholders to drive adoption of new pricing and reporting initiatives",
    ],
    tech: ["SQL", "Python", "Snowflake", "Gemini", "Git"],
    logo: "/logos/c1.png",
  },
  {
    company: "Cotality",
    role: "Data Science Intern",
    location: "Irvine, CA",
    start: "June 2025",
    end: "August 2025",
    blurb:
      "Property intelligence leader with 5.5B U.S. property records serving 98 of top 100 mortgage lenders",
    bullets: [
      "Automated 95% of claims review process through building machine learning pipeline in Python and SQL with TF-IDF vectorization and Logistic Regression model",
      "Built scalable NLP feature engineering pipeline by designing ETL framework to clean and standardize 40K peril records into a single source of truth in Snowflake",
    ],
    tech: ["Python", "SQL", "scikit-learn", "Snowflake", "NLP"],
    logo: "/logos/cotality.png",
  },
  {
    company: "Truist Financial Corporation",
    role: "Data Science Intern",
    location: "Atlanta, GA",
    start: "June 2024",
    end: "August 2024",
    blurb:
      "Financial services corporation managing over $527B in assets with over 15M clients",
    bullets: [
      "Increased recovery for past-due payments by 11% through analyzing 23M transactions to identify trends between when alerts are sent and effectiveness in generating payments within three days",
      "Enhanced decision-making for a 50-member department by creating a Tableau dashboard analyzing 13 months of client behavior across 6M accounts, leading to improved assessment of payment trends",
    ],
    tech: ["SQL", "Tableau", "Python"],
    logo: "/logos/truist.png",
  },
  {
    company: "Link Logistics Real Estate",
    role: "Data Analyst Intern",
    location: "New York, NY",
    start: "May 2023",
    end: "March 2024",
    blurb: "Industrial real estate operator managing 535M square feet in assets",
    bullets: [
      "Forecasted leasing prices for 8K tenants in five major markets using Random Forest and XGBoost models, uncovering trends to inform pricing strategies, presenting findings to Chief Data Officer",
      "Improved model performance by 12% by incorporating geographic and demographic factors using Azure and GeoPandas",
      "Identified three underutilized investments with projected 8% ROI uplift through regression based financial modeling across 4K properties in 51 geographic markets",
    ],
    tech: ["Python", "Random Forest", "XGBoost", "Azure", "GeoPandas"],
    logo: "/logos/link.png",
  },
];

export type Project = {
  name: string;
  tagline: string;
  start: string;
  end: string;
  bullets: string[];
  tech: string[];
  href?: string;
  logo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "Spotify Streaming Insights",
    tagline: "Language processing and time series analysis project",
    start: "2024",
    end: "2025",
    bullets: [
      "Built a pipeline to transform Spotify stream and lyric data into NLP-ready features, fine-tuned GPT-2 for lyric generation, and visualized insights using BERT-based topic modeling",
      "Facilitated text analysis by scraping lyrics to user's top 790 tracks across top 10 English artists using Genius.com API",
      "Increased interpretability and reduced testing loss by 25% by feature engineering songs into 22K lyrical lines using PyTorch",
      "Detected patterns in listening behavior over six-year period of 400K streams using seasonal decomposition",
    ],
    tech: ["Python", "PyTorch", "GPT-2", "BERT", "Genius API"],
    href: "https://medium.com/@jadenesoca/analyzing-my-spotify-listening-data-dd1bd76b9c75",
    logo: "/logos/spotify.png",
    image: "/logos/projectspotify.webp",
  },
  {
    name: "League of Legends Player Data",
    tagline: "Video game player-base comparison",
    start: "December 2023",
    end: "January 2024",
    bullets: [
      "Demonstrated influence of player skill in overcoming quantifiable deficits based on data trained on 400K League of Legends matches",
      "Compared Logistic Regression & Random Forest to predict winners based on statistics at 15, 20, 25, and 30 minutes of game time and quantified model performance using log score, brier score, confusion matrices, and visualizing results using ROC Curve & AUC",
      "Optimized feature selection for model using LASSO, predicting outcome of 30-minute games with 81% accuracy",
    ],
    tech: ["Python", "Logistic Regression", "Random Forest", "LASSO"],
    href: "https://medium.com/@jadenesoca/league-of-legends-a-machine-learning-breakdown-across-different-skill-brackets-f6d0588f6a79",
    logo: "/logos/lol.jpg",
    image: "/logos/lolroc.webp",
  },
];

export type Activity = {
  title: string;
  org: string;
  start: string;
  end: string;
  bullets: string[];
  logo?: string;
  href?: string;
  image?: string;
};

export const activities: Activity[] = [
  {
    title: "President",
    org: "Texas A&M Chinese Student Association",
    start: "April 2024",
    end: "April 2025",
    bullets: [
      "Led team of 45 to plan & execute 12 annual social events for 500 members across 6 \"families\" to promote Chinese culture on campus",
      "Managed $35K budget, planning 9 fundraisers, reducing expenses by 8%, and presenting cost-breakdown analyses after each event",
      "Directed organizational strategy via bi-weekly executive and officer meetings, boosting productivity and shortening meetings by 34%",
      "Conducted monthly trainings to aid team in goal setting, conflict resolution, & communication, increasing feedback rating by 23%",
      "Designed 17-question personality test for leadership team, quantifying results to build six well-rounded teams of four officers",
      "Analyzed variance in personality test answers to simplify test to three most relevant questions, deploying to member base, and sorting each of 500 members into one of six groups based on quantifiable preferences",
    ],
    logo: "/logos/caslogo.png",
    image: "/logos/csanihowdy.jpg",
  },
  {
    title: "Vice President Internal",
    org: "Texas A&M Chinese Student Association",
    start: "April 2023",
    end: "April 2024",
    bullets: [
      "Optimized bi-weekly newsletter sent to 900 recipients for brevity, raising email interactions by 29% & member attendance by 12%",
      "Reinvented intern program, holding workshops & shadowing sessions for 15 members, converting 73% of interns into future officers",
      "Spoke on panel with 5 other student leaders to audience of 200, educating Asian-American students on leadership values & growth",
      "Facilitated communication by holding 1-on-1 meetings with each of 45 team members geared towards giving & receiving feedback",
    ],
    logo: "/logos/caslogo.png",
    image: "/logos/2024csa.JPG",
  },
  {
    title: "Research Assistant",
    org: "Recovery From Stress Lab",
    start: "August 2024",
    end: "May 2025",
    bullets: [
      "Identified actionable trends between burnout, workload, and demographic variables across 500 employees, contributing findings to academic papers using linear regression models and correlation matrices in RStudio",
      "Reduced analysis time by 50% through developing reusable R script to summarize trends between 12 different response variables, standardizing analysis pipeline for team of 5",
    ],
    logo: "/logos/tamu.jpeg",
    href: "https://sites.google.com/view/ze-mia-zhus-research-lab/home?authuser=0",
    image: "/logos/REST Lab.png",
  },
  {
    title: "Statistics Teaching Assistant",
    org: "Texas A&M University",
    start: "January 2023",
    end: "May 2025",
    bullets: [
      "Tutored students tri-weekly for total of 20 hours a week over concepts in introductory statistics, proctoring exams every four weeks",
      "Prepared weekly recitation lecture over concepts from previous week with focus on in depth explanations tailored to student needs",
      "Coordinated with 3 other TAs to collect student feedback throughout semester to suggest lesson plan and exam changes to professors",
    ],
    logo: "/logos/tamu.jpeg",
    image: "/logos/Stats.jpg",
  },
];

export const education = {
  school: "Texas A&M University",
  location: "College Station, TX",
  degree: "Bachelor of Science in Statistics",
  minors: "Minors in Business and Psychology",
  graduation: "May 2025",
  logo: "/logos/tamu.jpeg",
  activities: [
    {
      org: "BCS Theatre Company",
      role: "Pit Orchestra Violist",
      start: "November 2022",
      end: "March 2023",
    },
    {
      org: "Aggie Data Science Club",
      role: "Member",
      start: "August 2021",
      end: "August 2022",
    },
  ],
};

export const awards: string[] = [
  "President's Endowed Scholar",
  "National Merit Finalist",
  "TMEA All-State Violist",
  "National AP Scholar",
];

export const skills = {
  ai: ["Claude Code", "Gemini", "ChatGPT", "Grok API"],
  languages: ["Python", "SQL", "R"],
  python: ["Pandas", "NumPy", "scikit-learn"],
  data: ["Snowflake", "Power BI", "Tableau", "Quicksight", "Excel", "Azure"],
  tools: ["Git"],
};

// ===================================================================
// Creator / UGC identity — used by the redesigned public-facing site
// ===================================================================

export type Social = {
  platform: string;
  url: string;
};

export type UgcAccount = {
  name: string;
  handle: string;
  url: string;
  blurb: string;
};

export type Brand = {
  name: string;
  logo: string;
};

export type Creator = {
  name: string;
  handle: string;
  tagline: string;
  followers: string;
  platformCount: number;
  brandCount: number;
  contactEmail: string;
  bio: string;
  socials: Social[];
  ugcAccounts: UgcAccount[];
  brands: Brand[];
};

export const creator: Creator = {
  name: "Jaden Oca",
  handle: "@jadeneoca",
  tagline: "I make content about AI, decision making, and the hidden forces that shape how people think.",
  followers: "6k+",
  platformCount: 4,
  brandCount: 5,
  contactEmail: "financefleapcontact@gmail.com",
  bio: "Stats grad. Spent a year in corporate data. Now betting on myself, creating content on statistics, psychology, mindset, and AI, with a slice of personal finance thrown in.",
  socials: [
    { platform: "Instagram", url: "https://www.instagram.com/jadeneoca/" },
    { platform: "TikTok",    url: "https://www.tiktok.com/@jadeneoca" },
    { platform: "YouTube",   url: "https://www.youtube.com/@fleapster" },
    { platform: "LinkedIn",  url: "https://www.linkedin.com/in/jadenoca2025/" },
  ],
  ugcAccounts: [
    {
      name:   "investfleap",
      handle: "@investfleap",
      url:    "https://www.instagram.com/investfleap/reels/",
      blurb:  "Mindset, money psychology & personal finance Reels through a data-driven lens.",
    },
    {
      name:   "createwithfleap",
      handle: "@createwithfleap",
      url:    "https://www.instagram.com/createwithfleap/reels/",
      blurb:  "Lifestyle, behind-the-scenes & creative UGC reels.",
    },
  ],
  brands: [
    { name: "Monarch Money",  logo: "/logos/brands/monarch.svg"    },
    { name: "Blossom Social", logo: "/logos/brands/blossom.svg"    },
    { name: "Higgsfield AI",  logo: "/logos/brands/higgsfield.svg" },
    { name: "Polymarket",     logo: "/logos/brands/polymarket.svg" },
    { name: "Finvest",        logo: "/logos/brands/finvest.svg"    },
  ],
};
