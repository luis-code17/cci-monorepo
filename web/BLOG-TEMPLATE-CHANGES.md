# Plantilla de Blogs - Cambios Técnicos

## Resumen

Se ha creado un sistema completo de blogs con:
- ✅ **Listado de blogs** con autor y fecha
- ✅ **Página de detalle** con carrusel de imágenes
- ✅ **Soporte para múltiples imágenes**
- ✅ **Slug dinámico** para URLs amigables

## Archivos Modificados

### 1. **Contratos TypeScript** (`web/lib/contracts.ts`)

```typescript
// Nuevos tipos añadidos:
- WordPressAuthorNode // Información del autor
- WordPressPostQueryData // Query individual de post
- Campos: slug, author, mediaItems en WordPressPostNode
```

**Cambios**:
- Agregado `slug` para URLs dinámicas
- Agregado `author` con nombre del usuario
- Agregado `mediaItems` para galería de imágenes

### 2. **Queries GraphQL** (`web/lib/queries.ts`)

```graphql
// Nueva query:
WORDPRESS_SINGLE_POST_QUERY
- Obtiene UN post por slug
- Incluye todas las imágenes del post (mediaItems)

// Query existente mejorada:
WORDPRESS_BLOG_POSTS_QUERY
- Ahora trae: slug, author, featured image completa
```

### 3. **Mappers** (`web/lib/mappers.ts`)

```typescript
// Nuevo tipo:
export type BlogPost = {
  slug: string;           // Para URL dinámicas
  autor: string;          // Nombre del autor
  imagenes: CmsImage[];   // Array de imágenes
  // ... campos existentes
}

// Función mejorada:
mapPost() - procesa múltiples imágenes
```

### 4. **Componente BlogCard** (`web/components/blog-card.tsx`)

```tsx
// Cambios:
- Ahora es clickeable (Link a /blog/[slug])
- Muestra fecha + autor en el header
- Añadido hover effect mejorado
```

### 5. **Nuevo Componente ImageCarousel** (`web/components/image-carousel.tsx`)

```tsx
// Características:
- Carrusel de imágenes interactivo
- Botones ❮ ❯ para navegar
- Miniaturas para seleccionar imagen
- Contador de imágenes (ej: 1/5)
- Responsive (scroll en mobile)
```

### 6. **Nueva Página Dinámican** (`web/app/blog/[slug]/page.tsx`)

```
/blog/[slug]
├── Header con título, fecha, autor
├── Layout 2 columnas (lg y up)
│   ├── Izquierda: ImageCarousel (sticky)
│   └── Derecha: Contenido completo
└── Footer con botón volver
```

## Estructura de Datos

### En WordPress

Cada blog necesita:

```
Post (Entrada)
├── Title: Título del blog
├── Content: Contenido completo (HTML)
├── Excerpt: Descripción corta
├── Author: Usuario de WordPress
├── Featured Image: Imagen principal
├── Media Items: Galería de imágenes adicionales
└── Slug: URL amigable
```

### En Web

```typescript
BlogPost {
  id: number
  slug: string           // "mi-primer-blog"
  titulo: string         // "Mi Primer Blog"
  contenido: string      // HTML completo
  fechaPublicacion: string // "2026-05-11"
  autor: string          // "Luis García"
  imagen: CmsImage       // Imagen destacada
  imagenes: CmsImage[]   // Todas las imágenes
}
```

## Flujo de Datos

### Listado (`/blog`)

```
WordPress
  ↓
WORDPRESS_BLOG_POSTS_QUERY
  ↓
graphqlRequest()
  ↓
getBlogPosts() / mapPost()
  ↓
BlogCard[] (con Link a [slug])
```

### Detalle (`/blog/[slug]`)

```
URL: /blog/mi-primer-blog
  ↓
WORDPRESS_SINGLE_POST_QUERY { slug: "mi-primer-blog" }
  ↓
graphqlRequest()
  ↓
mapPost()
  ↓
[slug]/page.tsx
  ├── ImageCarousel (con post.imagenes)
  └── Contenido (post.contenido)
```

## Rutas

| Ruta | Componente | Descripción |
|------|-----------|------------|
| `/blog` | `app/blog/page.tsx` | Listado de blogs |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Detalle del blog |

## Requisitos en WordPress

- **Plugin WPGraphQL**: Necesario para GraphQL endpoint
- **Plugin WPGraphQL ACF**: Para campos personalizados (opcional)
- **Permalink**: Configurar como "Post name" (ver README.md)

## Caché

- **Listado**: 5 minutos (300 segundos)
- **Detalle**: No especificado (usa default)
- Modificable en `web/lib/api.ts` y `web/lib/wp.ts`

## Variables de Entorno

En `web/.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8000/graphql
```

## Ejemplo de Contenido HTML

WordPress genera HTML como:

```html
<p>Párrafo normal</p>
<h2>Subtítulo</h2>
<p>Más contenido</p>
<ul>
  <li>Punto 1</li>
  <li>Punto 2</li>
</ul>
```

La página renderiza con Tailwind CSS (clase `prose`).

## Testing

### Probar en local:

1. **Crear un blog en WordPress**:
   ```
   http://localhost:8000/wp-admin → Posts → Add New
   ```

2. **Ver en listado**:
   ```
   http://localhost:3000/blog
   ```

3. **Ver detalle**:
   ```
   http://localhost:3000/blog/mi-primer-blog
   ```

## Futuras Mejoras Posibles

- [ ] Categorías/Tags para blogs
- [ ] Relacionados (mostrar 3 blogs similares)
- [ ] Búsqueda/filtrado de blogs
- [ ] Comentarios (si WPGraphQL los soporta)
- [ ] Social sharing buttons
- [ ] Lectura estimada (tiempo de lectura)
- [ ] Breadcrumbs mejorados
- [ ] PWA: Guardar artículos offline
