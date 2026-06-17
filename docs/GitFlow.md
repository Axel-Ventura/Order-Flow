# Git Flow - OrderFlow


## Estructura de ramas

```text
main
│
└── develop
     │
     ├── feature/frontend
     ├── feature/backend
     ├── feature/database
     ├── feature/login
     └── feature/documentacion
```

### main

Contiene únicamente versiones estables y funcionales del proyecto.

**No se debe trabajar directamente en esta rama.**

---

### develop

Rama principal de desarrollo.

Todos los cambios realizados deberán integrarse primero en esta rama mediante Pull Requests.

---

### feature/*

Ramas temporales utilizadas para desarrollar funcionalidades específicas.

Ejemplos:

* feature/frontend
* feature/backend
* feature/database
* feature/login
* feature/pedidos

---

## Flujo de trabajo

### 1. Actualizar develop

```bash
git checkout develop
git pull
```

### 2. Crear una nueva rama

```bash
git checkout -b feature/nombre-funcionalidad
```

Ejemplo:

```bash
git checkout -b feature/login
```

### 3. Realizar cambios

```bash
git add 
git commit -m "feat: crear formulario login"
```

### 4. Subir la rama a GitHub

```bash
git push -u origin feature/login
```

### 5. Crear Pull Request

Todos los Pull Requests deberán dirigirse a:

```text
feature/* → develop
```

Ejemplo:

```text
feature/login → develop
```

### 6. Revisión y aprobación

El responsable revisará los cambios antes de realizar el merge.

### 7. Integración a main

Cuando una funcionalidad o conjunto de funcionalidades estén listas:

```text
develop → main
```

mediante Pull Request.

---

## Convención de commits

### feat

Nueva funcionalidad.

```text
feat: crear página login
```

### fix

Corrección de errores.

```text
fix: corregir validación de usuarios
```

### docs

Documentación.

```text
docs: actualizar README
```

### refactor

Reorganización del código sin cambiar funcionalidad.

```text
refactor: reorganizar estructura MVC
```

### style

Cambios visuales o de formato.

```text
style: mejorar diseño del dashboard
```

---

## Reglas del proyecto

* No realizar commits directamente en main.
* No realizar merges sin revisión.
* Crear una rama por funcionalidad.
* Utilizar Pull Requests para integrar cambios.
* Mantener mensajes de commit claros y descriptivos.

---

## Flujo resumido

```text
Crear rama feature/*
        ↓
Realizar commits
        ↓
Push a GitHub
        ↓
Pull Request a develop
        ↓
Revisión
        ↓
Merge a develop
        ↓
Pull Request de develop a main
        ↓
Versión estable
```
