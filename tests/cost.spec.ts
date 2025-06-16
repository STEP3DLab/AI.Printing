import { describe, it, expect } from "vitest";
import { calculateCost } from '../src/domain/cost';
import type { CostParams } from '../src/domain/types';

describe('cost', () => {
  it('simple case', () => {
    const params: CostParams = {
      priceFilament: 1,
      priceResin: 2,
      timeCoefFdm: 1,
      timeCoefDlp: 1,
      priceMachine: 0,
      infill: 1,
      supportPct: 0,
      copies: 1,
      packCost: 0
    };
    const { fdm, dlp } = calculateCost(10, params);
    expect(fdm).toBeCloseTo(10);
    expect(dlp).toBeCloseTo(20);
  });
});
