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
  // Software & IT
  FRONTEND = 'Frontend Development',
  BACKEND = 'Backend Development',
  DATABASE = 'Databases & Data Management',
  MOBILE = 'Mobile Development',
  DEVOPS = 'DevOps & Cloud Infrastructure',
  TESTING = 'Software Testing',
  
  // AI & Data Science
  AI_ML = 'AI & Machine Learning',
  
  // Core Engineering Disciplines
  MECHANICAL_ENG = 'Mechanical Engineering',
  CIVIL_ENG = 'Civil Engineering',
  ELECTRICAL_ENG = 'Electrical & Electronics Engineering', // Combines EE and EC
  
  // Business & Management
  PROJECT_MANAGEMENT = 'Project & Product Management',
  BUSINESS_HR = 'Business & Human Resources',
  
  // General & Soft Skills
  DESIGN_UX = 'Design & UX/UI',
  COMMUNICATION = 'Communication & Public Speaking',
  OTHER_TOOLS = 'General Tools & Technologies'
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

  // AI & Machine Learning
  { value: "TensorFlow", label: "TensorFlow", category: SkillCategory.AI_ML, description: "Open-source machine learning framework by Google" },
  { value: "PyTorch", label: "PyTorch", category: SkillCategory.AI_ML, description: "Open-source machine learning framework by Facebook" },
  { value: "Scikit-learn", label: "Scikit-learn", category: SkillCategory.AI_ML, description: "Machine learning library for Python" },
  { value: "Keras", label: "Keras", category: SkillCategory.AI_ML, description: "High-level neural networks API" },
  { value: "Pandas", label: "Pandas", category: SkillCategory.AI_ML, description: "Data manipulation and analysis library for Python" },
  { value: "NumPy", label: "NumPy", category: SkillCategory.AI_ML, description: "Fundamental package for numerical computing with Python" },
  { value: "Natural Language Processing (NLP)", label: "NLP", category: SkillCategory.AI_ML, description: "Processing of human language by computers" },
  { value: "Computer Vision", label: "Computer Vision", category: SkillCategory.AI_ML, description: "Enabling computers to 'see' and interpret images" },
  { value: "Deep Learning", label: "Deep Learning", category: SkillCategory.AI_ML, description: "Subset of machine learning based on neural networks" },
  { value: "Reinforcement Learning", label: "Reinforcement Learning", category: SkillCategory.AI_ML, description: "Machine learning method for decision-making" },
  { value: "R (Programming Language)", label: "R", category: SkillCategory.AI_ML, description: "Language and environment for statistical computing" },

  // Mechanical Engineering
  { value: "AutoCAD", label: "AutoCAD", category: SkillCategory.MECHANICAL_ENG, description: "Commercial computer-aided design (CAD) software" },
  { value: "SolidWorks", label: "SolidWorks", category: SkillCategory.MECHANICAL_ENG, description: "Solid modeling computer-aided design (CAD) and computer-aided engineering (CAE) software" },
  { value: "CATIA", label: "CATIA", category: SkillCategory.MECHANICAL_ENG, description: "Multi-platform CAD/CAM/CAE software suite" },
  { value: "ANSYS", label: "ANSYS", category: SkillCategory.MECHANICAL_ENG, description: "Engineering simulation software for product design and testing" },
  { value: "MATLAB", label: "MATLAB", category: SkillCategory.MECHANICAL_ENG, description: "Numerical computing environment and programming language" },
  { value: "Thermodynamics", label: "Thermodynamics", category: SkillCategory.MECHANICAL_ENG, description: "Study of heat and its relation to other forms of energy" },
  { value: "Fluid Mechanics", label: "Fluid Mechanics", category: SkillCategory.MECHANICAL_ENG, description: "Study of fluids and the forces on them" },
  { value: "Finite Element Analysis (FEA)", label: "FEA", category: SkillCategory.MECHANICAL_ENG, description: "Numerical method for solving problems of engineering and mathematical physics" },
  { value: "Manufacturing Processes", label: "Manufacturing Processes", category: SkillCategory.MECHANICAL_ENG, description: "Techniques for creating components and products" },
  { value: "Robotics", label: "Robotics", category: SkillCategory.MECHANICAL_ENG, description: "Design, construction, operation, and use of robots" },

  // Civil Engineering
  { value: "AutoCAD Civil 3D", label: "AutoCAD Civil 3D", category: SkillCategory.CIVIL_ENG, description: "Building information modeling (BIM) software for civil engineering" },
  { value: "Structural Analysis", label: "Structural Analysis", category: SkillCategory.CIVIL_ENG, description: "Determination of the effects of loads on physical structures and their components" },
  { value: "Geotechnical Engineering", label: "Geotechnical Engineering", category: SkillCategory.CIVIL_ENG, description: "Branch of civil engineering concerned with the engineering behavior of earth materials" },
  { value: "STAAD Pro", label: "STAAD Pro", category: SkillCategory.CIVIL_ENG, description: "3D structural analysis and design software" },
  { value: "ETABS", label: "ETABS", category: SkillCategory.CIVIL_ENG, description: "Integrated software package for structural analysis and design" },
  { value: "ArcGIS", label: "ArcGIS", category: SkillCategory.CIVIL_ENG, description: "Geographic Information System (GIS) software" },
  { value: "Hydrology", label: "Hydrology", category: SkillCategory.CIVIL_ENG, description: "Study of the movement, distribution, and management of water" },
  { value: "Construction Management", label: "Construction Management", category: SkillCategory.CIVIL_ENG, description: "Overseeing the planning, design, and construction of a project" },
  { value: "BIM (Building Information Modeling)", label: "BIM", category: SkillCategory.CIVIL_ENG, description: "Process for creating and managing information on a construction project" },

  // Electrical & Electronics Engineering
  { value: "Circuit Design", label: "Circuit Design", category: SkillCategory.ELECTRICAL_ENG, description: "Designing electronic circuits" },
  { value: "VHDL", label: "VHDL", category: SkillCategory.ELECTRICAL_ENG, description: "Hardware description language for electronic design automation" },
  { value: "Verilog", label: "Verilog", category: SkillCategory.ELECTRICAL_ENG, description: "Hardware description language for digital circuits" },
  { value: "MATLAB/Simulink", label: "MATLAB/Simulink", category: SkillCategory.ELECTRICAL_ENG, description: "Platform for modeling, simulating, and analyzing dynamic systems" },
  { value: "PLC Programming", label: "PLC Programming", category: SkillCategory.ELECTRICAL_ENG, description: "Programming Programmable Logic Controllers for automation" },
  { value: "Embedded Systems", label: "Embedded Systems", category: SkillCategory.ELECTRICAL_ENG, description: "Computer systems with a dedicated function within a larger mechanical or electrical system" },
  { value: "Digital Signal Processing (DSP)", label: "DSP", category: SkillCategory.ELECTRICAL_ENG, description: "Analyzing and manipulating discrete-time signals" },
  { value: "Power Electronics", label: "Power Electronics", category: SkillCategory.ELECTRICAL_ENG, description: "Application of solid-state electronics for the control and conversion of electric power" },
  { value: "Control Systems", label: "Control Systems", category: SkillCategory.ELECTRICAL_ENG, description: "Devices that manage, command, direct, or regulate the behavior of other devices or systems" },

  // Project & Product Management
  { value: "Agile Methodologies", label: "Agile Methodologies", category: SkillCategory.PROJECT_MANAGEMENT, description: "Iterative development approach emphasizing collaboration and flexibility" },
  { value: "Scrum", label: "Scrum", category: SkillCategory.PROJECT_MANAGEMENT, description: "Framework for agile project management" },
  { value: "Risk Management", label: "Risk Management", category: SkillCategory.PROJECT_MANAGEMENT, description: "Identifying, assessing, and controlling threats to an organization's capital and earnings" },
  { value: "Budgeting", label: "Budgeting", category: SkillCategory.PROJECT_MANAGEMENT, description: "Planning financial resources for a project" },
  { value: "Jira", label: "Jira", category: SkillCategory.PROJECT_MANAGEMENT, description: "Issue tracking and project management software" },
  { value: "Confluence", label: "Confluence", category: SkillCategory.PROJECT_MANAGEMENT, description: "Team collaboration software" },
  { value: "Roadmapping", label: "Roadmapping", category: SkillCategory.PROJECT_MANAGEMENT, description: "Strategic planning for product development" },
  { value: "Stakeholder Management", label: "Stakeholder Management", category: SkillCategory.PROJECT_MANAGEMENT, description: "Managing relationships with parties involved in a project" },
  { value: "Leadership", label: "Leadership", category: SkillCategory.PROJECT_MANAGEMENT, description: "Ability to lead a team or project" },

  // Business & Human Resources
  { value: "Recruitment", label: "Recruitment", category: SkillCategory.BUSINESS_HR, description: "Process of finding and attracting qualified candidates" },
  { value: "Employee Relations", label: "Employee Relations", category: SkillCategory.BUSINESS_HR, description: "Managing the relationship between employers and employees" },
  { value: "Market Research", label: "Market Research", category: SkillCategory.BUSINESS_HR, description: "Gathering information about target markets and customers" },
  { value: "Financial Analysis", label: "Financial Analysis", category: SkillCategory.BUSINESS_HR, description: "Assessing the financial health of a business" },
  { value: "Business Development", label: "Business Development", category: SkillCategory.BUSINESS_HR, description: "Strategies to grow a business" },
  { value: "Strategic Planning", label: "Strategic Planning", category: SkillCategory.BUSINESS_HR, description: "Defining an organization's strategy and direction" },
  { value: "Talent Management", label: "Talent Management", category: SkillCategory.BUSINESS_HR, description: "Recruiting, developing, motivating, and retaining high-performing employees" },

  // Design & UI/UX
  { value: "Figma", label: "Figma", category: SkillCategory.DESIGN_UX, description: "Design and prototyping tool" },
  { value: "Sketch", label: "Sketch", category: SkillCategory.DESIGN_UX, description: "Digital design toolkit" },
  { value: "Adobe XD", label: "Adobe XD", category: SkillCategory.DESIGN_UX, description: "User experience design software" },
  { value: "User Research", label: "User Research", category: SkillCategory.DESIGN_UX, description: "Understanding user behaviors, needs, and motivations" },
  { value: "Wireframing", label: "Wireframing", category: SkillCategory.DESIGN_UX, description: "Creating a basic visual guide for a website or app layout" },
  { value: "Prototyping", label: "Prototyping", category: SkillCategory.DESIGN_UX, description: "Creating interactive mockups" },
  { value: "Graphic Design", label: "Graphic Design", category: SkillCategory.DESIGN_UX, description: "Creating visual content" },

  // Testing
  { value: "Jest", label: "Jest", category: SkillCategory.TESTING, description: "JavaScript testing framework" },
  { value: "Cypress", label: "Cypress", category: SkillCategory.TESTING, description: "End-to-end testing framework" },
  { value: "Playwright", label: "Playwright", category: SkillCategory.TESTING, description: "Cross-browser automation library" },
  { value: "Vitest", label: "Vitest", category: SkillCategory.TESTING, description: "Fast unit testing framework" },
  { value: "Selenium", label: "Selenium", category: SkillCategory.TESTING, description: "Web browser automation framework" },
  { value: "Manual Testing", label: "Manual Testing", category: SkillCategory.TESTING, description: "Testing software manually without automation tools" },
  { value: "Performance Testing", label: "Performance Testing", category: SkillCategory.TESTING, description: "Evaluating system performance under specific loads" },

  // Communication & Public Speaking
  { value: "Public Speaking", label: "Public Speaking", category: SkillCategory.COMMUNICATION, description: "Ability to deliver clear, engaging presentations to an audience" },
  { value: "Technical Writing", label: "Technical Writing", category: SkillCategory.COMMUNICATION, description: "Communicating complex information clearly and concisely" },
  { value: "Presentation Skills", label: "Presentation Skills", category: SkillCategory.COMMUNICATION, description: "Ability to create and deliver effective presentations" },
  { value: "Storytelling", label: "Storytelling", category: SkillCategory.COMMUNICATION, description: "Using narrative to convey messages and engage audiences" },
  { value: "Cross-functional Communication", label: "Cross-functional Communication", category: SkillCategory.COMMUNICATION, description: "Effective communication across different teams or departments" },

  // Other Tools (General & Cross-Disciplinary)
  { value: "Git", label: "Git", category: SkillCategory.OTHER_TOOLS, description: "Version control system" },
  { value: "Webpack", label: "Webpack", category: SkillCategory.OTHER_TOOLS, description: "Module bundler for JavaScript" },
  { value: "Vite", label: "Vite", category: SkillCategory.OTHER_TOOLS, description: "Fast build tool for modern web apps" },
  { value: "ESLint", label: "ESLint", category: SkillCategory.OTHER_TOOLS, description: "JavaScript linting utility" },
  { value: "Prettier", label: "Prettier", category: SkillCategory.OTHER_TOOLS, description: "Code formatting tool" },
  { value: "Microsoft Office Suite", label: "Microsoft Office Suite", category: SkillCategory.OTHER_TOOLS, description: "Word, Excel, PowerPoint, Outlook" },
  { value: "Google Workspace", label: "Google Workspace", category: SkillCategory.OTHER_TOOLS, description: "Docs, Sheets, Slides, Gmail, Calendar" },
  { value: "Slack", label: "Slack", category: SkillCategory.OTHER_TOOLS, description: "Team communication platform" },
  { value: "Zoom", label: "Zoom", category: SkillCategory.OTHER_TOOLS, description: "Video conferencing tool" },
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
export const getDesignSkills = () => getSkillsByCategory(SkillCategory.DESIGN_UX);
export const getTestingSkills = () => getSkillsByCategory(SkillCategory.TESTING);
export const getOtherSkills = () => getSkillsByCategory(SkillCategory.OTHER_TOOLS);



