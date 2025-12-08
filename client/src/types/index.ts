// src/types/index.ts

export interface ProfileData {
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