// src/risk/risk.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiskService } from './risk.service';
import { Taxpayer } from '../database/schemas/taxpayer.schema';
import { mockTaxpayerData, mockTaxpayerHistory } from './test/mock-data';

describe('RiskService', () => {
  let service: RiskService;
  let model: Model<Taxpayer>;

  const mockModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskService,
        {
          provide: getModelToken(Taxpayer.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<RiskService>(RiskService);
    model = module.get<Model<Taxpayer>>(getModelToken(Taxpayer.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTaxpayerRisk', () => {
    it('should return taxpayer risk data', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        lean: () => Promise.resolve(mockTaxpayerData),
      } as any);

      const result = await service.getTaxpayerRisk('TP001');
      expect(result).toEqual(mockTaxpayerData);
      expect(model.findOne).toHaveBeenCalledWith(
        { 'taxpayer.id': 'TP001' },
        { __v: 0, _id: 0 },
      );
    });

    it('should return null when taxpayer not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        lean: () => Promise.resolve(null),
      } as any);

      const result = await service.getTaxpayerRisk('INVALID');
      expect(result).toBeNull();
    });
  });

  describe('getRiskHistory', () => {
    it('should return taxpayer history', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        lean: () => Promise.resolve({ history: mockTaxpayerHistory }),
      } as any);

      const result = await service.getRiskHistory('TP001');
      expect(result).toEqual(mockTaxpayerHistory);
      expect(model.findOne).toHaveBeenCalledWith(
        { 'taxpayer.id': 'TP001' },
        { history: 1, _id: 0 },
      );
    });

    it('should return null when no history found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        lean: () => Promise.resolve(null),
      } as any);

      const result = await service.getRiskHistory('INVALID');
      expect(result).toBeNull();
    });
  });

  describe('taxpayerExists', () => {
    it('should return true when taxpayer exists', async () => {
      mockModel.countDocuments.mockReturnValueOnce({
        exec: () => Promise.resolve(1),
      });

      const result = await service.taxpayerExists('TP001');
      expect(result).toBe(true);
      expect(mockModel.countDocuments).toHaveBeenCalledWith({
        'taxpayer.id': 'TP001',
      });
    });

    it('should return false when taxpayer does not exist', async () => {
      mockModel.countDocuments.mockReturnValueOnce({
        exec: () => Promise.resolve(0),
      });

      const result = await service.taxpayerExists('INVALID');
      expect(result).toBe(false);
    });
  });

  describe('getAllTaxpayers', () => {
    it('should return all taxpayers basic info', async () => {
      const mockTaxpayers = [
        { taxpayer: { id: 'TP001', name: 'Test Corp', taxTypes: ['VAT'] } },
        { taxpayer: { id: 'TP002', name: 'Test Inc', taxTypes: ['VAT'] } },
      ];

      jest.spyOn(model, 'find').mockReturnValueOnce({
        lean: () => Promise.resolve(mockTaxpayers),
      } as any);

      const result = await service.getAllTaxpayers();
      expect(result).toEqual(mockTaxpayers.map((t) => t.taxpayer));
      expect(model.find).toHaveBeenCalledWith({}, { taxpayer: 1, _id: 0 });
    });
  });
});
