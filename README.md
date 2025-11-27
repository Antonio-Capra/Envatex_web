# 🌿 Envatex Web

> Sistema de gestión de productos y cotizaciones para Envatex

## 📋 Descripción

Aplicación web fullstack desarrollada con **React** (frontend) y **Flask** (backend) para la gestión de productos y generación de cotizaciones de manera eficiente y profesional.

## 🚀 Tecnologías

### Frontend
- ⚛️ **React 18** - Interfaz de usuario moderna y reactiva
- 🎨 **Bootstrap 5** - Diseño responsive
- 🔄 **Axios** - Peticiones HTTP
- 🎯 **React Router** - Navegación SPA

### Backend
- 🐍 **Flask** - Framework web Python
- 🗄️ **SQLAlchemy** - ORM para base de datos
- 🔐 **JWT** - Autenticación segura
- ☁️ **Cloudinary** - Almacenamiento de imágenes

## 📁 Estructura del Proyecto

```
Envatex_web/
├── 📄 README.md          
├── 📘 docs/              # Documentación del proyecto
│   └── INICIO_RAPIDO.md
├── 🔧 scripts/           # Scripts de utilidad
│   ├── start-backend.sh
│   └── start-frontend.sh
├── 🐍 backend/           # API Flask
│   ├── app.py           # Configuración de la app
│   ├── models.py        # Modelos de datos
│   ├── api/routes.py    # Endpoints
│   └── Makefile         # Comandos rápidos
└── ⚛️ frontend/          # Aplicación React
    ├── src/
    │   ├── components/  # Componentes React
    │   └── pages/       # Páginas principales
    └── public/
```

## ⚡ Inicio Rápido

### 1️⃣ Instalación

```bash
npm run install
```

### 2️⃣ Iniciar Backend

```bash
./scripts/start-backend.sh
```

Backend disponible en: http://localhost:5000

### 3️⃣ Iniciar Frontend

```bash
./scripts/start-frontend.sh
```

Frontend disponible en: http://localhost:3000

> 📖 Para más detalles, consulta la [Guía de Inicio Rápido](docs/INICIO_RAPIDO.md)

## 🔐 Seguridad

- ❌ **NO subir** archivos `.env` a Git
- ✅ Credenciales protegidas en archivos `.env`
- ✅ `.gitignore` configurado correctamente

## 📝 Características

- ✨ Panel de administración completo
- 📦 Gestión de productos con imágenes
- 📋 Sistema de cotizaciones
- 🔐 Autenticación JWT
- 📱 Diseño responsive
- ☁️ Integración con Cloudinary

## 👥 Desarrollo

```bash
# Backend
cd backend
make install  # Instalar dependencias
make start    # Iniciar servidor
make dev      # Modo desarrollo

# Frontend
cd frontend
npm install   # Instalar dependencias
npm start     # Servidor de desarrollo
npm run build # Build de producción
```

## 📄 Licencia

Proyecto privado - Envatex © 2025