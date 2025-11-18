import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const readData = (filename: string): any => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeData = (filename: string, data: any): void => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getAllUsers = (): any[] => {
  return readData('users.json') || [];
};

export const saveUser = (user: any): void => {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  writeData('users.json', users);
};

export const getUserByEmail = (email: string): any => {
  const users = getAllUsers();
  return users.find(u => u.email === email);
};

export const getUserById = (id: string): any => {
  const users = getAllUsers();
  return users.find(u => u.id === id);
};

export const getAllResumes = (): any[] => {
  return readData('resumes.json') || [];
};

export const getResumesByUserId = (userId: string): any[] => {
  const resumes = getAllResumes();
  return resumes.filter(r => r.userId === userId);
};

export const saveResume = (resume: any): void => {
  const resumes = getAllResumes();
  const existingIndex = resumes.findIndex(r => r.id === resume.id);
  
  if (existingIndex >= 0) {
    resumes[existingIndex] = resume;
  } else {
    resumes.push(resume);
  }
  
  writeData('resumes.json', resumes);
};

export const deleteResume = (resumeId: string): void => {
  const resumes = getAllResumes();
  const filtered = resumes.filter(r => r.id !== resumeId);
  writeData('resumes.json', filtered);
};

export const getResumeById = (resumeId: string): any => {
  const resumes = getAllResumes();
  return resumes.find(r => r.id === resumeId);
};
