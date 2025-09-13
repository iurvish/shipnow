// Centralized skills configuration for ShipNow
// This file contains all available technical skills that can be used in:
// - Frontend forms (onboarding, project creation)
// - Backend validation and AuraDB synchronization
// - Search and filtering functionality

export interface Skill {
  value: string;
  label: string;
  category: SkillCategory;
  description?: string;
}

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  DESIGN = 'design',
  TESTING = 'testing',
  OTHER = 'other'
}

export const SKILLS: Skill[] = [
  // Frontend Technologies
  { value: "React", label: "React", category: SkillCategory.FRONTEND, description: "JavaScript library for building user interfaces" },
  { value: "Vue.js", label: "Vue.js", category: SkillCategory.FRONTEND, description: "Progressive JavaScript framework" },
  { value: "Angular", label: "Angular", category: SkillCategory.FRONTEND, description: "TypeScript-based web application framework" },
  { value: "Svelte", label: "Svelte", category: SkillCategory.FRONTEND, description: "Compile-time optimized component framework" },
  { value: "Next.js", label: "Next.js", category: SkillCategory.FRONTEND, description: "React framework for production applications" },
  { value: "Nuxt.js", label: "Nuxt.js", category: SkillCategory.FRONTEND, description: "Vue.js framework for server-side rendering" },
  { value: "TypeScript", label: "TypeScript", category: SkillCategory.FRONTEND, description: "Typed superset of JavaScript" },
  { value: "JavaScript", label: "JavaScript", category: SkillCategory.FRONTEND, description: "Dynamic programming language for web development" },
  { value: "HTML", label: "HTML", category: SkillCategory.FRONTEND, description: "Markup language for web pages" },
  { value: "CSS", label: "CSS", category: SkillCategory.FRONTEND, description: "Stylesheet language for web design" },
  { value: "Tailwind CSS", label: "Tailwind CSS", category: SkillCategory.FRONTEND, description: "Utility-first CSS framework" },
  { value: "Bootstrap", label: "Bootstrap", category: SkillCategory.FRONTEND, description: "CSS framework for responsive design" },
  { value: "Sass", label: "Sass/SCSS", category: SkillCategory.FRONTEND, description: "CSS preprocessor with features" },

  // Backend Technologies
  { value: "Node.js", label: "Node.js", category: SkillCategory.BACKEND, description: "JavaScript runtime for server-side development" },
  { value: "Express.js", label: "Express.js", category: SkillCategory.BACKEND, description: "Fast Node.js web application framework" },
  { value: "Fastify", label: "Fastify", category: SkillCategory.BACKEND, description: "Fast and low overhead web framework" },
  { value: "Python", label: "Python", category: SkillCategory.BACKEND, description: "High-level programming language" },
  { value: "Django", label: "Django", category: SkillCategory.BACKEND, description: "Python web framework" },
  { value: "Flask", label: "Flask", category: SkillCategory.BACKEND, description: "Lightweight Python web framework" },
  { value: "FastAPI", label: "FastAPI", category: SkillCategory.BACKEND, description: "Modern Python API framework" },
  { value: "Java", label: "Java", category: SkillCategory.BACKEND, description: "Object-oriented programming language" },
  { value: "Spring Boot", label: "Spring Boot", category: SkillCategory.BACKEND, description: "Java framework for enterprise applications" },
  { value: "C#", label: "C#", category: SkillCategory.BACKEND, description: "Microsoft's object-oriented programming language" },
  { value: ".NET", label: ".NET", category: SkillCategory.BACKEND, description: "Microsoft's development platform" },
  { value: "PHP", label: "PHP", category: SkillCategory.BACKEND, description: "Server-side scripting language" },
  { value: "Laravel", label: "Laravel", category: SkillCategory.BACKEND, description: "PHP web application framework" },
  { value: "Ruby", label: "Ruby", category: SkillCategory.BACKEND, description: "Dynamic programming language" },
  { value: "Ruby on Rails", label: "Ruby on Rails", category: SkillCategory.BACKEND, description: "Ruby web application framework" },
  { value: "Go", label: "Go", category: SkillCategory.BACKEND, description: "Google's programming language" },
  { value: "Rust", label: "Rust", category: SkillCategory.BACKEND, description: "Systems programming language" },

  // API & Data
  { value: "GraphQL", label: "GraphQL", category: SkillCategory.BACKEND, description: "Query language for APIs" },
  { value: "REST API", label: "REST API", category: SkillCategory.BACKEND, description: "Representational State Transfer architecture" },
  { value: "gRPC", label: "gRPC", category: SkillCategory.BACKEND, description: "High-performance RPC framework" },
  { value: "WebSockets", label: "WebSockets", category: SkillCategory.BACKEND, description: "Real-time communication protocol" },

  // Databases
  { value: "PostgreSQL", label: "PostgreSQL", category: SkillCategory.DATABASE, description: "Advanced open-source relational database" },
  { value: "MySQL", label: "MySQL", category: SkillCategory.DATABASE, description: "Popular open-source relational database" },
  { value: "MongoDB", label: "MongoDB", category: SkillCategory.DATABASE, description: "NoSQL document database" },
  { value: "Redis", label: "Redis", category: SkillCategory.DATABASE, description: "In-memory data structure store" },
  { value: "SQLite", label: "SQLite", category: SkillCategory.DATABASE, description: "Lightweight relational database" },
  { value: "Neo4j", label: "Neo4j", category: SkillCategory.DATABASE, description: "Graph database management system" },
  { value: "Prisma", label: "Prisma", category: SkillCategory.DATABASE, description: "Database toolkit and ORM" },
  { value: "Drizzle ORM", label: "Drizzle ORM", category: SkillCategory.DATABASE, description: "TypeScript ORM for SQL databases" },
  { value: "Supabase", label: "Supabase", category: SkillCategory.DATABASE, description: "Open-source Firebase alternative" },
  { value: "Firebase", label: "Firebase", category: SkillCategory.DATABASE, description: "Google's mobile and web application platform" },

  // Mobile Development
  { value: "React Native", label: "React Native", category: SkillCategory.MOBILE, description: "Cross-platform mobile development framework" },
  { value: "Flutter", label: "Flutter", category: SkillCategory.MOBILE, description: "Google's UI toolkit for mobile apps" },
  { value: "Ionic", label: "Ionic", category: SkillCategory.MOBILE, description: "Cross-platform mobile app framework" },
  { value: "Swift", label: "Swift", category: SkillCategory.MOBILE, description: "Apple's programming language for iOS" },
  { value: "Kotlin", label: "Kotlin", category: SkillCategory.MOBILE, description: "Modern programming language for Android" },

  // DevOps & Infrastructure
  { value: "Docker", label: "Docker", category: SkillCategory.DEVOPS, description: "Containerization platform" },
  { value: "Kubernetes", label: "Kubernetes", category: SkillCategory.DEVOPS, description: "Container orchestration system" },
  { value: "AWS", label: "AWS", category: SkillCategory.DEVOPS, description: "Amazon Web Services cloud platform" },
  { value: "Google Cloud", label: "Google Cloud", category: SkillCategory.DEVOPS, description: "Google Cloud Platform services" },
  { value: "Azure", label: "Azure", category: SkillCategory.DEVOPS, description: "Microsoft's cloud platform" },
  { value: "Vercel", label: "Vercel", category: SkillCategory.DEVOPS, description: "Frontend deployment platform" },
  { value: "Netlify", label: "Netlify", category: SkillCategory.DEVOPS, description: "Web application deployment platform" },
  { value: "GitHub Actions", label: "GitHub Actions", category: SkillCategory.DEVOPS, description: "CI/CD automation platform" },
  { value: "Terraform", label: "Terraform", category: SkillCategory.DEVOPS, description: "Infrastructure as code tool" },

  // Design & UI/UX
  { value: "Figma", label: "Figma", category: SkillCategory.DESIGN, description: "Design and prototyping tool" },
  { value: "Sketch", label: "Sketch", category: SkillCategory.DESIGN, description: "Digital design toolkit" },
  { value: "Adobe XD", label: "Adobe XD", category: SkillCategory.DESIGN, description: "User experience design software" },

  // Testing
  { value: "Jest", label: "Jest", category: SkillCategory.TESTING, description: "JavaScript testing framework" },
  { value: "Cypress", label: "Cypress", category: SkillCategory.TESTING, description: "End-to-end testing framework" },
  { value: "Playwright", label: "Playwright", category: SkillCategory.TESTING, description: "Cross-browser automation library" },
  { value: "Vitest", label: "Vitest", category: SkillCategory.TESTING, description: "Fast unit testing framework" },

  // Other Tools
  { value: "Git", label: "Git", category: SkillCategory.OTHER, description: "Version control system" },
  { value: "Webpack", label: "Webpack", category: SkillCategory.OTHER, description: "Module bundler for JavaScript" },
  { value: "Vite", label: "Vite", category: SkillCategory.OTHER, description: "Fast build tool for modern web apps" },
  { value: "ESLint", label: "ESLint", category: SkillCategory.OTHER, description: "JavaScript linting utility" },
  { value: "Prettier", label: "Prettier", category: SkillCategory.OTHER, description: "Code formatting tool" },
];

