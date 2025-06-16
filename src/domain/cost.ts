import { CostParams } from './types';

export function calculateCost(volumeCm3: number, params: CostParams) {
  const baseVol = volumeCm3 * params.infill + volumeCm3 * params.supportPct;
  const copies = Math.max(1, params.copies);
  const fdm = baseVol * params.priceFilament * copies +
              baseVol * params.timeCoefFdm * params.priceMachine * copies +
              params.packCost;
  const dlp = baseVol * params.priceResin * copies +
              baseVol * params.timeCoefDlp * params.priceMachine * copies +
              params.packCost;
  return { fdm, dlp };
}
