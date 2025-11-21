import React, { useState, useEffect } from 'react';
import { Calculator, Receipt, FileText, RefreshCcw, Copy, Check } from 'lucide-react';
import { calculateTax, formatCurrency } from './services/calculator';
import { CalculationMode, TaxResult } from './types';
import { ResultRow } from './components/ResultRow';

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [mode, setMode] = useState<CalculationMode>(CalculationMode.EXCLUDE_VAT);
  const [results, setResults] = useState<TaxResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (amount) {
      const res = calculateTax(amount, mode);
      setResults(res);
    } else {
      setResults(null);
    }
  }, [amount, mode]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and one decimal point
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const handleCopy = () => {
    if (results) {
      navigator.clipboard.writeText(results.netPayment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg inline-flex mb-4">
          <Calculator size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">คำนวณหัก ณ ที่จ่าย 3%</h1>
        <p className="text-gray-500 text-sm">สำหรับนิติบุคคลและงานบริการ (Tax WHT 3% & VAT 7%)</p>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Toggle Switch */}
        <div className="flex border-b border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setMode(CalculationMode.EXCLUDE_VAT)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === CalculationMode.EXCLUDE_VAT
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} />
            ราคาไม่รวม VAT
          </button>
          <button
            onClick={() => setMode(CalculationMode.INCLUDE_VAT)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === CalculationMode.INCLUDE_VAT
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Receipt size={16} />
            ราคารวม VAT
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === CalculationMode.EXCLUDE_VAT ? 'ระบุราคาค่าบริการ (ก่อน VAT)' : 'ระบุราคาทั้งหมด (รวม VAT)'}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="block w-full pl-4 pr-12 py-4 text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none placeholder-gray-300"
              />
              <div className="absolute right-4 top-0 bottom-0 flex items-center">
                {amount && (
                   <button 
                    onClick={handleClear} 
                    className="text-gray-400 hover:text-gray-600 p-1 mr-2 rounded-full hover:bg-gray-200 transition-colors"
                   >
                     <RefreshCcw size={16} />
                   </button>
                )}
                <span className="text-gray-400 font-medium">THB</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              รายละเอียดการคำนวณ
            </div>

            <ResultRow 
              label="มูลค่าบริการ (Base)" 
              value={results?.baseAmount || '0'} 
            />
            
            <ResultRow 
              label="VAT 7% (ภาษีมูลค่าเพิ่ม)" 
              value={results?.vatAmount || '0'} 
              isAddition
            />

            <ResultRow 
              label="รวมเป็นเงิน (Total Inc. VAT)" 
              value={results?.totalWithVat || '0'} 
            />

            <div className="my-4 border-t border-dashed border-gray-200"></div>

            <ResultRow 
              label="หัก ณ ที่จ่าย 3% (WHT)" 
              value={results?.whtAmount || '0'} 
              isDeduction
            />

            <div className="mt-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-1 opacity-20 blur-sm"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-blue-100 font-medium">ยอดโอนสุทธิ (Net Payment)</span>
                  <button 
                    onClick={handleCopy}
                    className="text-blue-100 hover:text-white transition-colors p-1 bg-white/10 hover:bg-white/20 rounded-lg"
                    title="Copy Amount"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-blue-200">
                    (มูลค่าบริการ + VAT - หัก ณ ที่จ่าย)
                  </span>
                  <span className="text-4xl font-bold tracking-tight tabular-nums">
                    {formatCurrency(results?.netPayment || '0')}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 max-w-md text-center">
        <div className="text-xs text-gray-400 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-600 mb-1">💡 หมายเหตุ</p>
          <p>การคำนวณนี้ใช้วิธีปัดเศษทศนิยมตามหลักสากล (Round Half Up) เพื่อความแม่นยำทางบัญชี</p>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} Simple Tax Calculator
        </p>
      </div>

    </div>
  );
};

export default App;