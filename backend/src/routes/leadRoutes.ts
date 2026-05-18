import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
  getLeadStats,
} from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole, LeadStatus, LeadSource } from '../types';

const router = Router();

// All routes are protected
router.use(protect);

// Validation rules
const leadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .notEmpty().withMessage('Source is required.')
    .isIn(Object.values(LeadSource)).withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters.'),
];

const updateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .optional()
    .isIn(Object.values(LeadSource)).withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters.'),
];

// Routes
router.get('/stats/summary', getLeadStats);
router.get('/export/csv', exportLeadsCsv);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', leadValidation, createLead);
router.put('/:id', updateValidation, updateLead);
router.delete('/:id', restrictTo(UserRole.ADMIN), deleteLead);

export default router;
