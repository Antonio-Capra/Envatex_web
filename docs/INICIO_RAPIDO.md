# 🚀 Guía de Inicio Rápido - Envatex Web

## 📦 Instalación Inicial (Una sola vez)

Desde la raíz del proyecto:

```bash
npm run install
```

O instalar cada parte por separado:

```bash
# Backend
npm run install:backend

# Frontend
npm run install:frontend
```

---

## ▶️ Iniciar la Aplicación (Desde la raíz del proyecto)

### **Backend (Flask):**

```bash
./scripts/start-backend.sh
```

El servidor estará en: `http://localhost:5000`

---

### **Frontend (React):**

```bash
./scripts/start-frontend.sh
```

La aplicación estará en: `http://localhost:3000`

---

### **Alternativas (desde subdirectorios):**

**Backend:**
```bash
cd backend
pipenv run start
```

**Frontend:**
```bash
cd frontend
npm start
```

---

## 🔐 Credenciales de Administrador

Para obtener las credenciales de desarrollo, consulta con el equipo o revisa la documentación interna.

> ⚠️ **Nota de Seguridad:** Las credenciales NO deben estar en archivos versionados. Se encuentran en los archivos `.env` que están protegidos por `.gitignore`.

---

## 📁 Estructura del Proyecto

```
Envatex_web/
├── 📄 README.md
├── 📁 docs/               # Documentación
│   └── INICIO_RAPIDO.md
├── 🔧 scripts/            # Scripts de utilidad
│   ├── start-backend.sh
│   └── start-frontend.sh
├── 🐍 backend/            # API Flask
│   ├── app.py
│   ├── models.py
│   ├── .env            # Variables de entorno (NO subir a Git)
│   ├── requirements.txt
│   ├── Makefile        # Comandos rápidos
│   └── Pipfile
├── ⚛️ frontend/           # App React
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json        # Scripts del proyecto
└── .gitignore
```

---

## ⚙️ Comandos Útiles

### Backend:
```bash
make install    # Instalar dependencias
make start      # Iniciar servidor
make dev        # Iniciar en modo debug
```

### Frontend:
```bash
npm install     # Instalar dependencias
npm start       # Iniciar servidor de desarrollo
npm run build   # Crear build de producción
```

---

## 🔒 Seguridad

- ❌ **NO subir** el archivo `.env` a Git
- ✅ Las claves sensibles están en `.env`
- ✅ El archivo `.gitignore` protege archivos sensibles

---

## 📝 Notas

- El backend corre en el puerto **5000**
- El frontend corre en el puerto **3000**
- Asegúrate de tener Python 3.12+ y Node.js instalados
