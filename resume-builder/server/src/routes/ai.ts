import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';

const router = express.Router();

// Generate summary
router.post('/generate-summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { experience, role } = req.body;
    const summary = await AIService.generateSummary(experience, role);
    res.json({ summary });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Improve bullet point
router.post('/improve-bullet', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { bullet } = req.body;
    const improved = await AIService.improveBullet(bullet);
    res.json({ improved });
  } catch (error) {
    console.error('Improve bullet error:', error);
    res.status(500).json({ error: 'Failed to improve bullet' });
  }
});

// Generate bullets
router.post('/generate-bullets', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role, company, count } = req.body;
    const bullets = await AIService.generateBullets(role, company, count || 3);
    res.json({ bullets });
  } catch (error) {
    console.error('Generate bullets error:', error);
    res.status(500).json({ error: 'Failed to generate bullets' });
  }
});

// Rewrite for role
router.post('/rewrite-for-role', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { content, targetRole } = req.body;
    const rewritten = await AIService.rewriteForRole(content, targetRole);
    res.json({ rewritten });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({ error: 'Failed to rewrite content' });
  }
});

// Analyze job description
router.post('/analyze-jd', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { jobDescription } = req.body;
    const analysis = await AIService.analyzeJobDescription(jobDescription);
    res.json(analysis);
  } catch (error) {
    console.error('Analyze JD error:', error);
    res.status(500).json({ error: 'Failed to analyze job description' });
  }
});

// Match resume with JD
router.post('/match-resume', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jdAnalysis } = req.body;
    const matchScore = AIService.calculateMatchScore(resume, jdAnalysis);
    res.json(matchScore);
  } catch (error) {
    console.error('Match resume error:', error);
    res.status(500).json({ error: 'Failed to match resume' });
  }
});

// Generate cover letter
router.post('/generate-cover-letter', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jobDescription, company, tone } = req.body;
    const coverLetter = await AIService.generateCoverLetter(resume, jobDescription, company, tone);
    res.json({ coverLetter });
  } catch (error) {
    console.error('Generate cover letter error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// Suggest skills
router.post('/suggest-skills', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role, currentSkills } = req.body;
    const suggestions = await AIService.suggestSkills(role, currentSkills);
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggest skills error:', error);
    res.status(500).json({ error: 'Failed to suggest skills' });
  }
});

// Analyze resume
router.post('/analyze-resume', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { resume } = req.body;
    const analysis = await AIService.analyzeResume(resume);
    res.json(analysis);
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

export default router;
