import Decimal from 'decimal.js';
import { CalculationMode, TaxResult } from '../types';

// Configure Decimal for precision
Decimal.set({ precision: 20 });

const VAT_RATE = 0.07;
const WHT_RATE = 0.03;

export const calculateTax = (amount: string, mode: CalculationMode): TaxResult => {
  if (!amount || isNaN(Number(amount))) {
    return {
      baseAmount: '0.00',
      vatAmount: '0.00',
      totalWithVat: '0.00',
      whtAmount: '0.00',
      netPayment: '0.00',
    };
  }

  try {
    const inputVal = new Decimal(amount);
    let baseAmount: Decimal;
    let vatAmount: Decimal;
    let totalWithVat: Decimal;

    if (mode === CalculationMode.EXCLUDE_VAT) {
      // Case 1: Input is Base Price (Before VAT)
      baseAmount = inputVal;
      vatAmount = baseAmount.times(VAT_RATE);
      totalWithVat = baseAmount.plus(vatAmount);
    } else {
      // Case 2: Input is Total Price (Inclusive of VAT)
      totalWithVat = inputVal;
      // Formula: Base = Total / 1.07
      baseAmount = totalWithVat.dividedBy(1 + VAT_RATE);
      vatAmount = totalWithVat.minus(baseAmount);
    }

    // WHT is always calculated on Base Amount
    const whtAmount = baseAmount.times(WHT_RATE);

    // Net Payment = (Base + VAT) - WHT
    // Note: Usually companies pay the full VAT to vendor, but deduct WHT.
    // So technically: (Base - WHT) + VAT = Net Payment
    // Which is mathematically equivalent to (Base + VAT) - WHT.
    const netPayment = totalWithVat.minus(whtAmount);

    // Formatting function
    const fmt = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);

    return {
      baseAmount: fmt(baseAmount),
      vatAmount: fmt(vatAmount),
      totalWithVat: fmt(totalWithVat),
      whtAmount: fmt(whtAmount),
      netPayment: fmt(netPayment),
    };
  } catch (error) {
    console.error("Calculation error", error);
    return {
      baseAmount: '0.00',
      vatAmount: '0.00',
      totalWithVat: '0.00',
      whtAmount: '0.00',
      netPayment: '0.00',
    };
  }
};

export const formatCurrency = (val: string): string => {
  const num = Number(val);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};