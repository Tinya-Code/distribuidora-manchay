import { Cart } from '../domain';
import { AddToCart, ChangeQuantity, RemoveFromCart, ClearCart, CartStorage } from '../application';
import { Store } from './Store';
import { ProductId, PresentationId } from '../domain';

export class CartStore extends Store<Cart> {
  private readonly add: AddToCart;
  private readonly change: ChangeQuantity;
  private readonly remove: RemoveFromCart;
  private readonly clearCart: ClearCart;

  constructor(cart: Cart, storage: CartStorage) {
    super(cart);
    this.add = new AddToCart(cart, storage);
    this.change = new ChangeQuantity(cart, storage);
    this.remove = new RemoveFromCart(cart, storage);
    this.clearCart = new ClearCart(cart, storage);
  }

  addToCart(productId: ProductId, presentationId: PresentationId, quantity = 1): void {
    this.add.execute(productId, presentationId, quantity);
    this.set(this.get());
  }

  changeQuantity(productId: ProductId, presentationId: PresentationId, quantity: number): void {
    this.change.execute(productId, presentationId, quantity);
    this.set(this.get());
  }

  removeFromCart(productId: ProductId, presentationId: PresentationId): void {
    this.remove.execute(productId, presentationId);
    this.set(this.get());
  }

  clear(): void {
    this.clearCart.execute();
    this.set(this.get());
  }
}
