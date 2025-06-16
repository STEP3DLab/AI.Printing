// Тип с параметрами для расчёта стоимости
import { CostParams } from './types';

// Расчёт стоимости печати по объёму модели и параметрам
export function calculateCost(volumeCm3: number, params: CostParams) {
  // Базовый объём учитывает инфил и поддерж­ки
  const baseVol = volumeCm3 * params.infill + volumeCm3 * params.supportPct;
  const copies = Math.max(1, params.copies);

  // Стоимость FDM-печати
  const fdm = baseVol * params.priceFilament * copies +
              baseVol * params.timeCoefFdm * params.priceMachine * copies +
              params.packCost;
  // Стоимость DLP-печати
  const dlp = baseVol * params.priceResin * copies +
              baseVol * params.timeCoefDlp * params.priceMachine * copies +
              params.packCost;
  return { fdm, dlp };
}
