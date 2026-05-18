# Manual de piloto cerrado - Red de Jovenes

## 1. Objetivo del piloto

Validar Red de Jovenes con un grupo controlado de usuarios reales antes de abrir la app a una comunidad mas amplia.

El piloto debe confirmar que la experiencia cristiana/PWA funciona en uso real: registro, login, comunidad, oracion, devocionales, juegos de fe, mapa mundial, reportes y administracion inicial.

## 2. Alcance

Incluye:

- uso de la app por jovenes invitados;
- acceso de administrador;
- revision de reportes;
- instalacion PWA en dispositivos reales;
- captura de feedback UX;
- seguimiento de errores funcionales.

No incluye:

- campana publica;
- pagos;
- backend adicional fuera de Supabase;
- notificaciones push reales;
- moderacion automatizada avanzada.

## 3. Duracion sugerida

Duracion recomendada: 7 a 14 dias.

Ritmo sugerido:

- Dia 1: alta de usuarios, instalacion PWA y pruebas guiadas.
- Dias 2 a 5: uso libre de oracion, foros, devocional, juegos y mapa.
- Dias 6 a 7: recoleccion de feedback, revision de reportes y cierre.
- Semana 2 opcional: correccion de hallazgos y segunda pasada corta.

## 4. Perfil de usuarios

### Jovenes

- Usuarios reales invitados.
- Deben crear cuenta, completar perfil y probar modulos principales.
- Deben reportar cualquier contenido de prueba indicado por el equipo.

### Moderadores

- Personas de confianza pastoral o de liderazgo juvenil.
- Durante esta fase pueden operar junto al administrador si no existe rol dedicado activo en UI.
- Deben revisar reportes y cuidar el tono de la comunidad.

### Administrador

- Responsable de revisar `/app/admin`.
- Responsable de devocionales, reportes, publicaciones recientes y sugerencias de grupos.
- Responsable de consolidar feedback y decidir si el piloto avanza o se suspende.

## 5. Funcionalidades a probar

- Registro.
- Login.
- Recuperacion de contrasena.
- Perfil.
- Sala de oracion global.
- Foros con la Palabra.
- Devocional diario.
- Juegos de fe.
- Mapa mundial.
- Reportes de contenido.
- Preferencias de notificaciones.
- Instalacion PWA.
- Acceso admin.

## 6. Criterios de exito

El piloto puede considerarse exitoso si:

- al menos 80% de usuarios invitados puede registrarse e iniciar sesion;
- al menos 70% puede instalar o abrir la app como PWA cuando su dispositivo lo permite;
- los modulos principales no presentan errores bloqueantes;
- los reportes pueden crearse y revisarse;
- el administrador puede operar `/app/admin`;
- los usuarios describen la app como segura, clara y alineada al concepto cristiano juvenil.

## 7. Criterios de suspension

Suspender o pausar el piloto si:

- login o registro falla para varios usuarios;
- aparece un problema de seguridad o exposicion de datos;
- RLS permite modificar datos ajenos;
- la app muestra contenido sensible no moderable;
- hay fallos graves en PWA que impiden usar la app;
- se reporta una situacion de cuidado pastoral urgente.

## 8. Riesgos

- Usuarios con dispositivos o navegadores no compatibles con instalacion PWA.
- Correos de confirmacion o recuperacion filtrados por spam.
- Falta de proceso humano para responder reportes.
- Contenido de prueba confundido con contenido real.
- Expectativa de notificaciones push reales, que aun no forman parte del alcance.

## 9. Contacto de soporte

Durante el piloto, definir un canal unico de soporte antes de invitar usuarios.

Sugerencia:

- Administrador del piloto: Yassir Salek.
- Canal: grupo privado o correo operativo definido por el equipo.
- Tiempo de respuesta esperado: dentro del mismo dia durante la ventana del piloto.