// Helper functions for working with skills
export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return SKILLS.filter(skill => skill.category === category);
};

export const getSkillByValue = (value: string): Skill | undefined => {
  return SKILLS.find(skill => skill.value === value);
};

export const getSkillsForFormOptions = () => {
  return SKILLS.map(skill => ({
    value: skill.value,
    label: skill.label
  }));
};

export const getSkillCategories = (): SkillCategory[] => {
  return Object.values(SkillCategory);
};

export const validateSkills = (skills: string[]): boolean => {
  const validSkillValues = SKILLS.map(skill => skill.value);
  return skills.every(skill => validSkillValues.includes(skill));
};

// Popular skills for quick selection
export const POPULAR_SKILLS = [
  "React",
  "TypeScript", 
  "Node.js",
  "Next.js",
  "JavaScript",
  "Python",
  "PostgreSQL",
  "GraphQL",
  "Tailwind CSS",
  "Git"
];

export const getFrontendSkills = () => getSkillsByCategory(SkillCategory.FRONTEND);
export const getBackendSkills = () => getSkillsByCategory(SkillCategory.BACKEND);
export const getDatabaseSkills = () => getSkillsByCategory(SkillCategory.DATABASE);
export const getMobileSkills = () => getSkillsByCategory(SkillCategory.MOBILE);
export const getDevOpsSkills = () => getSkillsByCategory(SkillCategory.DEVOPS);
export const getDesignSkills = () => getSkillsByCategory(SkillCategory.DESIGN);
export const getTestingSkills = () => getSkillsByCategory(SkillCategory.TESTING);
export const getOtherSkills = () => getSkillsByCategory(SkillCategory.OTHER);