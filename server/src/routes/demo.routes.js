import { Router } from 'express';
import { evaluateSampleAccusation, sampleAccusationSchema } from '../mocks/sampleVerdict.js';

const router = Router();

router.post('/sample/accusations', (req, res) => {
  const parsed = sampleAccusationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Choose a listed suspect and provide a shorter explanation.' },
    });
  }
  return res.json({ success: true, data: evaluateSampleAccusation(parsed.data) });
});

export default router;
