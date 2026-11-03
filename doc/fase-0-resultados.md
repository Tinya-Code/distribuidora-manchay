# Fase 0 — Resultados de prueba técnica

Fecha: 2026-11-02

## Objetivo

Confirmar que Astro permite todo lo que el diseño necesita desde un paquete, antes de construir nada.

## Resultados por verificación

### 1. ✅ Crear un paquete de juguete con dos componentes .astro y un archivo TypeScript

**Estado:** OK

**Detalles:**

- Se creó el paquete `test-astro-package` con:
  - `components/Card.astro` - componente con props y estilos
  - `components/Button.astro` - componente con props y estilos
  - `utils/math.ts` - archivo TypeScript con funciones exportadas
- package.json configurado con exports para cada archivo

**Conclusión:** Astro permite empaquetar componentes .astro y archivos TypeScript sin necesidad de compilar previamente.

---

### 2. ✅ Verificar que un paquete puede entregar componentes .astro y archivos TypeScript sin compilar

**Estado:** OK

**Detalles:**

- El paquete se empaquetó con `npm pack` (tgz)
- Se instaló en el sitio de prueba con `pnpm add test-astro-package-0.0.1.tgz`
- El sitio importó los componentes y TypeScript desde el paquete:

  ```astro
  import Card from 'test-astro-package/components/Card.astro';
  import Button from 'test-astro-package/components/Button.astro';
  import { greet, add } from 'test-astro-package';
  ```

- La construcción con `astro build` fue exitosa
- El HTML generado contiene los estilos de los componentes y los valores calculados por TypeScript

**Conclusión:** Los archivos .astro y TypeScript se procesan directamente desde el paquete sin compilación previa. Astro los trata como si fueran locales.

---

### 3. ✅ Verificar que una integración puede registrar rutas (injectRoute) cuyas páginas viven en el paquete

**Estado:** OK

**Detalles:**

- Se creó una integración en el paquete que usa `injectRoute`:

  ```ts
  injectRoute({
    pattern: '/test-page',
    entrypoint: join(__dirname, 'pages/TestPage.astro'),
  });
  ```

- El entrypoint debe ser una ruta absoluta (resuelta con `__dirname` de la integración)
- Astro generó exitosamente la ruta `/test-page/index.html`
- La página se inyectó correctamente desde el paquete

**Conclusión:** Las integraciones pueden registrar rutas cuyas páginas viven en el paquete. Es necesario usar rutas absolutas para el entrypoint.

---

### 4. ✅ Verificar que esas páginas pueden leer las colecciones de contenido del proyecto que las usa

**Estado:** OK

**Detalles:**

- El sitio de prueba definió una colección `blog` en `src/content.config.ts`
- Se creó un post de prueba en `src/content/blog/test-post.md`
- La página del paquete importó `getCollection` de `astro:content`:

  ```astro
  import { getCollection } from 'astro:content';
  const blogPosts = await getCollection('blog');
  ```

- La construcción fue exitosa
- El HTML generado muestra el contenido del post del sitio

**Conclusión:** Las páginas inyectadas desde el paquete pueden leer las colecciones de contenido del sitio que las usa. No hay restricción de acceso.

---

### 5. ✅ Verificar que un módulo virtual puede entregarle al paquete la configuración del cliente

**Estado:** OK

**Detalles:**

- Se creó un plugin Vite en la integración que provee un módulo virtual:

  ```ts
  const VIRTUAL_MODULE_ID = 'virtual:tenant-config';
  // Plugin con resolveId y load para inyectar el contenido
  ```

- El módulo virtual exporta configuración de ejemplo:

  ```ts
  export const tenantConfig = {
    name: 'Test Tenant',
    theme: { primaryColor: '#0070f3' },
  };
  ```

- La página del paquete importó el módulo virtual:

  ```astro
  import { tenantConfig } from 'virtual:tenant-config';
  ```

- Se agregó la declaración de tipos en `src/env.d.ts` del sitio:

  ```ts
  declare module 'virtual:tenant-config' { ... }
  ```

- La construcción fue exitosa
- El HTML generado muestra los valores del módulo virtual

**Conclusión:** Los módulos virtuales pueden entregar configuración del cliente al paquete. La integración debe registrar el plugin Vite y el sitio debe declarar los tipos TypeScript.

---

### 6. ✅ Verificar que el paquete se instala de forma local (pnpm link o npm pack) y funciona igual que desde el registro

**Estado:** OK

**Detalles:**

- `pnpm link --global` falló por configuración de PATH del sistema
- Se usó `npm pack` + `pnpm add <tarball>` como alternativa
- Cada iteración se empaquetó y reinstaló correctamente
- Todas las funcionalidades probadas funcionaron tras cada reinstalación

**Conclusión:** `npm pack` + instalación local funciona correctamente y es equivalente a instalar desde el registro. `pnpm link` podría funcionar con configuración PATH adecuada pero no es necesario.

---

## Decisiones tomadas

### Arquitectura de paquete

1. **Módulos virtuales para configuración:** Usar módulos virtuales (`virtual:tenant-config`) para que el core reciba la configuración del tenant sin importar directamente de `src/tenant/`. Esto cumple la regla "core nunca importa de tenant".

2. **Integración centralizada:** Toda la configuración del core (rutas, módulos virtuales, plugins Vite) se hace desde una sola integración exportada por el paquete.

3. **Rutas absolutas en injectRoute:** Cuando el core inyecte rutas, el entrypoint debe resolverse con `__dirname` de la integración para funcionar correctamente.

4. **Declaración de tipos:** El sitio debe declarar los tipos de los módulos virtuales en `src/env.d.ts` para tener autocomplete y type safety.

### Instalación local

- **Usar npm pack:** Para desarrollo local, usar `npm pack` + `pnpm add <tarball>` en lugar de `pnpm link`. Es más portable y menos propenso a errores de configuración.

### Sin ajustes necesarios

- **No requiere cambios al diseño:** Todas las capacidades requeridas por el plan funcionan según lo diseñado. No se encontraron restricciones ni limitaciones de Astro que obliguen a ajustar la arquitectura propuesta.

---

## Archivos de prueba

La prueba completa está en `/tmp/astro-package-test/`:

- `test-package/` - Paquete de juguete con componentes, integración y páginas
- `test-site/` - Sitio Astro mínimo que usa el paquete

Los archivos clave de la prueba:

- `test-package/integration.ts` - Ejemplo de integración con injectRoute y módulo virtual
- `test-package/pages/TestPage.astro` - Ejemplo de página que lee contenido y config virtual
- `test-site/src/env.d.ts` - Ejemplo de declaración de tipos para módulo virtual

---

## Conclusión final

**Fase 0 completada exitosamente.** Astro permite todas las capacidades necesarias para la arquitectura propuesta:

- ✅ Paquetes con componentes .astro y TypeScript sin compilar
- ✅ Integraciones que inyectan rutas desde el paquete
- ✅ Páginas del paquete que leen colecciones de contenido del sitio
- ✅ Módulos virtuales para inyectar configuración del cliente
- ✅ Instalación local funcional

**Siguiente paso:** Fase 1 - Esqueleto del proyecto y herramientas.
