export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  template: string;
  customization: ResumeCustomization;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeCustomization {
  fontSize: number;
  lineSpacing: number;
  theme: 'blue' | 'green' | 'purple' | 'gray';
  fontFamily: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
  skills: string[];
  seniorityLevel: string;
}

export interface MatchScore {
  overall: number;
  skillsMatch: number;
  experienceMatch: number;
  missingKeywords: string[];
  suggestions: string[];
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  jobDescription: string;
  company: string;
  content: string;
  tone: 'formal' | 'friendly' | 'short';
  createdAt: string;
}

export interface ResumeAnalytics {
  score: number;
  readability: number;
  atsCompliance: number;
  keywordDensity: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface AIRequest {
  type: 'summary' | 'bullet' | 'rewrite' | 'expand' | 'simplify' | 'section';
  context: string;
  role?: string;
  seniorityLevel?: string;
}

export interface AIResponse {
  content: string;
  alternatives?: string[];
}

export interface Template {
  id: string;
  name: string;
  preview: string;
  atsOptimized: boolean;
}
