import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

// GET /admin/support — list all tickets
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const { status } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = status ? { status: String(status) } : {};

    const [items, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true, email: true } },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    res.json({ success: true, data: { items, total } });
  } catch (err) {
    next(err);
  }
});

// GET /admin/support/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [open, escalated, resolved, total] = await Promise.all([
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { status: 'ESCALATED' } }),
      prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
      prisma.supportTicket.count(),
    ]);
    res.json({ success: true, data: { open, escalated, resolved, total } });
  } catch (err) {
    next(err);
  }
});

// GET /admin/support/:id — ticket detail
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, username: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!ticket) throw new AppError(404, 'Ticket not found');
    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// POST /admin/support/:id/reply — admin replies
router.post('/:id/reply', async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) throw new AppError(400, 'Content is required');

    const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    const message = await prisma.supportMessage.create({
      data: { ticketId: req.params.id, role: 'ADMIN', content: content.trim() },
    });

    await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { status: 'OPEN', updatedAt: new Date() },
    });

    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
});

// PATCH /admin/support/:id/resolve — mark resolved
router.patch('/:id/resolve', async (req, res, next) => {
  try {
    const ticket = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    });
    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

export default router;
