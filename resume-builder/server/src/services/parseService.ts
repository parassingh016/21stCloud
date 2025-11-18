import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseResume = async (file: Express.Multer.File): Promise<any> => {
  let text = '';

  try {
    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    // Parse the text to extract resume information
    const parsed = extractResumeData(text);
    return parsed;
  } catch (error) {
    console.error('Parse error:', error);
    throw new Error('Failed to parse resume file');
  }
};

const extractResumeData = (text: string): any => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract email
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract name (usually first line)
  const name = lines[0] || '';

  // Extract skills (look for common skill keywords)
  const skillKeywords = ['skills', 'technical skills', 'technologies', 'expertise'];
  const skills: string[] = [];
  
  lines.forEach((line, index) => {
    if (skillKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      // Get next few lines as skills
      for (let i = index + 1; i < Math.min(index + 5, lines.length); i++) {
        const skillLine = lines[i];
        if (skillLine && !skillLine.toLowerCase().includes('experience') && !skillLine.toLowerCase().includes('education')) {
          skills.push(...skillLine.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0));
        }
      }
    }
  });

  // Extract experience sections
  const experienceKeywords = ['experience', 'work history', 'employment'];
  const experiences: any[] = [];
  
  lines.forEach((line, index) => {
    if (experienceKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      // Parse experience entries
      for (let i = index + 1; i < Math.min(index + 20, lines.length); i++) {
        const expLine = lines[i];
        if (expLine && (expLine.includes('•') || expLine.includes('-') || expLine.match(/^\d/))) {
          experiences.push({
            id: `exp-${i}`,
            company: 'Extracted Company',
            position: 'Extracted Position',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            bullets: [expLine.replace(/^[•\-\d.]\s*/, '')]
          });
        }
      }
    }
  });

  // Extract education
  const educationKeywords = ['education', 'academic', 'university', 'college', 'degree'];
  const education: any[] = [];
  
  lines.forEach((line, index) => {
    if (educationKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      education.push({
        id: `edu-${index}`,
        institution: lines[index + 1] || 'Extracted Institution',
        degree: lines[index + 2] || 'Extracted Degree',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      });
    }
  });

  return {
    personalInfo: {
      fullName: name,
      email,
      phone,
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    experience: experiences.slice(0, 5),
    education: education.slice(0, 3),
    projects: [],
    skills: skills.length > 0 ? [{
      id: 'skills-1',
      category: 'Technical Skills',
      skills: [...new Set(skills)].slice(0, 15)
    }] : [],
    certifications: []
  };
};
