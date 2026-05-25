export type InvoiceType = 'EMITIDA' | 'RECIBIDA';

export type InvoiceStatus = 'VIGENTE' | 'ANULADA' | 'PENDIENTE';

export type MonitoringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type AlertType = 'NEW' | 'CHANGED' | 'SII_RISK';

export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH';

export interface RawSiiInvoice {
  rutCounterpart: string;
  counterpartName: string;
  amount: number;
  date: string;
  folio: string;
  type: InvoiceType;
  status: InvoiceStatus;
}

export interface AlertEntry {
  type: AlertType;
  severity: AlertSeverity;
  detectedAt: Date;
  detail: string;
}

export const INVOICE_TYPES: InvoiceType[] = ['EMITIDA', 'RECIBIDA'];

export const INVOICE_STATUSES: InvoiceStatus[] = [
  'VIGENTE',
  'ANULADA',
  'PENDIENTE',
];

export const MONITORING_FREQUENCIES: MonitoringFrequency[] = [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
];

export const ALERT_TYPES: AlertType[] = ['NEW', 'CHANGED', 'SII_RISK'];

export const ALERT_SEVERITIES: AlertSeverity[] = ['INFO', 'WARNING', 'HIGH'];
