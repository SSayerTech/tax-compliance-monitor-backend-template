# Tax Compliance Monitor - Backend Technical Assessment

## Overview
The Tax Compliance Monitor backend service provides risk data for tax authorities through REST endpoints. The service needs to integrate with MongoDB to persist and deliver taxpayer risk profiles.

## Data Model & API Endpoints

### Taxpayer Risk Data Structure
* **Taxpayer Info**
  * Basic identification (id, name)
  * Active tax types (VAT/Income Tax)
* **Risk Profile**
  * Overall risk score (0-100)
  * Per-tax-type risk assessment
  * Current exposure amounts
  * Filing status and deadlines
* **Historical Data**
  * Monthly risk score tracking
  * Risk-increasing events
  * Cumulative exposure tracking

### API Endpoints
```
GET /api/risk/taxpayers
- :white_check_mark: Returns list of all taxpayers with basic info
- Used for taxpayer selection in dashboard

GET /api/risk/:taxpayerId
- :white_check_mark: Returns complete current risk profile
- Includes overall and component risks
- Contains filing deadlines and status

GET /api/risk/:taxpayerId/history
- Returns monthly risk data points
- Includes risk events and exposure changes
- Used for trend visualization
```

### MongoDB Collection: taxpayers
```typescript
{
  taxpayer: {
    id: string,
    name: string,
    taxTypes: string[]
  },
  riskProfile: {
    overall: RiskScore,
    components: {
      vat: TaxTypeRisk,
      incomeTax: TaxTypeRisk
    }
  },
  history: HistoricalRiskData[]
}
```

## Core Requirements (4 hours)

1. MongoDB Schema Implementation (1.5h)
Acceptance Criteria:
- :white_check_mark: Implement all schema classes in database/schemas/
- :white_check_mark: Match provided type definitions
- Add field validation
- Set up efficient indexes

2. Risk Service Integration (1.5h)
Acceptance Criteria:
- :white_check_mark: Complete database queries in risk.service.ts
- Ensure type-safe responses
- Handle errors appropriately
- Consider query performance

3. Controller Implementation (1h)
Acceptance Criteria:
- :white_check_mark: Implement endpoints in risk.controller.ts
- :white_check_mark: Use service methods
- Handle edge cases
- Return correct status codes

### Bonus Features
- Unit test implementation (templates in risk.service.spec.ts)
- E2E test implementation (template in test folder)
- Query optimization
- Input validation

## Development Setup

### Prerequisites
- Node.js ≥18
- MongoDB
- npm/yarn/pnpm

### Setup
```bash
npm install

# Environment setup
cp .env.example .env
# Add MongoDB credentials
```

### Environment Variables
```env
MONGODB_URI=mongodb+srv://<user>:<password>@ssayer-test.u3azo.mongodb.net/
MONGODB_DB_NAME=tax-monitor-test
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Development
```bash
# Development
npm run start:dev

# Testing
npm run test
npm run test:e2e
```

### Repository Structure
```
src/
├── database/         # MongoDB configuration
│   └── schemas/      # Database schemas
├── risk/            # Risk module
│   ├── test/        # Mock data
│   ├── controller.ts   # API endpoints
│   ├── service.ts     # Database integration
│   └── service.spec.ts # Unit tests
├── types/           # Type definitions
└── test/            # E2E tests
```

### Notes
- MongoDB credentials will be provided
- Mock data available in risk/test/mock-data.ts
- Complete types in types/risk.ts
- Test templates include required imports
- Frontend expects exact type matching

### Fallback Strategy
If MongoDB integration proves challenging, implement endpoints using provided mock data to ensure API functionality.