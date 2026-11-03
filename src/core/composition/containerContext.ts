import { Container, buildContainer } from './buildContainer';
import business from '../../tenant/tenant.config';
import catalog from '../../tenant/catalog';
import { Business, BusinessHours } from '../../core/domain';

let current: Container | null = null;

export function setContainer(container: Container): void {
  current = container;
}

export function getContainer(): Container {
  if (!current) throw new Error('Container not initialized');
  return current;
}

export function hasContainer(): boolean {
  return current !== null;
}

export function ensureContainer(): Container {
  if (!current) {
    const b = new Business({
      name: business.identity.name,
      phone: business.contact.phone,
      whatsapp: business.contact.whatsapp,
      address: business.contact.address,
      hours: new BusinessHours({
        openTime: business.hours.open,
        closeTime: business.hours.close,
        days: business.hours.days,
        cutoffTime: business.hours.cutoff,
      }),
      features: business.features,
    });
    current = buildContainer({ business: b, catalog });
  }
  return current;
}
