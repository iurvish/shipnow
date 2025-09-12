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
  { value: "react", label: "React", category: SkillCategory.FRONTEND, description: "JavaScript library for building user interfaces" },
  { value: "vue", label: "Vue.js", category: SkillCategory.FRONTEND, description: "Progressive JavaScript framework" },
  { value: "angular", label: "Angular", category: SkillCategory.FRONTEND, description: "TypeScript-based web application framework" },
  { value: "svelte", label: "Svelte", category: SkillCategory.FRONTEND, description: "Compile-time optimized component framework" },
  { value: "next", label: "Next.js", category: SkillCategory.FRONTEND, description: "React framework for production applications" },
  { value: "nuxt", label: "Nuxt.js", category: SkillCategory.FRONTEND, description: "Vue.js framework for server-side rendering" },
  { value: "typescript", label: "TypeScript", category: SkillCategory.FRONTEND, description: "Typed superset of JavaScript" },
  { value: "javascript", label: "JavaScript", category: SkillCategory.FRONTEND, description: "Dynamic programming language for web development" },
  { value: "html", label: "HTML", category: SkillCategory.FRONTEND, description: "Markup language for web pages" },
  { value: "css", label: "CSS", category: SkillCategory.FRONTEND, description: "Stylesheet language for web design" },
  { value: "tailwind", label: "Tailwind CSS", category: SkillCategory.FRONTEND, description: "Utility-first CSS framework" },
  { value: "bootstrap", label: "Bootstrap", category: SkillCategory.FRONTEND, description: "CSS framework for responsive design" },
  { value: "sass", label: "Sass/SCSS", category: SkillCategory.FRONTEND, description: "CSS preprocessor with features" },

  // Backend Technologies
  { value: "node", label: "Node.js", category: SkillCategory.BACKEND, description: "JavaScript runtime for server-side development" },
  { value: "express", label: "Express.js", category: SkillCategory.BACKEND, description: "Fast Node.js web application framework" },
  { value: "fastify", label: "Fastify", category: SkillCategory.BACKEND, description: "Fast and low overhead web framework" },
  { value: "python", label: "Python", category: SkillCategory.BACKEND, description: "High-level programming language" },
  { value: "django", label: "Django", category: SkillCategory.BACKEND, description: "Python web framework" },
  { value: "flask", label: "Flask", category: SkillCategory.BACKEND, description: "Lightweight Python web framework" },
  { value: "fastapi", label: "FastAPI", category: SkillCategory.BACKEND, description: "Modern Python API framework" },
  { value: "java", label: "Java", category: SkillCategory.BACKEND, description: "Object-oriented programming language" },
  { value: "spring", label: "Spring Boot", category: SkillCategory.BACKEND, description: "Java framework for enterprise applications" },
  { value: "csharp", label: "C#", category: SkillCategory.BACKEND, description: "Microsoft's object-oriented programming language" },
  { value: "dotnet", label: ".NET", category: SkillCategory.BACKEND, description: "Microsoft's development platform" },
  { value: "php", label: "PHP", category: SkillCategory.BACKEND, description: "Server-side scripting language" },
  { value: "laravel", label: "Laravel", category: SkillCategory.BACKEND, description: "PHP web application framework" },
  { value: "ruby", label: "Ruby", category: SkillCategory.BACKEND, description: "Dynamic programming language" },
  { value: "rails", label: "Ruby on Rails", category: SkillCategory.BACKEND, description: "Ruby web application framework" },
  { value: "go", label: "Go", category: SkillCategory.BACKEND, description: "Google's programming language" },
  { value: "rust", label: "Rust", category: SkillCategory.BACKEND, description: "Systems programming language" },

  // API & Data
  { value: "graphql", label: "GraphQL", category: SkillCategory.BACKEND, description: "Query language for APIs" },
  { value: "rest", label: "REST API", category: SkillCategory.BACKEND, description: "Representational State Transfer architecture" },
  { value: "grpc", label: "gRPC", category: SkillCategory.BACKEND, description: "High-performance RPC framework" },
  { value: "websockets", label: "WebSockets", category: SkillCategory.BACKEND, description: "Real-time communication protocol" },

  // Databases
  { value: "postgresql", label: "PostgreSQL", category: SkillCategory.DATABASE, description: "Advanced open-source relational database" },
  { value: "mysql", label: "MySQL", category: SkillCategory.DATABASE, description: "Popular open-source relational database" },
  { value: "mongodb", label: "MongoDB", category: SkillCategory.DATABASE, description: "NoSQL document database" },
  { value: "redis", label: "Redis", category: SkillCategory.DATABASE, description: "In-memory data structure store" },
  { value: "sqlite", label: "SQLite", category: SkillCategory.DATABASE, description: "Lightweight relational database" },
  { value: "neo4j", label: "Neo4j", category: SkillCategory.DATABASE, description: "Graph database management system" },
  { value: "prisma", label: "Prisma", category: SkillCategory.DATABASE, description: "Database toolkit and ORM" },
  { value: "drizzle", label: "Drizzle ORM", category: SkillCategory.DATABASE, description: "TypeScript ORM for SQL databases" },
  { value: "supabase", label: "Supabase", category: SkillCategory.DATABASE, description: "Open-source Firebase alternative" },
  { value: "firebase", label: "Firebase", category: SkillCategory.DATABASE, description: "Google's mobile and web application platform" },

  // Mobile Development
  { value: "react-native", label: "React Native", category: SkillCategory.MOBILE, description: "Cross-platform mobile development framework" },
  { value: "flutter", label: "Flutter", category: SkillCategory.MOBILE, description: "Google's UI toolkit for mobile apps" },
  { value: "ionic", label: "Ionic", category: SkillCategory.MOBILE, description: "Cross-platform mobile app framework" },
  { value: "swift", label: "Swift", category: SkillCategory.MOBILE, description: "Apple's programming language for iOS" },
  { value: "kotlin", label: "Kotlin", category: SkillCategory.MOBILE, description: "Modern programming language for Android" },

  // DevOps & Infrastructure
  { value: "docker", label: "Docker", category: SkillCategory.DEVOPS, description: "Containerization platform" },
  { value: "kubernetes", label: "Kubernetes", category: SkillCategory.DEVOPS, description: "Container orchestration system" },
  { value: "aws", label: "AWS", category: SkillCategory.DEVOPS, description: "Amazon Web Services cloud platform" },
  { value: "gcp", label: "Google Cloud", category: SkillCategory.DEVOPS, description: "Google Cloud Platform services" },
  { value: "azure", label: "Azure", category: SkillCategory.DEVOPS, description: "Microsoft's cloud platform" },
  { value: "vercel", label: "Vercel", category: SkillCategory.DEVOPS, description: "Frontend deployment platform" },
  { value: "netlify", label: "Netlify", category: SkillCategory.DEVOPS, description: "Web application deployment platform" },
  { value: "github-actions", label: "GitHub Actions", category: SkillCategory.DEVOPS, description: "CI/CD automation platform" },
  { value: "terraform", label: "Terraform", category: SkillCategory.DEVOPS, description: "Infrastructure as code tool" },

  // Design & UI/UX
  { value: "figma", label: "Figma", category: SkillCategory.DESIGN, description: "Design and prototyping tool" },
  { value: "sketch", label: "Sketch", category: SkillCategory.DESIGN, description: "Digital design toolkit" },
  { value: "adobe-xd", label: "Adobe XD", category: SkillCategory.DESIGN, description: "User experience design software" },

  // Testing
  { value: "jest", label: "Jest", category: SkillCategory.TESTING, description: "JavaScript testing framework" },
  { value: "cypress", label: "Cypress", category: SkillCategory.TESTING, description: "End-to-end testing framework" },
  { value: "playwright", label: "Playwright", category: SkillCategory.TESTING, description: "Cross-browser automation library" },
  { value: "vitest", label: "Vitest", category: SkillCategory.TESTING, description: "Fast unit testing framework" },

  // Other Tools
  { value: "git", label: "Git", category: SkillCategory.OTHER, description: "Version control system" },
  { value: "webpack", label: "Webpack", category: SkillCategory.OTHER, description: "Module bundler for JavaScript" },
  { value: "vite", label: "Vite", category: SkillCategory.OTHER, description: "Fast build tool for modern web apps" },
  { value: "eslint", label: "ESLint", category: SkillCategory.OTHER, description: "JavaScript linting utility" },
  { value: "prettier", label: "Prettier", category: SkillCategory.OTHER, description: "Code formatting tool" },
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
  "react",
  "typescript",
  "node",
  "next",
  "javascript",
  "python",
  "postgresql",
  "graphql",
  "tailwind",
  "git"
];

export const getFrontendSkills = () => getSkillsByCategory(SkillCategory.FRONTEND);
export const getBackendSkills = () => getSkillsByCategory(SkillCategory.BACKEND);
export const getDatabaseSkills = () => getSkillsByCategory(SkillCategory.DATABASE);
export const getMobileSkills = () => getSkillsByCategory(SkillCategory.MOBILE);
export const getDevOpsSkills = () => getSkillsByCategory(SkillCategory.DEVOPS);
export const getDesignSkills = () => getSkillsByCategory(SkillCategory.DESIGN);
export const getTestingSkills = () => getSkillsByCategory(SkillCategory.TESTING);
export const getOtherSkills = () => getSkillsByCategory(SkillCategory.OTHER);