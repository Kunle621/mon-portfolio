// src/types/index.ts

export interface ProfileData {
  availability: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  titleFr?: string;
  titleEn?: string;
  bioFr?: string;
  bioEn?: string;
  headshotUrl?: string;
  cvUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  taglineFr?: string; 
  taglineEn?: string; 
  learningMessageFr?: string;
  learningMessageEn?: string;
}

export interface ServiceData {
  _id: string;
  icon: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

export interface SkillData {
  _id: string;
  name: string;
  icon: string;
  category: string;
  color?: string;
}

export interface ProjectData {
  _id?: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  categories: string[];   
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  createdAt?: string;
}
