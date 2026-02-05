# 📧 Email vs XML-RPC en Odoo: Diferencias Clave

## ❓ Tu Pregunta

> "¿Puede ser que la integración no funciona porque el email configurado en Odoo para recibir correos es otro?"

## ✅ Respuesta Corta

**NO**. La integración de emails y la integración XML-RPC son **completamente independientes**.

---

## 🔄 Las Dos Formas de Integrar con Odoo CRM

### 1. Integración por EMAIL ✉️

**Cómo funciona:**

- Configuras un email en Odoo (ej: `ventas@realtodigital.com`)
- Los correos que llegan a esa dirección se convierten automáticamente en leads
- Odoo lee el email, extrae el remitente, asunto y cuerpo
- Crea un lead en el CRM con esa información

**Configuración:**

```
Odoo → Ajustes → Discusión → Servidores de Email Entrantes
- Dirección: ventas@realtodigital.com
- Servidor IMAP: imap.gmail.com (o tu proveedor)
- Usuario/Contraseña del email
```

**Dónde se usa:**

- Para capturar leads que te escriben desde formularios web
- Para registrar correos de clientes potenciales
- Para importar comunicaciones desde email marketing

---

### 2. Integración por XML-RPC (API) 🔌

**Cómo funciona (TU CASO):**

- Tu chatbot se conecta a Odoo mediante programación
- Usa un **usuario de Odoo** (con email y contraseña)
- No envía emails, crea leads directamente en la base de datos
- Es como si un empleado entrara a Odoo y creara el lead manualmente

**Configuración (en .env.local):**

```env
ODOO_URL=https://realtodigital.odoo.com
ODOO_DB=realtodigital-production
ODOO_USERNAME=admin@realtodigital.com  ← Email del USUARIO de Odoo, NO del buzón
ODOO_PASSWORD=tu_contraseña_odoo       ← Contraseña del usuario
```

**Dónde se usa:**

- En tu chatbot (para crear leads automáticamente)
- En integraciones de apps externas
- En automatizaciones personalizadas

---

## 🎯 ¿Cuál Email Debes Usar?

| Concepto | Email a Usar | Ejemplo |
|----------|--------------|---------|
| **Email para recibir correos** | El buzón configurado en Odoo | `ventas@realtodigital.com` |
| **ODOO_USERNAME** (XML-RPC) | Email de tu usuario de Odoo | `admin@realtodigital.com` o `tu-email@realtodigital.com` |

### ⚠️ ¡Importante

El `ODOO_USERNAME` **NO TIENE QUE SER** el email donde recibes correos del CRM.

**Puede ser:**

- El email del administrador de Odoo
- El email de tu cuenta de usuario en Odoo
- Cualquier email de un usuario que tenga permisos de CRM

---

## 🔍 Cómo Identificar el Problema

### Si la integración XML-RPC NO funciona, las causas pueden ser

1. **Credenciales incorrectas**
   - El email del usuario no existe en Odoo
   - La contraseña es incorrecta
   - Estás usando el email del buzón en vez del usuario

2. **Usuario sin permisos**
   - El usuario existe pero no tiene permisos de CRM
   - Solución: Ve a Odoo → Ajustes → Usuarios → Dale permisos de "Ventas/CRM"

3. **Base de datos incorrecta**
   - Tienes múltiples bases de datos en Odoo
   - Estás usando el nombre incorrecto en `ODOO_DB`

4. **URL incorrecta**
   - La URL debe ser la raíz: `https://tuempresa.odoo.com`
   - NO debe terminar en `/odoo`

5. **Firewall o restricciones de red**
   - Odoo bloquea conexiones desde tu IP
   - Necesitas habilitar el acceso XML-RPC

---

## 🛠️ Pasos para Solucionar

### Paso 1: Identifica tu usuario de Odoo

1. Inicia sesión en Odoo (web)
2. Ve a tu perfil (esquina superior derecha)
3. Mira el email asociado a tu cuenta
4. Ese es el email que va en `ODOO_USERNAME`

### Paso 2: Verifica permisos

1. En Odoo: Ajustes → Usuarios
2. Busca tu usuario
3. En la pestaña "Derechos de Acceso"
4. Asegúrate que tiene marcado "Ventas" o "CRM"

### Paso 3: Obtén el nombre de la base de datos

1. Opciones:
   - Aparece en la URL al iniciar sesión
   - Pregunta a tu proveedor de Odoo
   - Si es Odoo.com, suele ser el nombre de tu empresa

### Paso 4: Prueba la conexión

```bash
# Ejecuta el script de diagnóstico
npx tsx scripts/diagnose-odoo.ts
```

---

## 📊 Ejemplo Real

**Escenario: Real to Digital**

```env
# ❌ INCORRECTO
ODOO_USERNAME=ventas@realtodigital.com  # Este es el buzón de email, NO tu usuario
ODOO_PASSWORD=contraseña_del_email

# ✅ CORRECTO
ODOO_USERNAME=carlos@realtodigital.com  # O admin@realtodigital.com (tu usuario de Odoo)
ODOO_PASSWORD=tu_contraseña_de_odoo
```

---

## 🔐 Diferencia Clave

| Integración | Autenticación | Función |
|-------------|---------------|---------|
| **Email** | Usuario/contraseña del **buzón de email** | Solo recibe correos y los convierte en leads |
| **XML-RPC** | Email/contraseña de un **usuario de Odoo** | Crea, modifica y lee datos directamente en Odoo |

---

## 💡 Conclusión

**Tu problema NO es el email de recepción de correos.**

El problema está en una de estas áreas:

1. Credenciales incorrectas en `.env.local`
2. Usuario sin permisos de CRM
3. URL o base de datos incorrectas
4. Bloqueo de firewall/red

**Próximo paso:** Ejecuta el script de diagnóstico que creamos para identificar exactamente dónde está el problema.

```bash
npx tsx scripts/diagnose-odoo.ts
```
