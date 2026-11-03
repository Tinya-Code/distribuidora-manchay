import { Business, Cart, PricingMode, PricingService, TierPricingStrategy } from '../domain';
import { MemoryCartStorage, LocalStorageCartStorage, LocalStorageCustomerPrefs, LocalStorageLastOrder, SystemClock, RandomCodeGenerator, NullOrderGateway, NoopAnalytics, UrlCartCodec } from '../infrastructure';
import { MockOrderGateway, MockQuoteGateway, HttpOrderGateway, HttpQuoteGateway } from '../infrastructure';
import { CartStorage, CustomerPrefsStorage, LastOrderStorage, CatalogSource, OrderGateway, QuoteGateway, MessageFormatter, MessageChannel, CartCodec, Clock, CodeGenerator, Analytics, RepeatLastOrder } from '../application';
import { CartStore } from './CartStore';
import { PricingModeStore } from './PricingModeStore';

export interface ContainerConfig {
  business: Business;
  catalog: CatalogSource;
  cartStorage?: CartStorage;
  customerPrefsStorage?: CustomerPrefsStorage;
  lastOrderStorage?: LastOrderStorage;
  orderGateway?: OrderGateway;
  quoteGateway?: QuoteGateway;
  messageFormatter?: MessageFormatter;
  messageChannel?: MessageChannel;
  cartCodec?: CartCodec;
  clock?: Clock;
  codeGenerator?: CodeGenerator;
  analytics?: Analytics;
}

export interface Container {
  business: Business;
  catalog: CatalogSource;
  cart: Cart;
  cartStorage: CartStorage;
  customerPrefsStorage: CustomerPrefsStorage;
  lastOrderStorage: LastOrderStorage;
  orderGateway: OrderGateway;
  quoteGateway: QuoteGateway;
  messageFormatter: MessageFormatter;
  messageChannel: MessageChannel;
  cartCodec: CartCodec;
  clock: Clock;
  codeGenerator: CodeGenerator;
  analytics: Analytics;
  cartStore: CartStore;
  pricingModeStore: PricingModeStore;
  pricingService: PricingService;
  repeatLastOrder: RepeatLastOrder;
}

export function buildContainer(config: ContainerConfig): Container {
  const cartStorage = config.cartStorage ?? new LocalStorageCartStorage();
  const customerPrefsStorage = config.customerPrefsStorage ?? new LocalStorageCustomerPrefs();
  const lastOrderStorage = config.lastOrderStorage ?? new LocalStorageLastOrder();

  const pricingService = new PricingService(new TierPricingStrategy());

  // Bandera de mock de API: usa validación en memoria contra los datos del sitio.
  // Se activa con features.apiMock en tenant.config. El mock no necesita red real.
  const useMock = config.business.features.apiMock === true;
  const orderGateway = config.orderGateway
    ?? (useMock ? new MockOrderGateway(config.catalog, pricingService) : new NullOrderGateway());
  const quoteGateway = config.quoteGateway
    ?? (useMock ? new MockQuoteGateway(config.catalog, pricingService) : ({} as QuoteGateway));

  const messageFormatter = config.messageFormatter ?? ({} as MessageFormatter);
  const messageChannel = config.messageChannel ?? ({} as MessageChannel);
  const cartCodec = config.cartCodec ?? new UrlCartCodec();
  const clock = config.clock ?? new SystemClock();
  const codeGenerator = config.codeGenerator ?? new RandomCodeGenerator();
  const analytics = config.analytics ?? new NoopAnalytics();

  const cart = new Cart();
  const loadedCart = cartStorage.load();
  if (loadedCart) {
    for (const line of loadedCart.getLines()) {
      cart.add(line.productId, line.presentationId, line.quantity);
    }
  }

  const cartStore = new CartStore(cart, cartStorage);
  const pricingModeStore = new PricingModeStore(customerPrefsStorage);
  const repeatLastOrder = new RepeatLastOrder(cart, lastOrderStorage, cartStorage);

  return {
    business: config.business,
    catalog: config.catalog,
    cart,
    cartStorage,
    customerPrefsStorage,
    lastOrderStorage,
    orderGateway,
    quoteGateway,
    messageFormatter,
    messageChannel,
    cartCodec,
    clock,
    codeGenerator,
    analytics,
    cartStore,
    pricingModeStore,
    pricingService,
    repeatLastOrder,
  };
}
