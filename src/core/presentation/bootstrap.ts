import { ensureContainer, getContainer } from '../composition';

ensureContainer();

// Register custom elements
import './features/cart';

export { getContainer };
