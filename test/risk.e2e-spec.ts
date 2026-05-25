// test/risk.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  mockTaxpayerData,
  mockTaxpayerHistory,
} from '../src/risk/test/mock-data';
import { createE2eApp, taxpayerMock } from './e2e-app';

describe('RiskController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/risk/taxpayers', () => {
    it('returns list of taxpayers', () => {
      const mockTaxpayers = [
        { taxpayer: { id: 'TP001', name: 'Test Corp', taxTypes: ['VAT'] } },
        { taxpayer: { id: 'TP002', name: 'Test Inc', taxTypes: ['VAT'] } },
      ];
      taxpayerMock.find.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockTaxpayers),
      });

      return request(app.getHttpServer())
        .get('/api/risk/taxpayers')
        .expect(200)
        .expect(mockTaxpayers.map((t) => t.taxpayer));
    });
  });

  describe('GET /api/risk/:taxpayerId', () => {
    it('returns taxpayer risk data', () => {
      taxpayerMock.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockTaxpayerData),
      });

      return request(app.getHttpServer())
        .get('/api/risk/TP001')
        .expect(200)
        .expect(mockTaxpayerData);
    });

    it('returns 404 for non-existent taxpayer', () => {
      taxpayerMock.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      return request(app.getHttpServer()).get('/api/risk/INVALID').expect(404);
    });
  });

  describe('GET /api/risk/:taxpayerId/history', () => {
    it('returns taxpayer history', () => {
      taxpayerMock.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ history: mockTaxpayerHistory }),
      });

      return request(app.getHttpServer())
        .get('/api/risk/TP001/history')
        .expect(200)
        .expect(mockTaxpayerHistory);
    });
  });
});
