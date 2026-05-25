# Tax Compliance Monitor: Backend Exercise

**Estimated time:** ~3h core · ~4h 30m with bonus tasks

---

## About this exercise

You are joining a team building a tax compliance API for Chilean businesses. The system stores invoices fetched from the SII (Servicio de Impuestos Internos) and cross-references counterpart RUTs against a blocked list maintained by the tax authority. When a counterpart appears on that list, the invoice is flagged as a risk.

The **risk module** is already live and serves as your reference implementation. Your job is to complete three things: the data schemas, the invoice explorer endpoint, a risk exposure summary, and the monitoring config endpoint.

Read the existing code before writing anything. The risk module shows you exactly the patterns the team uses.

---

## Your access

Your MongoDB credentials are **read-only**. The database is pre-seeded and managed by the admin. You are not expected to implement any `POST` or `PUT` endpoints. All tasks in this exercise are `GET` only.

The admin may add invoices or update blocked RUTs during the exercise week. Because `siiRisk` is computed at query time, any change is reflected immediately in your endpoint responses without you doing anything.

---

## Requirements

- Node.js 20 or later
- npm 9 or later
- MongoDB Atlas connection string (provided separately)

---

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGODB_URI and MONGODB_DB_NAME, then set DB_READ_ONLY=true
npm run start:dev
```

### Environment variables

| Variable          | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `MONGODB_URI`     | MongoDB Atlas connection string (provided separately)    |
| `MONGODB_DB_NAME` | Database name (`tax-monitor-test`)                       |
| `PORT`            | HTTP port (default `3001`)                               |
| `DB_READ_ONLY`    | `true` = your mode: reads live DB, writes are no-ops     |

---

## What's provided

Study these files before writing anything:

| File                                      | What it shows                                                   |
| ----------------------------------------- | --------------------------------------------------------------- |
| `src/risk/risk.module.ts`                 | Module structure, `MongooseModule.forFeature`, imports          |
| `src/risk/risk.service.ts`                | Service pattern, `@InjectModel`, lean queries, `taxpayerExists` |
| `src/risk/risk.controller.ts`             | Controller decorators, `NotFoundException`, async methods       |
| `src/database/schemas/taxpayer.schema.ts` | Mongoose schema pattern: `@Prop`, `@Schema`, `SchemaFactory`    |
| `src/types/`                              | All shared TypeScript types (do not modify)                     |

`RiskService.taxpayerExists(taxpayerId)` queries the `taxpayers` collection; use it for all 404 checks across every module.

The existing risk endpoints (`GET /api/risk/:taxpayerId` and `GET /api/risk/:taxpayerId/history`) return pre-computed scores stored in the `taxpayers` collection. They do not touch invoices. Your task in Story 3 is to add a complementary endpoint that computes risk live from the `invoices` and `blocked_ruts` collections.

### Live endpoints

These work out of the box once you configure your `.env`. Use them to verify your setup and study the response shapes before implementing anything.

| Method | Path                             | Description                                      |
| ------ | -------------------------------- | ------------------------------------------------ |
| GET    | `/api/risk/taxpayers`            | List all taxpayers (id, name, taxTypes)          |
| GET    | `/api/risk/:taxpayerId`          | Full pre-computed risk profile for a taxpayer    |
| GET    | `/api/risk/:taxpayerId/history`  | Historical risk score snapshots for a taxpayer   |

---

## What to implement

Do not modify existing endpoints in `src/risk/`. You may add new ones.

---

### Story 1: Data foundation `~20 min`

The team needs three Mongoose schemas to connect the application to MongoDB. Without them nothing compiles.

Define the schemas below in `src/database/schemas/` following the `@Prop` / `@Schema` / `SchemaFactory.createForClass` pattern in `taxpayer.schema.ts`.

**`blocked-rut.schema.ts`**, collection `blocked_ruts`

```typescript
{ rut: string; reason: string; flaggedAt: Date }
```

Export: `BlockedRut`, `BlockedRutDocument`, `BlockedRutSchema`.

---

**`invoice.schema.ts`**, collection `invoices`

```typescript
{
  taxpayerId: string
  folio: string
  type: 'EMITIDA' | 'RECIBIDA'
  rutCounterpart: string
  counterpartName: string
  amount: number
  date: Date
  status: 'VIGENTE' | 'ANULADA' | 'PENDIENTE'
  firstSeenAt: Date
  lastUpdatedAt: Date
}
```

Add a compound unique index on `{ taxpayerId, folio }`. Enums are in `src/types/invoices.ts`.

Export: `Invoice`, `InvoiceDocument`, `InvoiceSchema`.

---

**`monitoring-config.schema.ts`**, collection `monitoring_configs`

```typescript
{
  taxpayerId: string
  active: boolean
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  startHour: number
  endHour: number
  dayOfWeek: number | null
  dayOfMonth: number | null
  queryCount: number
  lastExecutedAt: Date | null
  nextScheduledAt: Date | null
}
```

Export: `MonitoringConfig`, `MonitoringConfigDocument`, `MonitoringConfigSchema`.

**Acceptance criteria:** TypeScript compiles without errors and the model tokens resolve in `MongooseModule.forFeature`.

---

### Story 2: Invoice explorer `~65 min`

A tax analyst needs to browse a taxpayer's invoices and immediately see which ones involve counterparts on the SII blocked list, always current.

**`GET /api/invoices/:taxpayerId`**

Query params (both optional): `type` (`EMITIDA` | `RECIBIDA`), `status` (`VIGENTE` | `ANULADA` | `PENDIENTE`)

```json
{
  "data": [
    {
      "taxpayerId": "TP001",
      "folio": "F-TP001-00002",
      "type": "EMITIDA",
      "rutCounterpart": "80567890-1",
      "counterpartName": "Empresa con observaciones SII",
      "amount": 4017495,
      "date": "2026-05-21T00:00:00.000Z",
      "status": "VIGENTE",
      "siiRisk": true,
      "firstSeenAt": "2026-05-21T00:00:00.000Z",
      "lastUpdatedAt": "2026-05-21T00:00:00.000Z"
    }
  ],
  "totals": {
    "emitidas": { "count": 3, "amount": 20614029 },
    "recibidas": { "count": 3, "amount": 18913233 },
    "atRisk": 3
  }
}
```

**Acceptance criteria:**

- `siiRisk` reflects the current `blocked_ruts` collection at the moment of the request; it is never stored on the invoice
- `totals` always reflect the full taxpayer invoice set regardless of active filters
- `404` when the taxpayer does not exist

Files: `src/invoices/dto/invoice-query.dto.ts`, `src/invoices/invoices.service.ts`, `src/invoices/invoices.controller.ts`, `src/invoices/invoices.module.ts`

---

### Story 3: Risk exposure `~35 min`

The analyst already has a risk profile with pre-computed scores from the `taxpayers` collection. What it does not have is a live view of invoice-level exposure: how many of this taxpayer's invoices involve counterparts currently on the blocked list, what total amount is at stake, and what risk tier that represents. This endpoint computes that on the fly from the `invoices` and `blocked_ruts` collections, so it reflects the current blocked list without any stored state.

**`GET /api/risk/:taxpayerId/exposure`**

```json
{
  "taxpayerId": "TP001",
  "totalInvoices": 6,
  "atRiskCount": 3,
  "atRiskAmount": 12500000,
  "atRiskRate": 0.5,
  "riskLevel": "HIGH"
}
```

**Acceptance criteria:**

- Metrics are derived from the live `invoices` and `blocked_ruts` collections at query time
- `riskLevel` is a tiered classification of your own design based on `atRiskRate`
- `404` when the taxpayer does not exist
- Lives in `src/risk/`; extend the existing module, do not change existing endpoints

---

### Story 4: Monitoring config `~45 min`

The system needs to expose a taxpayer's monitoring configuration. In read-only mode no config will ever be stored, so the endpoint must return a sensible default when none exists.

**`GET /api/monitoring/:taxpayerId`**

```json
{
  "taxpayerId": "TP001",
  "active": false,
  "frequency": "DAILY",
  "startHour": 8,
  "endHour": 9,
  "dayOfWeek": null,
  "dayOfMonth": null,
  "queryCount": 0,
  "lastExecutedAt": null,
  "nextScheduledAt": null
}
```

**Acceptance criteria:**

- Returns the stored config when one exists; returns the default above when it doesn't
- No database write occurs when falling back to the default
- `404` when the taxpayer does not exist

Files: `src/monitoring/monitoring.service.ts`, `src/monitoring/monitoring.controller.ts`, `src/monitoring/monitoring.module.ts`

---

## Bonus tasks

### Bonus A: Unit tests `~40 min`

Add unit tests for `InvoicesService`, `RiskService.getExposure`, and `MonitoringService` following `src/risk/risk.service.spec.ts`. Mock Mongoose models with `getModelToken`.

Required coverage:

- `getInvoicesForTaxpayer`: dynamic `siiRisk` from `blocked_ruts`, unfiltered totals when a type filter is active, 404 case
- `getExposure`: correct `atRiskCount`/`atRiskAmount`, `riskLevel` threshold logic, 404 case
- `getConfig`: existing config returned, default returned without a DB write, 404 case

### Bonus B: E2E tests `~30 min`

Add e2e tests following `test/risk.e2e-spec.ts`. Use `createE2eApp` from `test/e2e-app.ts`.

Required coverage:

- `GET /api/invoices/:taxpayerId` with a blocked RUT counterpart returns `siiRisk: true`
- `GET /api/invoices/:taxpayerId?type=EMITIDA` returns filtered `data` but unfiltered `totals`
- `GET /api/risk/:taxpayerId/exposure` returns correct metrics and `riskLevel`
- `GET /api/monitoring/:taxpayerId` returns the default config when none is stored

---

## Evaluation criteria

Working endpoints are the baseline. Beyond that:

| Area               | What we look for                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Modularization** | Services hold business logic, controllers handle only HTTP concerns, modules declare only what they own |
| **Patterns**       | Consistent with the risk module: lean queries, guard clauses, constructor injection                     |
| **Git usage**      | Frequent commits with clear messages; one logical unit of work per commit                               |
| **Type safety**    | Use types from `src/types/` rather than `any`; avoid casting                                            |
| **Tests**          | Mocks are minimal and purposeful; tests cover business rules, not just happy paths                      |

---

## Scripts

| Command             | Description |
| ------------------- | ----------- |
| `npm run start:dev` | Dev server  |
| `npm run build`     | Compile     |
| `npm run test`      | Unit tests  |
| `npm run test:e2e`  | E2E tests   |

---

## Project structure

```text
src/
├── database/schemas/
│   ├── taxpayer.schema.ts           provided (schema pattern reference)
│   ├── blocked-rut.schema.ts        implement this
│   ├── invoice.schema.ts            implement this
│   └── monitoring-config.schema.ts  implement this
├── common/             # mongo-errors helper
├── config/             # DB_READ_ONLY helpers
├── types/              # Shared TypeScript types (do not modify)
├── risk/               # Reference implementation; extend, do not modify existing endpoints
├── invoices/           # Implement this
└── monitoring/         # Implement this
test/                   # E2E specs
```

---

## License & Contributing

This repository is provided for assessment purposes only.

To submit your solution:

1. Clone this repository to your own GitHub account
2. Implement the tasks on a dedicated branch
3. Share repository access with [@ofvera](https://github.com/ofvera) when ready for review