export interface TaxResult {
  baseAmount: string;
  vatAmount: string;
  totalWithVat: string;
  whtAmount: string;
  netPayment: string;
}

export enum CalculationMode {
  EXCLUDE_VAT = 'exclude_vat',
  INCLUDE_VAT = 'include_vat',
}