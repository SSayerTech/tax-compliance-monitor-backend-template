import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { Taxpayer } from '../src/database/schemas/taxpayer.schema';
import { BlockedRut } from '../src/database/schemas/blocked-rut.schema';
import { Invoice } from '../src/database/schemas/invoice.schema';
import { MonitoringConfig } from '../src/database/schemas/monitoring-config.schema';
import { MonitoringScheduler } from '../src/monitoring/monitoring.scheduler';

export const taxpayerMock = {
  findOne: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
};

export const invoiceMock = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

export const blockedRutMock = {
  find: jest.fn(),
};

export const monitoringConfigMock = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export async function createE2eApp(
  options: { dbReadOnly?: boolean } = {},
): Promise<INestApplication> {
  process.env.DB_READ_ONLY = options.dbReadOnly === false ? 'false' : 'true';
  process.env.MONGODB_URI =
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
  process.env.MONGODB_DB_NAME =
    process.env.MONGODB_DB_NAME ?? 'tax-monitor-test-e2e';

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getModelToken(Taxpayer.name))
    .useValue(taxpayerMock)
    .overrideProvider(getModelToken(Invoice.name))
    .useValue(invoiceMock)
    .overrideProvider(getModelToken(BlockedRut.name))
    .useValue(blockedRutMock)
    .overrideProvider(getModelToken(MonitoringConfig.name))
    .useValue(monitoringConfigMock)
    .overrideProvider(MonitoringScheduler)
    .useValue({ runScheduledQueries: jest.fn() })
    .overrideProvider(ConfigService)
    .useValue({
      get: (key: string, defaultValue?: string) => {
        if (key === 'DB_READ_ONLY') {
          return options.dbReadOnly === false ? 'false' : 'true';
        }
        if (key === 'MONGODB_URI') {
          return process.env.MONGODB_URI ?? defaultValue;
        }
        if (key === 'MONGODB_DB_NAME') {
          return process.env.MONGODB_DB_NAME ?? defaultValue;
        }
        return process.env[key] ?? defaultValue;
      },
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  await app.init();
  return app;
}

export function mockTaxpayerExists(exists = true) {
  taxpayerMock.countDocuments.mockReturnValue({
    exec: () => Promise.resolve(exists ? 1 : 0),
  });
}

export function mockBlockedRuts(ruts: string[] = []) {
  blockedRutMock.find.mockReturnValue({
    select: () => ({
      lean: () => ({
        exec: () => Promise.resolve(ruts.map((rut) => ({ rut }))),
      }),
    }),
  });
}
