# ChildFund México

## Link del proyecto publicado

[https://chilfund.netlify.app/](https://chilfund.netlify.app/)

## Descripcion

Landing page para ChildFund México enfocada en apadrinamientos. Incluye sección principal con formulario de registro de leads, enlace al sitio oficial, contacto por WhatsApp y envío de registros por correo usando una API interna.

## Tecnologias usadas

- Astro
- Tailwind CSS
- @astrojs/netlify
- Nodemailer

## Requisitos

- Node.js 22.12.0+
- npm
- Variables de entorno SMTP para envío de correos
- Credenciales SMTP válidas en `CHILDFUND_SMTP_HOST`, `CHILDFUND_SMTP_USER` y `CHILDFUND_SMTP_PASS`
- Correo destino en `CHILDFUND_EMAIL_TO`

## Retos tecnicos

- Integrar un backend API en Astro para recibir leads desde el formulario.
- Enviar notificaciones de nuevos registros por email con Nodemailer.
- Configurar `@astrojs/netlify` para despliegue con salida serverless.
- Mantener un diseño responsive y accesible con Tailwind CSS.

## Creditos

Desarrollado por Jonathan Alexis Bello Lopez.
