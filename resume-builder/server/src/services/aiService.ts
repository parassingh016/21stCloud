import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

export class AIService {
  // Generate professional summary
  static async generateSummary(experience: any[], role: string): Promise<string> {
    try {
      const prompt = `Generate a professional resume summary for a ${role} with the following experience:
${JSON.stringify(experience, null, 2)}

Create a compelling 2-3 sentence summary that highlights key achievements and skills.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('AI Summary Error:', error);
      return 'Experienced professional with a proven track record of delivering results and driving innovation.';
    }
  }

  // Improve bullet point
  static async improveBullet(bullet: string): Promise<string> {
    try {
      const prompt = `Improve this resume bullet point to be more impactful and achievement-focused:
"${bullet}"

Make it concise, use action verbs, and include metrics if possible. Return only the improved bullet point.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 100
      });

      return response.choices[0].message.content?.trim() || bullet;
    } catch (error) {
      console.error('AI Improve Bullet Error:', error);
      return bullet;
    }
  }

  // Generate bullet points for a role
  static async generateBullets(role: string, company: string, count: number = 3): Promise<string[]> {
    try {
      const prompt = `Generate ${count} professional resume bullet points for a ${role} position at ${company}.
Each bullet should:
- Start with a strong action verb
- Include specific achievements or responsibilities
- Be concise and impactful
- Include metrics where appropriate

Return only the bullet points, one per line, without numbers or dashes.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 300
      });

      const content = response.choices[0].message.content || '';
      return content.split('\n').filter(line => line.trim().length > 0).slice(0, count);
    } catch (error) {
      console.error('AI Generate Bullets Error:', error);
      return [
        'Led cross-functional teams to deliver high-impact projects',
        'Implemented innovative solutions that improved efficiency by 30%',
        'Collaborated with stakeholders to drive strategic initiatives'
      ];
    }
  }

  // Rewrite for different role
  static async rewriteForRole(content: string, targetRole: string): Promise<string> {
    try {
      const prompt = `Rewrite this resume content to better fit a ${targetRole} position:
"${content}"

Adjust the language, focus, and emphasis to align with ${targetRole} responsibilities and skills.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      });

      return response.choices[0].message.content?.trim() || content;
    } catch (error) {
      console.error('AI Rewrite Error:', error);
      return content;
    }
  }

  // Analyze job description
  static async analyzeJobDescription(jd: string): Promise<any> {
    try {
      const prompt = `Analyze this job description and extract:
1. Required skills (list)
2. Key responsibilities (list)
3. Important keywords (list)
4. Seniority level (entry/mid/senior/lead)

Job Description:
${jd}

Return as JSON with keys: skills, responsibilities, keywords, seniorityLevel`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0].message.content || '{}';
      try {
        return JSON.parse(content);
      } catch {
        return {
          skills: [],
          responsibilities: [],
          keywords: [],
          seniorityLevel: 'mid'
        };
      }
    } catch (error) {
      console.error('AI JD Analysis Error:', error);
      return {
        skills: [],
        responsibilities: [],
        keywords: [],
        seniorityLevel: 'mid'
      };
    }
  }

  // Calculate match score
  static calculateMatchScore(resume: any, jdAnalysis: any): any {
    const resumeSkills = resume.skills.flatMap((s: any) => s.skills.map((sk: string) => sk.toLowerCase()));
    const jdSkills = jdAnalysis.skills.map((s: string) => s.toLowerCase());
    
    const matchedSkills = jdSkills.filter((skill: string) => 
      resumeSkills.some((rs: string) => rs.includes(skill) || skill.includes(rs))
    );
    
    const skillsMatch = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 100 : 0;
    
    const missingKeywords = jdSkills.filter((skill: string) => 
      !resumeSkills.some((rs: string) => rs.includes(skill) || skill.includes(rs))
    );

    const overall = Math.round(skillsMatch * 0.7 + 30); // Simplified scoring

    return {
      overall,
      skillsMatch: Math.round(skillsMatch),
      experienceMatch: 75,
      missingKeywords: missingKeywords.slice(0, 10),
      suggestions: [
        missingKeywords.length > 0 ? `Add these skills: ${missingKeywords.slice(0, 3).join(', ')}` : 'Great skill match!',
        'Consider adding metrics to your achievements',
        'Tailor your summary to match the job description'
      ]
    };
  }

  // Generate cover letter
  static async generateCoverLetter(
    resume: any,
    jobDescription: string,
    company: string,
    tone: 'formal' | 'friendly' | 'short' = 'formal'
  ): Promise<string> {
    try {
      const toneInstructions = {
        formal: 'professional and formal',
        friendly: 'warm and approachable while remaining professional',
        short: 'concise and to-the-point (1 paragraph)'
      };

      const prompt = `Write a ${toneInstructions[tone]} cover letter for ${resume.personalInfo.fullName} applying to ${company}.

Resume Summary:
- Name: ${resume.personalInfo.fullName}
- Experience: ${resume.experience.length} positions
- Top Skills: ${resume.skills.flatMap((s: any) => s.skills).slice(0, 5).join(', ')}

Job Description:
${jobDescription}

Create a compelling cover letter that highlights relevant experience and enthusiasm for the role.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: tone === 'short' ? 200 : 500
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('AI Cover Letter Error:', error);
      return `Dear Hiring Manager,\n\nI am writing to express my interest in the position at ${company}...`;
    }
  }

  // Suggest missing skills
  static async suggestSkills(role: string, currentSkills: string[]): Promise<string[]> {
    try {
      const prompt = `For a ${role} position, suggest 5-7 important skills that are missing from this list:
${currentSkills.join(', ')}

Return only the skill names, one per line.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 150
      });

      const content = response.choices[0].message.content || '';
      return content.split('\n').filter(line => line.trim().length > 0).slice(0, 7);
    } catch (error) {
      console.error('AI Suggest Skills Error:', error);
      return [];
    }
  }

  // Analyze resume quality
  static async analyzeResume(resume: any): Promise<any> {
    const score = this.calculateResumeScore(resume);
    
    return {
      score: score.overall,
      readability: score.readability,
      atsCompliance: score.atsCompliance,
      keywordDensity: score.keywordDensity,
      suggestions: score.suggestions,
      strengths: score.strengths,
      weaknesses: score.weaknesses
    };
  }

  private static calculateResumeScore(resume: any): any {
    const suggestions: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    let score = 100;
    
    // Check personal info
    if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 50) {
      score -= 10;
      weaknesses.push('Missing or short professional summary');
      suggestions.push('Add a compelling professional summary (2-3 sentences)');
    } else {
      strengths.push('Strong professional summary');
    }
    
    // Check experience
    if (resume.experience.length === 0) {
      score -= 20;
      weaknesses.push('No work experience listed');
      suggestions.push('Add your work experience with achievements');
    } else {
      strengths.push(`${resume.experience.length} work experiences listed`);
      
      const bulletsCount = resume.experience.reduce((sum: number, exp: any) => sum + exp.bullets.length, 0);
      if (bulletsCount < resume.experience.length * 3) {
        score -= 10;
        suggestions.push('Add more bullet points to your experience (3-5 per role)');
      }
    }
    
    // Check skills
    if (resume.skills.length === 0) {
      score -= 15;
      weaknesses.push('No skills listed');
      suggestions.push('Add relevant technical and soft skills');
    } else {
      strengths.push('Skills section included');
    }
    
    // Check education
    if (resume.education.length === 0) {
      score -= 10;
      suggestions.push('Add your education background');
    }
    
    const readability = Math.max(60, score);
    const atsCompliance = resume.template === 'ats' ? 95 : 85;
    const keywordDensity = Math.min(100, resume.skills.flatMap((s: any) => s.skills).length * 5);
    
    return {
      overall: Math.max(0, score),
      readability,
      atsCompliance,
      keywordDensity,
      suggestions,
      strengths,
      weaknesses
    };
  }
}
