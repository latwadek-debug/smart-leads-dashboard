import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Lead from '../models/Lead';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource, UserRole } from '../types';
import { generateCsvContent } from '../utils/csvExport';

// @route   GET /api/leads
// @access  Private
export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filterQuery: Record<string, unknown> = {};

    // Sales users can only see their own leads
    if (req.user?.role === UserRole.SALES) {
      filterQuery.createdBy = req.user.id;
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filterQuery.status = status;
    }

    if (source && Object.values(LeadSource).includes(source)) {
      filterQuery.source = source;
    }

    if (search && search.trim()) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filterQuery.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const sortQuery: Record<string, 1 | -1> =
      sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [leads, total] = await Promise.all([
      Lead.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully.',
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, message: 'Invalid lead ID.' });
      return;
    }

    const lead = await Lead.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user?.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own leads.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead fetched successfully.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/leads
// @access  Private
export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
    return;
  }

  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
    return;
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, message: 'Invalid lead ID.' });
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user?.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user?.id
    ) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own leads.',
      });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, message: 'Invalid lead ID.' });
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/leads/export/csv
// @access  Private
export const exportLeadsCsv = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams;

    const filterQuery: Record<string, unknown> = {};

    if (req.user?.role === UserRole.SALES) {
      filterQuery.createdBy = req.user.id;
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filterQuery.status = status;
    }
    if (source && Object.values(LeadSource).includes(source)) {
      filterQuery.source = source;
    }
    if (search && search.trim()) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filterQuery.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filterQuery).sort({ createdAt: -1 });
    const csvContent = generateCsvContent(leads);

    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads-export-${timestamp}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/leads/stats/summary
// @access  Private
export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filterQuery: Record<string, unknown> = {};

    if (req.user?.role === UserRole.SALES) {
      filterQuery.createdBy = req.user.id;
    }

    const [total, newLeads, qualified, lost, recent] = await Promise.all([
      Lead.countDocuments(filterQuery),
      Lead.countDocuments({ ...filterQuery, status: LeadStatus.NEW }),
      Lead.countDocuments({ ...filterQuery, status: LeadStatus.QUALIFIED }),
      Lead.countDocuments({ ...filterQuery, status: LeadStatus.LOST }),
      Lead.find(filterQuery)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('createdBy', 'name email'),
    ]);

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        total,
        new: newLeads,
        qualified,
        lost,
        recent,
      },
    });
  } catch (error) {
    next(error);
  }
};
