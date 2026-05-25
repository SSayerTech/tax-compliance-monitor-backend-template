// src/risk/test/mock-data.ts
export const mockTaxpayerData = {
  taxpayer: {
    id: 'TP001',
    name: 'Test Corp',
    taxTypes: ['VAT', 'INCOME_TAX'],
  },
  riskProfile: {
    overall: {
      score: 55,
      previousScore: 45,
      trend: 'up',
      exposure: 25000000,
    },
    components: {
      vat: {
        score: 58,
        exposure: 15000000,
        lastFiled: '2024-11-14',
        nextDue: '2025-01-14',
        status: 'COMPLIANT',
      },
      incomeTax: {
        score: 32,
        exposure: 10000000,
        lastFiled: '2023-04-29',
        nextDue: '2025-04-29',
        status: 'COMPLIANT',
      },
    },
  },
  history: [
    {
      period: '2024-11',
      overallScore: 55,
      vatScore: 58,
      incomeTaxScore: 32,
      totalExposure: 25000000,
      events: [
        {
          type: 'RISK_INCREASE',
          description: 'Multiple late VAT filings detected',
          exposure: 3000000,
        },
      ],
    },
  ],
};

export const mockTaxpayerHistory = mockTaxpayerData.history;
