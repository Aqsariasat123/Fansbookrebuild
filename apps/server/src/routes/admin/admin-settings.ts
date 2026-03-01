import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

const SINGLETON_ID = 'singleton';

/**
 * Ensure the singleton PlatformConfig row exists.
 */
async function getOrCreateConfig() {
  let config = await prisma.platformConfig.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (!config) {
    config = await prisma.platformConfig.create({
      data: { id: SINGLETON_ID },
    });
  }
  return config;
}

// ─── GET /api/admin/settings/home ── home page settings ──
router.get('/home', async (_req, res, next) => {
  try {
    const config = await getOrCreateConfig();
    res.json({
      success: true,
      data: config.homeSettings as Record<string, unknown>,
    });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/admin/settings/home ── update home settings
router.put('/home', async (req, res, next) => {
  try {
    await getOrCreateConfig();
    const config = await prisma.platformConfig.update({
      where: { id: SINGLETON_ID },
      data: { homeSettings: req.body },
    });
    res.json({
      success: true,
      data: config.homeSettings as Record<string, unknown>,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/settings/general ── general settings ─
router.get('/general', async (_req, res, next) => {
  try {
    const config = await getOrCreateConfig();
    res.json({
      success: true,
      data: {
        commissionRate: config.commissionRate,
        minWithdrawal: config.minWithdrawal,
        maintenanceMode: config.maintenanceMode,
        maxUploadSizeMb: config.maxUploadSizeMb,
        ...(config.generalSettings as Record<string, unknown>),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/admin/settings/general ── update general ───
router.put('/general', async (req, res, next) => {
  try {
    await getOrCreateConfig();
    const { commissionRate, minWithdrawal, maintenanceMode, maxUploadSizeMb, ...rest } = req.body;

    const data: Record<string, unknown> = {};
    if (commissionRate !== undefined) data.commissionRate = Number(commissionRate);
    if (minWithdrawal !== undefined) data.minWithdrawal = Number(minWithdrawal);
    if (maintenanceMode !== undefined) data.maintenanceMode = Boolean(maintenanceMode);
    if (maxUploadSizeMb !== undefined) data.maxUploadSizeMb = Number(maxUploadSizeMb);
    if (Object.keys(rest).length > 0) data.generalSettings = rest;

    const config = await prisma.platformConfig.update({
      where: { id: SINGLETON_ID },
      data,
    });

    res.json({
      success: true,
      data: {
        commissionRate: config.commissionRate,
        minWithdrawal: config.minWithdrawal,
        maintenanceMode: config.maintenanceMode,
        maxUploadSizeMb: config.maxUploadSizeMb,
        ...(config.generalSettings as Record<string, unknown>),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
