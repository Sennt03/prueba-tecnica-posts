# Prueba Técnica Frontend - Abitmedia

## Descripción del proyecto

Esta aplicación fue desarrollada con **Angular 20**, **Node.js v22.19.0** y **CSS puro**, cumpliendo con todos los requerimientos solicitados en la prueba.  

Se han aplicado varias prácticas modernas de Angular y arquitectura limpia:

- **Angular 20 Signals + Zoneless**: Configurada sin `zone.js`, usando **signals** para la detección de cambios.
- **Internacionalización (i18n)**: Configurada en modo desarrollo, levantando un `ng serve` por idioma (`es`, `en`, `fr`).  
- **Proxy Angular**: Debido a limitaciones del backend (CORS), se utiliza un **proxy de Angular** (`frontend/proxy-conf.json` y configurado en `angular.json`) para redirigir las peticiones.
- **Short Imports**: Configuración en `tsconfig.json` para importar con alias (`@services/...`) en lugar de rutas relativas largas. 
- **Interceptors**:
  - `AuthInterceptor` → Adjunta automáticamente el token en cada petición.  
  - `SessionHandlerInterceptor` → Maneja el estado de sesión; si el backend responde `401`, se cierra la sesión.  
- **Autenticación**:
  - Formularios **reactivos** con validaciones instantáneas, grupales y personalizadas para login y registro.  
- **Arquitectura por features**:
  - `features/` → Módulos principales como `home` y `auth`.  
  - `core/` → Servicios, modelos y lógica central.  
  - `shared/` → Componentes reutilizables, pipes, directivas y utilidades.  
- **Utilidades y componentes reutilizables**:
  - `shared/utils/toastr.ts` → Configuración tipada para usar `toastr` fácilmente en Angular.  
  - `shared/components/loading/` → Componente de máscara de carga controlado por un **signal**, utilizable globalmente.  
- **Tipado estricto en servicios**:  
  - Todos los modelos (`core/models`) tipan las peticiones y respuestas, asegurando autocompletado y seguridad en tiempo de desarrollo.  
- **Lazy Loading**: Configuración de módulos bajo demanda para mejorar rendimiento (Junto con estrategia de precarga).   
- **UI/UX**: Diseño simple, limpio y funcional, con enfoque en responsividad y usabilidad.  
- **Test**: Incluye la configuracion y algunos test unitarios.

La entrega incluye un **Dockerfile unificado**, que levanta tanto el backend como el frontend en un solo contenedor, simplificando la ejecución.

---

## Requisitos del proyecto

- Angular **20+**
- Node.js **v22.19.0**
- Java **24+** para el backend
- Docker (última versión recomendada)

---

## Instrucciones para ejecutar la aplicación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Sennt03/prueba-tecnica-posts
cd prueba-tecnica-posts
```

Asegúrate de tener Docker instalado y en ejecución:
### Con Docker Compose
```bash
docker compose up --build
```

### Manual (Sin Docker Composer)
```bash
docker build -t prueba-frontend .
docker run --name prueba-frontend -p 8080:8080 -p 4201:4201 -p 4202:4202 -p 4203:4203 prueba-frontend
```

Backend → http://localhost:8080

Frontend → http://localhost:4201 -> es
           http://localhost:4202 -> en
           http://localhost:4203 -> fr


## Notas sobre internacionalización (i18n)

En este proyecto cada idioma se levanta en un puerto distinto (ES: 4201, EN: 4202, FR: 4203).
Esto se debe a que el backend entregado presenta problemas de CORS, lo que impide usar Angular en modo producción con ng build.
En un entorno sin esta limitación, lo ideal sería generar los builds de cada idioma y servirlos desde un servidor o proxy inverso (Node.js, Nginx o Apache), redirigiendo las rutas /es, /en y /fr a sus respectivas carpetas de compilación (dist/es, dist/en, dist/fr).

## Ejecutar los test
Para ejecutar los text asegurate de tener:
- node v22+ instalado
- npm 10.9.3+

Ubicate dentro de la carpeta frontend y ejecuta:

```bash
npm i
ng test
```