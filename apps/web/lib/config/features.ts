export interface ProjectFeature {
  value: string;
  label: string;
  category: FeatureCategory;
  description?: string;
}

export enum FeatureCategory {
  // Core Application Functionality
  AUTHENTICATION_AUTHORIZATION = 'Authentication & Authorization',
  DATA_MANAGEMENT = 'Data Storage & Management',
  INTEGRATIONS = 'Integrations & APIs',
  USER_INTERACTION = 'User Interaction & Communication',
  ECOMMERCE_FINANCE = 'E-commerce & Finance',
  ANALYTICS_REPORTING = 'Analytics & Reporting',
  ADMINISTRATION = 'Administration & Content Management',
  PERFORMANCE_OPTIMIZATION = 'Performance & Scalability',
  INTERNATIONALIZATION_ACCESSIBILITY = 'Internationalization & Accessibility',
  
  // Discipline-Specific Features (Examples)
  AI_ML_FEATURES = 'AI & Machine Learning Features',
  ENGINEERING_SIMULATION = 'Engineering & Simulation Features',
  DESIGN_UX_FEATURES = 'Design & UX Features',
  BUSINESS_AUTOMATION = 'Business Automation Features',

  OTHER_FEATURES = 'Other Features',
}

export const PROJECT_FEATURES: ProjectFeature[] = [
  // --- Core Application Functionality ---

  // Authentication & Authorization
  { value: "User Authentication", label: "User Authentication", category: FeatureCategory.AUTHENTICATION_AUTHORIZATION, description: "System for users to log in/out securely" },
  { value: "Social Login", label: "Social Login", category: FeatureCategory.AUTHENTICATION_AUTHORIZATION, description: "Login via Google, Facebook, GitHub, etc." },
  { value: "Role-Based Access Control (RBAC)", label: "RBAC", category: FeatureCategory.AUTHENTICATION_AUTHORIZATION, description: "Define permissions based on user roles" },
  { value: "Multi-Factor Authentication (MFA)", label: "Multi-Factor Auth (MFA)", category: FeatureCategory.AUTHENTICATION_AUTHORIZATION, description: "Adds an extra layer of security for logins" },
  { value: "Single Sign-On (SSO)", label: "Single Sign-On (SSO)", category: FeatureCategory.AUTHENTICATION_AUTHORIZATION, description: "Login once to access multiple applications" },

  // Data Storage & Management
  { value: "Database Integration", label: "Database Integration", category: FeatureCategory.DATA_MANAGEMENT, description: "Connects to a database for data persistence" },
  { value: "File Upload", label: "File Upload", category: FeatureCategory.DATA_MANAGEMENT, description: "Allows users to upload files (images, documents, etc.)" },
  { value: "Data Export/Import", label: "Data Export/Import", category: FeatureCategory.DATA_MANAGEMENT, description: "Functionality to export/import data in various formats" },
  { value: "Data Encryption", label: "Data Encryption", category: FeatureCategory.DATA_MANAGEMENT, description: "Protects sensitive data at rest and in transit" },

  // Integrations & APIs
  { value: "REST API", label: "REST API", category: FeatureCategory.INTEGRATIONS, description: "Provides a RESTful interface for external systems" },
  { value: "GraphQL API", label: "GraphQL API", category: FeatureCategory.INTEGRATIONS, description: "Provides a GraphQL interface for flexible data fetching" },
  { value: "Third-Party Integrations", label: "Third-Party Integrations", category: FeatureCategory.INTEGRATIONS, description: "Connects with external services (e.g., payment, CRM, social media)" },
  { value: "Webhooks", label: "Webhooks", category: FeatureCategory.INTEGRATIONS, description: "Real-time notifications to other applications" },

  // User Interaction & Communication
  { value: "Real-time Updates", label: "Real-time Updates", category: FeatureCategory.USER_INTERACTION, description: "Instantaneous data synchronization for users" },
  { value: "Chat System", label: "Chat System", category: FeatureCategory.USER_INTERACTION, description: "Enables real-time messaging between users" },
  { value: "Notifications", label: "Notifications", category: FeatureCategory.USER_INTERACTION, description: "Alerts for users (in-app, email, push)" },
  { value: "Search Functionality", label: "Search Functionality", category: FeatureCategory.USER_INTERACTION, description: "Allows users to search for content within the application" },
  { value: "User Profiles", label: "User Profiles", category: FeatureCategory.USER_INTERACTION, description: "Personalized pages for each user" },
  { value: "Content Management System (CMS)", label: "CMS", category: FeatureCategory.ADMINISTRATION, description: "Tools for creating and managing digital content" },

  // E-commerce & Finance
  { value: "Payment Processing", label: "Payment Processing", category: FeatureCategory.ECOMMERCE_FINANCE, description: "Integrates with payment gateways (Stripe, PayPal)" },
  { value: "Shopping Cart", label: "Shopping Cart", category: FeatureCategory.ECOMMERCE_FINANCE, description: "Functionality for e-commerce product selection" },
  { value: "Order Management", label: "Order Management", category: FeatureCategory.ECOMMERCE_FINANCE, description: "Tracking and managing customer orders" },
  { value: "Subscription Management", label: "Subscription Management", category: FeatureCategory.ECOMMERCE_FINANCE, description: "Handling recurring billing and subscriptions" },

  // Analytics & Reporting
  { value: "Analytics Dashboard", label: "Analytics Dashboard", category: FeatureCategory.ANALYTICS_REPORTING, description: "Visual representation of key performance metrics" },
  { value: "Custom Reporting", label: "Custom Reporting", category: FeatureCategory.ANALYTICS_REPORTING, description: "Generate custom reports based on data" },
  { value: "Audit Logs", label: "Audit Logs", category: FeatureCategory.ANALYTICS_REPORTING, description: "Records of activities for compliance and debugging" },

  // Administration & Content Management
  { value: "Admin Panel", label: "Admin Panel", category: FeatureCategory.ADMINISTRATION, description: "Backend interface for administrators to manage the application" },
  { value: "User Management", label: "User Management", category: FeatureCategory.ADMINISTRATION, description: "Tools for administrators to manage user accounts" },
  { value: "Content Versioning", label: "Content Versioning", category: FeatureCategory.ADMINISTRATION, description: "Tracking changes to content over time" },

  // Performance & Scalability
  { value: "Caching", label: "Caching", category: FeatureCategory.PERFORMANCE_OPTIMIZATION, description: "Stores data temporarily to speed up access" },
  { value: "Load Balancing", label: "Load Balancing", category: FeatureCategory.PERFORMANCE_OPTIMIZATION, description: "Distributes network traffic across multiple servers" },
  { value: "Offline Support", label: "Offline Support", category: FeatureCategory.PERFORMANCE_OPTIMIZATION, description: "Application functionality continues without internet connection" },
  { value: "Containerization (Docker)", label: "Containerization (Docker)", category: FeatureCategory.PERFORMANCE_OPTIMIZATION, description: "Packages application and dependencies into isolated containers" },

  // Internationalization & Accessibility
  { value: "Multi-language Support (i18n)", label: "Multi-language Support", category: FeatureCategory.INTERNATIONALIZATION_ACCESSIBILITY, description: "Application available in multiple languages" },
  { value: "Accessibility Features (a11y)", label: "Accessibility Features", category: FeatureCategory.INTERNATIONALIZATION_ACCESSIBILITY, description: "Ensures usability for people with disabilities" },
  { value: "SEO Optimized", label: "SEO Optimized", category: FeatureCategory.INTERNATIONALIZATION_ACCESSIBILITY, description: "Optimized for search engine visibility" },


  // --- Discipline-Specific Features ---

  // AI & Machine Learning Features
  { value: "Custom AI Model Training", label: "Custom AI Model Training", category: FeatureCategory.AI_ML_FEATURES, description: "Allows users to train their own AI models" },
  { value: "Predictive Analytics", label: "Predictive Analytics", category: FeatureCategory.AI_ML_FEATURES, description: "Uses AI to forecast future outcomes" },
  { value: "Recommendation Engine", label: "Recommendation Engine", category: FeatureCategory.AI_ML_FEATURES, description: "Suggests items/content based on user preferences or behavior" },
  { value: "Generative AI", label: "Generative AI", category: FeatureCategory.AI_ML_FEATURES, description: "Generates new content (text, images, code)" },
  { value: "Sentiment Analysis", label: "Sentiment Analysis", category: FeatureCategory.AI_ML_FEATURES, description: "Determines the emotional tone of text" },
  { value: "Object Detection", label: "Object Detection", category: FeatureCategory.AI_ML_FEATURES, description: "Identifies and locates objects in images/videos" },
  { value: "Speech Recognition", label: "Speech Recognition", category: FeatureCategory.AI_ML_FEATURES, description: "Converts spoken language into text" },

  // Engineering & Simulation Features (for Mechanical, Civil, Electrical, etc.)
  { value: "3D CAD Modeling", label: "3D CAD Modeling", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Creates 3D computer-aided design models" },
  { value: "Finite Element Analysis (FEA) Simulation", label: "FEA Simulation", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Simulates physical phenomena using numerical methods" },
  { value: "Circuit Simulation", label: "Circuit Simulation", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Simulates the behavior of electronic circuits" },
  { value: "Fluid Dynamics Simulation (CFD)", label: "CFD Simulation", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Simulates fluid flow and heat transfer" },
  { value: "Structural Load Analysis", label: "Structural Load Analysis", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Calculates forces and stresses on structures" },
  { value: "Real-time Sensor Integration", label: "Real-time Sensor Integration", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Connects and processes data from physical sensors" },
  { value: "PLC/SCADA Integration", label: "PLC/SCADA Integration", category: FeatureCategory.ENGINEERING_SIMULATION, description: "Interfaces with industrial control systems" },

  // Design & UX Features
  { value: "Interactive Prototyping", label: "Interactive Prototyping", category: FeatureCategory.DESIGN_UX_FEATURES, description: "Creates clickable, interactive mockups for user testing" },
  { value: "User Flow Mapping", label: "User Flow Mapping", category: FeatureCategory.DESIGN_UX_FEATURES, description: "Visualizes the path a user takes to complete a task" },
  { value: "Wireframing Tools", label: "Wireframing Tools", category: FeatureCategory.DESIGN_UX_FEATURES, description: "Low-fidelity layout creation for design ideas" },
  { value: "Style Guide / Design System", label: "Style Guide / Design System", category: FeatureCategory.DESIGN_UX_FEATURES, description: "Documentation of design principles and reusable components" },
  { value: "A/B Testing Integration", label: "A/B Testing Integration", category: FeatureCategory.DESIGN_UX_FEATURES, description: "Tests different versions of a design to see which performs better" },

  // Business Automation Features
  { value: "Workflow Automation", label: "Workflow Automation", category: FeatureCategory.BUSINESS_AUTOMATION, description: "Automates multi-step business processes" },
  { value: "CRM Integration", label: "CRM Integration", category: FeatureCategory.BUSINESS_AUTOMATION, description: "Connects with Customer Relationship Management systems" },
  { value: "Inventory Management", label: "Inventory Management", category: FeatureCategory.BUSINESS_AUTOMATION, description: "Tracks stock levels and product movement" },
  { value: "Invoice Generation", label: "Invoice Generation", category: FeatureCategory.BUSINESS_AUTOMATION, description: "Automatically creates and sends invoices" },
  { value: "Report Automation", label: "Report Automation", category: FeatureCategory.BUSINESS_AUTOMATION, description: "Automates the generation and distribution of business reports" },
  { value: "Lead Management", label: "Lead Management", category: FeatureCategory.BUSINESS_AUTOMATION, description: "Manages potential customer leads through a sales funnel" },
  
  // Other / General
  { value: "Data Visualization", label: "Data Visualization", category: FeatureCategory.OTHER_FEATURES, description: "Presents complex data in graphical formats" },
  { value: "Command Line Interface (CLI)", label: "CLI", category: FeatureCategory.OTHER_FEATURES, description: "Text-based interface for interacting with the application" },
  { value: "Desktop Application", label: "Desktop Application", category: FeatureCategory.OTHER_FEATURES, description: "Software running natively on a desktop OS" },
  { value: "Mobile Application", label: "Mobile Application", category: FeatureCategory.OTHER_FEATURES, description: "Software running natively on mobile OS" },
];





export const getFeaturebyCategory = (category: FeatureCategory): ProjectFeature[] => {
  return PROJECT_FEATURES.filter(PROJECT_FEATURE => PROJECT_FEATURE.category === category);
};
