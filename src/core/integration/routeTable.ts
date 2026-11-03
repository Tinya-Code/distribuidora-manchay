export interface RouteEntry {
  path: string;
  component: string;
}

export const routeTable: RouteEntry[] = [
  { path: '/', component: 'pages/HomePage.astro' },
  { path: '/catalogo', component: 'pages/CatalogPage.astro' },
  { path: '/carrito', component: 'pages/CartPage.astro' },
];
