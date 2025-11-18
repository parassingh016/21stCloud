import express, { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import {
  getResumesByUserId,
  saveResume,
  deleteResume,
  getResumeById
} from '../utils/storage';

const router = express.Router();

// Get all resumes for user
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resumes = getResumesByUserId(req.user!.id);
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get single resume
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resume = getResumeById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (resume.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Create resume
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resume = {
      id: uuidv4(),
      userId: req.user!.id,
      title: req.body.title || 'Untitled Resume',
      personalInfo: req.body.personalInfo || {
        fullName: '',
        email: req.user!.email,
        phone: '',
        location: '',
        summary: ''
      },
      experience: req.body.experience || [],
      education: req.body.education || [],
      projects: req.body.projects || [],
      skills: req.body.skills || [],
      certifications: req.body.certifications || [],
      template: req.body.template || 'modern',
      customization: req.body.customization || {
        fontSize: 12,
        lineSpacing: 1.5,
        theme: 'blue',
        fontFamily: 'Arial'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveResume(resume);
    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Update resume
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const existingResume = getResumeById(req.params.id);
    
    if (!existingResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (existingResume.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updatedResume = {
      ...existingResume,
      ...req.body,
      id: existingResume.id,
      userId: existingResume.userId,
      createdAt: existingResume.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    saveResume(updatedResume);
    res.json(updatedResume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Duplicate resume
router.post('/:id/duplicate', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const existingResume = getResumeById(req.params.id);
    
    if (!existingResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (existingResume.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const duplicatedResume = {
      ...existingResume,
      id: uuidv4(),
      title: `${existingResume.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveResume(duplicatedResume);
    res.status(201).json(duplicatedResume);
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({ error: 'Failed to duplicate resume' });
  }
});

// Delete resume
router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resume = getResumeById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (resume.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    deleteResume(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
