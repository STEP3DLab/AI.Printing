// Параметры, используемые при расчёте стоимости печати
export interface CostParams {
  priceFilament: number; // цена филамента за см³
  priceResin: number;    // цена смолы за см³
  timeCoefFdm: number;   // коэффициент времени FDM (ч/см³)
  timeCoefDlp: number;   // коэффициент времени DLP (ч/см³)
  priceMachine: number;  // стоимость часа работы оборудования
  infill: number;        // процент заполнения модели (0..1)
  supportPct: number;    // процент поддержек (0..1)
  copies: number;        // количество копий
  packCost: number;      // стоимость упаковки
}
