# Especificación — VeloGo

_App de ciclismo para salir en grupo (híbrida y simplificada)_

**Documento de diseño y handoff para Claude**\
_Versión 1.3 — Nombre definitivo: **VeloGo** (26/09/2026)_

> **Novedades de la v1.3**
> - Nombre definitivo de la app: **VeloGo**.
>
> **Novedades de la v1.2**
> - **Las salidas en grupo son el centro de la app** (sección 6.2): día, hora, punto de salida y punto de encuentro.
> - Botón central "+" → "Crear salida" como primera opción.
> - Roadmap reordenado: las salidas se construyen en la Fase 2.
>
> **Novedades de la v1.1**
> - Paleta real de RILY capturada (sección 3.1) — pendiente 1 resuelto.
> - Lista completa de funciones de Comunidad heredadas de RideSafe IA (sección 6.2) — pendiente 2 resuelto.
> - Navegación con botón central "+" (formato RILY) y hoja de planificación con 3 tarjetas (formato BIKEMAP).
> - Arquitectura alineada con el stack que ya dominamos (PWA + Firebase + Mapbox).

---

## 1\. Resumen ejecutivo

Se va a crear una aplicación **totalmente nueva e independiente** para ciclistas. No es una actualización ni una copia de ninguna app existente: es un **híbrido** que toma la _experiencia_ aprendida de tres aplicaciones de referencia, pero con **identidad, estilo y organización propios**, desvinculada por completo de las anteriores.

| Referencia | Qué aporta a la nueva app |
| --- | --- |
| **RILY** | Diseño visual: fondo azul marino, acento lima, tarjetas redondeadas, barra inferior con botón central "+" |
| **BIKEMAP** | Mapas y planificación: hoja "Empieza a planificar" con A→B, multietapa y ruta circular; botón "Rec / Iniciar" |
| **RideSafe IA** | Comunidad centrada en **salidas en grupo** (día, hora, punto de salida y de encuentro), pelotón en vivo, puntos y seguridad, simplificado |

**Principios rectores:**

* **Totalmente nueva** — código, nombre, identidad y organización propios.
* **Super reducida** — sin complicaciones, sin funciones que abrumen.
* **Para salir en grupo** — su función principal es organizar salidas: día, hora, punto de salida y punto de encuentro.
* **Tres apartados** — Rutas, Comunidad y Actividades.
* **Sencilla y atractiva** — para todos los públicos.
* **Fácil de manejar** — cualquier acción principal en 3 toques o menos.

---

## 2\. Revisión previa de la nueva aplicación

### 2.1 Qué tomamos de cada aplicación

**De RILY (diseño) — según capturas:**

* Fondo azul marino oscuro y un **único color de acento lima**.
* Saludo personal arriba ("Hola, [nombre]") con avatar, lupa y campana.
* Tarjeta portada (hero) con foto, titular grande y dos botones (uno lleno lima, otro con borde).
* Fila de **3 mini-tarjetas de resumen** (número grande + texto pequeño + icono).
* Secciones con título a la izquierda y enlace "Ver todo ›" en lima a la derecha.
* **Ranking** en lista con posición, avatar, nombre y puntos.
* **Barra inferior flotante** con esquinas redondeadas y **botón central "+" circular lima**.
* En el mapa: buscador arriba ("Buscar lugar…" + filtro), botón "Buscar en esta zona", selector carretera/montaña, botones redondos de capas y ubicación, botón "Ver lista".

**De BIKEMAP (mapas y planificación) — según capturas:**

* Mapa como elemento central, con vista satélite/híbrida y carriles bici resaltados.
* Botón flotante **"Rec · INICIAR"** para grabar una salida sin planificar.
* Hoja inferior con dos botones: **"Buscar destino"** y **"Planificar"**.
* Hoja **"Empieza a planificar"** con **3 tarjetas grandes** (icono ilustrado a la izquierda + título + descripción corta):
  * Planificador A a B.
  * Planificador multietapa.
  * Planificar ruta circular.
* Botones laterales redondos: descargar mapa, capas, centrar ubicación, añadir punto.
* Navegación con datos en vivo (velocidad, distancia, duración, altitud, hora estimada de llegada).

**De RideSafe IA (comunidad, puntos y seguridad):**

* Todo el apartado Comunidad actual (ver 6.2), simplificado.
* Sistema de **puntos** y ranking.
* **Importación GPX/TCX** (GPX ya funciona en RideSafe).
* Alertas de seguridad básicas (112, compartir ubicación, WhatsApp).

### 2.2 Qué descartamos en v1

* ❌ Chat / mensajería compleja (solo reacciones simples).
* ❌ Sala de voz en grupo (ya descartada en RideSafe: no funcionaba bien).
* ❌ Telegram (difícil de configurar para ciclistas; se usa WhatsApp y 112).
* ❌ Marketplace o tienda.
* ❌ Análisis avanzados de rendimiento (potencia, FTP, zonas).
* ❌ Planes de entrenamiento.
* ❌ Sincronización con Garmin/Strava/Wahoo por cuenta (OAuth) — solo **importación de archivos** GPX/TCX.
* ❌ Sensores Bluetooth y alarma antirrobo (se pueden añadir más adelante).

> **Regla de oro:** si una función no la entiende un ciclista nuevo en 10 segundos, no entra en v1.

### 2.3 Desvinculación total de las apps anteriores

* **Identidad propia:** nombre, logo y textos nuevos. Se inspira en el _estilo_ de RILY y en el _flujo_ de BIKEMAP, pero **no copia logotipos, ilustraciones, fotos ni textos literales** de ninguna de ellas.
* **Código base nuevo:** proyecto limpio, sin reutilizar código de RideSafe IA.
* **Datos separados:** proyecto Firebase nuevo, sin mezclar con `ridesafe-app-25ecb`.
* **Diferenciación visual:** misma familia de colores que RILY (marino + lima) pero con tonos propios y un color secundario distinto (ver 3.1), para que no se confunda con RILY ni con RideSafe.

---

## 3\. Identidad visual (estilo RILY)

### 3.1 Paleta de colores (capturada de RILY y adaptada)

| Uso | Color | Código |
| --- | --- | --- |
| Fondo principal (oscuro, por defecto) | Azul marino profundo | `#0E1A2B` |
| Fondo de tarjetas | Marino algo más claro | `#16263D` |
| Borde de tarjetas | Marino gris | `#2A3B55` |
| **Acento principal** (botones, enlaces, "+") | **Lima** | `#C8DC3C` |
| Texto sobre lima | Marino | `#0E1A2B` |
| Texto principal | Blanco | `#FFFFFF` |
| Texto secundario | Gris azulado | `#9AA8BC` |
| Secundario / logros (nivel, medallas) | Ámbar-bronce | `#E0913A` |
| Alerta / SOS | Rojo | `#EF4444` |

* **Modo claro** opcional: fondo `#F4F6F9`, tarjetas blancas, el lima se oscurece a `#8FA622` para mantener contraste.
* **Perfil de elevación:** verde = llano, naranja = pendiente ≥ 7 %, rojo = pendiente ≥ 12 %.
* **Mapa:** se mantiene claro (estilo Mapbox claro o satélite) aunque la interfaz sea oscura, igual que RILY y BIKEMAP.

### 3.2 Tipografía

* Sans-serif redondeada y geométrica (ej. _Plus Jakarta Sans_ o _Manrope_).
* Títulos 22–26 px en negrita; cuerpo 15–16 px; datos grandes 28–34 px.
* Números en estilo **tabular** (no "bailan" al cambiar).

### 3.3 Tarjetas

* Esquinas muy redondeadas (radio 20–24 px), fondo `#16263D`, borde fino `#2A3B55`.
* Tres tipos de tarjeta:
  1. **Hero** — foto de fondo con degradado oscuro, titular, 2 botones.
  2. **Dato** — icono + número grande + texto pequeño (fila de 3).
  3. **Lista** — icono a la izquierda, título en negrita, subtítulo gris, flecha lima "›" a la derecha (formato de la Comunidad de RideSafe).
* Tarjeta de planificador (formato BIKEMAP): panel ilustrado a la izquierda (≈30 %) + título en azul/lima + descripción a la derecha.
* Espaciado entre tarjetas 12–16 px.

### 3.4 Interfaz general

* **Barra inferior flotante** (esquinas redondeadas), 3 pestañas + botón central:

  `Rutas · [ + ] · Comunidad · Actividades`

* **Botón central "+"** (círculo lima) abre un menú rápido de 3 opciones:
  * 📅 **Crear salida** (la función principal: día, hora, punto de salida y punto de encuentro)
  * 🗺️ **Nueva ruta** (abre "Empieza a planificar")
  * 📂 **Subir archivo** (GPX/TCX)
* Para rodar solo sin planificar está el botón **"Rec · Iniciar"** del mapa.
* Cabecera con saludo, avatar, lupa y campana (solo en Comunidad y Actividades; en Rutas manda el mapa).
* Botones grandes (mínimo 48 px) con icono + texto.
* Textos cortos: "Crear salida", "Subir archivo", "Mis puntos", "Ver todo".

---

## 4\. Estructura de la app

### 4.1 Rutas (mapa)

* Mapa a pantalla completa con buscador "Buscar lugar…" arriba.
* Botones redondos a la derecha: capas, centrar ubicación, descargar zona.
* Selector carretera / montaña.
* Botón flotante **"Rec · Iniciar"** (grabar sin planificar).
* Hoja inferior: **"Buscar destino"** + **"Planificar"**.
* Botón "Ver lista": rutas guardadas y rutas de la comunidad cercanas, en tarjetas.

### 4.2 Comunidad

Pantalla de inicio social (formato RILY) + lista de funciones (formato RideSafe). Ver sección 6.

### 4.3 Actividades

* Tarjeta hero "Sube tu salida" con botón "Subir archivo".
* Fila de 3 tarjetas de resumen: km del mes · salidas · desnivel.
* Historial en tarjetas y detalle con mapa + perfil de elevación + datos.

---

## 5\. Mapas y planificador (estilo BIKEMAP)

### 5.1 Etiquetas del mapa

* Nombres de calles, carreteras (A-4, A-92…) y puntos de interés vienen del **mapa base** (Mapbox/OpenStreetMap), igual que en BIKEMAP.
* Carriles bici y caminos resaltados en verde.
* Marcadores: A (verde), B (rojo), intermedios (numerados, color acento).
* Iconos de POI de la comunidad: agua, café, taller, mirador (de "Puntos ciclistas").

### 5.2 Hoja "Empieza a planificar"

Al pulsar **Planificar**, sube una hoja con 3 tarjetas (textos propios):

| Tarjeta | Descripción corta |
| --- | --- |
| **De A a B** | Ruta de ida, de un punto a otro. |
| **Por etapas** | Ruta larga dividida en días o paradas. |
| **Ruta circular** | Sale y vuelve al mismo sitio. |

### 5.3 Planificador A→B

* Origen y destino tocando el mapa o buscando.
* Ruta ciclista óptima (evita autovías, prioriza carriles bici y caminos).
* Muestra: distancia, tiempo, desnivel y perfil con colores de pendiente.
* Botones "Guardar" y "Empezar".

### 5.4 Planificador por etapas (multietapa)

* Puntos intermedios reordenables (arrastrar).
* División en etapas diarias con resumen por etapa.
* Perfil de elevación actualizado en cada cambio.

### 5.5 Ruta circular

* Punto de partida + distancia objetivo (20 / 40 / 60 km o personalizada).
* La app genera el bucle; se puede ajustar arrastrando puntos.

### 5.6 Navegación en vivo

* Velocidad, distancia, duración, altitud y hora estimada de llegada.
* Flechas grandes de giro; aviso por voz sencillo.
* Recalcula si te desvías.
* Botón grande **"Terminar"** → guarda en Actividades.

---

## 6\. Comunidad (RideSafe IA simplificada, con formato RILY)

> **La app es, ante todo, para organizar SALIDAS en comunidad:** quién sale, qué día, a qué hora, desde dónde y dónde se reúne el grupo. Todo lo demás de Comunidad gira alrededor de esto.

### 6.1 Pantalla de inicio de Comunidad (formato RILY)

De arriba abajo:

1. Saludo "Hola, [nombre]" + avatar + lupa + campana.
2. **Hero** con foto: "Sal a rodar acompañado" → botones **"Crear salida"** (lima) y **"Ver salidas"** (borde).
3. **Próximas salidas** — tarjetas de las salidas cercanas, ordenadas por fecha. "Ver todas ›".
4. **Mis salidas** — a las que me he apuntado o que he creado.
5. **Mis puntos** — fila de 3 tarjetas: puntos totales · salidas hechas · nivel (Bronce / Plata / Oro).
6. **Ranking** — top 10 con posición, avatar, nombre y puntos. "Ver ranking completo ›".
7. **Más funciones** — lista de tarjetas (6.3).

### 6.2 Salidas en grupo (FUNCIÓN PRINCIPAL)

Une en una sola función lo que en RideSafe eran "Quedadas" y "Punto de encuentro".

**Crear salida — 1 pantalla, 3 toques:**

| Campo | Cómo se rellena | Obligatorio |
| --- | --- | --- |
| 📅 **Día** | Calendario (hoy / mañana / elegir fecha) | Sí |
| 🕘 **Hora** | Selector de hora de salida | Sí |
| 🚩 **Punto de salida** | Tocar en el mapa o buscar dirección | Sí |
| 📍 **Punto de encuentro** | Por defecto = punto de salida; se puede poner otro (ej. un bar, una rotonda) con su propia hora | Sí |
| 🗺️ **Ruta** | Elegir una ruta guardada o planificar (opcional) | No |
| 🚴 **Tipo y ritmo** | Carretera / montaña · Tranquilo / medio / fuerte | No |
| 👥 **Plazas** | Sin límite o número máximo | No |
| 💬 **Nota** | Texto corto ("llevad luces", "parada para café") | No |

Botón grande **"Publicar salida"** → se crea la tarjeta y se ofrece **"Compartir por WhatsApp"** con enlace directo.

**Tarjeta de salida (formato RILY):**

* Día y hora grandes arriba (ej. **SÁB 4 OCT · 08:30**).
* Punto de salida y punto de encuentro con icono.
* Mini-mapa con la ruta (si la tiene), distancia y desnivel.
* Avatares de los apuntados + "12 apuntados".
* Botón lima **"Me apunto"** / "Ya no voy".

**Detalle de la salida:**

* Mapa con 🚩 salida y 📍 encuentro; botón **"Cómo llegar"** al punto de encuentro.
* Lista de apuntados.
* Botón **"Compartir por WhatsApp"**.
* El día de la salida, botón **"Empezar salida"** → activa automáticamente **Pelotón en vivo** con los apuntados (se ve a todos en el mapa y avisa de rezagados).
* Al terminar: la actividad se guarda y **todos suman puntos** por salida completada.

**Avisos:** recordatorio la víspera y 1 hora antes; aviso si el creador cambia la hora o el punto, o cancela.

**Buscar salidas:** lista y mapa de salidas cercanas, con filtro por día (hoy · fin de semana · esta semana) y tipo (carretera / montaña).

### 6.3 Más funciones de Comunidad (heredadas de RideSafe IA)

Formato de cada una: tarjeta de lista (icono + título + subtítulo + "›"), como en la captura de RideSafe.

**Rodar en grupo** (complementan a las Salidas)

| Función | Subtítulo en la app | Versión simple v1 |
| --- | --- | --- |
| 📡 **Ciclistas cercanos** | Quién rueda a menos de 2 km | Radar automático con botón "Unirse al grupo" |
| 👥 **Mi grupo** | Tu grupo habitual de salida | Crear grupo (código de 6 caracteres) o unirse con código; sus salidas aparecen primero |
| 🛰️ **Pelotón en vivo** | GPS en vivo de tu grupo | Se activa solo al empezar una salida; aviso de rezagados |

**Compartir y descubrir**

| Función | Subtítulo en la app | Versión simple v1 |
| --- | --- | --- |
| 🗺️ **Rutas de la comunidad** | Rutas compartidas por otros ciclistas | Biblioteca de rutas (GPX) con filtro por distancia |
| ☕ **Puntos ciclistas** | Fuentes, cafés, talleres y más | 7 categorías de POI, añadir con un toque |
| 📰 **Actividad de la comunidad** | Últimas salidas | Feed simple con 👍 ❤️ |
| 🏆 **Puntos y ranking** | Tus puntos y los mejores | Tarjeta "Mis puntos" + top 10 |
| 🎖️ **Logros** | Tus medallas | Hitos básicos (primeros 10 km, primera circular, primera salida en grupo, primera salida organizada…) |

**Seguridad (dentro de Comunidad)**

| Función | Subtítulo en la app | Versión simple v1 |
| --- | --- | --- |
| 🔴 **Compartir salida en vivo** | Que tu familia vea dónde estás | Enlace en vivo por WhatsApp |
| 🆘 **Alertas de seguridad** | 112, ubicación y WhatsApp | 3 botones grandes |

### 6.4 Puntos

* Puntos por km recorrido, por ruta completada, por **salida en grupo completada** (más puntos al que la organiza) y por logros.
* Puntos extra por aportar a la comunidad: publicar una ruta, añadir un punto ciclista.
* Niveles: Bronce → Plata → Oro → Platino.
* Ranking sin presión: top 10 + tu posición.

### 6.5 Privacidad

* Cada actividad: pública o privada.
* "Ciclistas cercanos" y "Compartir en vivo" se pueden apagar con un interruptor.
* Cada salida: **abierta** (la ve toda la comunidad) o **solo mi grupo**.

---

## 7\. Importación GPX / TCX

* Botón grande **"Subir archivo"** en Actividades y en el botón central "+".
* Formatos: **GPX** y **TCX**.
* Vista previa: mapa, distancia, duración, desnivel, velocidad media.
* Error claro: "No pudimos leer este archivo. Comprueba que sea GPX o TCX."
* Al guardar: tarjeta en el historial, opción pública/privada y suma de puntos automática.

---

## 8\. Principios de simplicidad y accesibilidad

1. **3 toques máximo** para cualquier acción principal.
2. **Icono + texto** siempre juntos.
3. **Textos cortos**, sin jerga.
4. **Contraste alto** (uso al sol).
5. **Botones grandes** (mínimo 48 px), usable con guantes.
6. **Modo oscuro por defecto**, modo claro opcional.
7. Etiquetas accesibles para lectores de pantalla.
8. **Sin anuncios** ni ventanas emergentes.
9. **Onboarding de 3 pantallas** como máximo.
10. **Sin registro** para explorar; registro solo para guardar y participar.

---

## 9\. Arquitectura técnica (recomendada)

> Se propone el mismo tipo de stack que ya funciona en RideSafe IA, porque es el que sabemos mantener y publicar sin tiendas de apps. Proyecto y datos **totalmente nuevos**.

* **App:** PWA (HTML + CSS + JavaScript), instalable en Android, iPhone y PC.
* **Alojamiento:** GitHub Pages / dominio propio, repositorio nuevo.
* **Mapas:** Mapbox GL JS (token restringido al dominio nuevo).
* **Rutas:** OpenRouteService perfil bicicleta (A→B, multietapa y circular con `round_trip`).
* **Datos y usuarios:** Firebase (Auth + base de datos) — **proyecto nuevo**, con reglas de seguridad desde el primer día.
* **GPX/TCX:** lectura en el propio navegador.
* **Tiempo real** (pelotón, compartir en vivo, ciclistas cercanos): Firebase Realtime Database.
* **Avisos:** WhatsApp (enlaces) y llamada al 112. Sin Telegram.

_Alternativa futura:_ React Native + Expo si se quiere publicar en Google Play / App Store.

---

## 10\. Instrucciones para Claude (handoff)

> Copia y pega este bloque como prompt inicial para construir la app.

---

**PROMPT PARA CLAUDE:**

Construye una PWA de ciclismo **totalmente nueva e independiente**, llamada **VeloGo**, con identidad propia. No reutilices código, textos literales, logos ni datos de ninguna app anterior.

**Diseño:** fondo azul marino `#0E1A2B`, tarjetas `#16263D` con borde `#2A3B55` y radio 20–24 px, acento único lima `#C8DC3C`, secundario bronce `#E0913A`. Tipografía Plus Jakarta Sans. Barra inferior flotante redondeada con 3 pestañas (Rutas · Comunidad · Actividades) y **botón central "+" lima** que abre: Crear salida / Nueva ruta / Subir archivo. Botones de 48 px mínimo, icono + texto.

**Rutas:** mapa Mapbox a pantalla completa, buscador arriba, botones redondos (capas, ubicación, descargar), botón "Rec · Iniciar", hoja inferior con "Buscar destino" y "Planificar". "Planificar" abre una hoja con 3 tarjetas ilustradas: De A a B · Por etapas · Ruta circular. Enrutado ciclista con OpenRouteService. Perfil de elevación con colores por pendiente (≥7 % naranja, ≥12 % rojo). Navegación en vivo con velocidad, distancia, duración, altitud y hora de llegada.

**Comunidad — el centro de la app son las SALIDAS EN GRUPO:** crear una salida en una sola pantalla con **día, hora, punto de salida y punto de encuentro** (obligatorios) más ruta, tipo/ritmo, plazas y nota (opcionales). Tarjeta de salida con día y hora grandes, puntos de salida y encuentro, mini-mapa, apuntados y botón "Me apunto". Compartir por WhatsApp, recordatorios (víspera y 1 hora antes), avisos de cambios. Al empezar la salida se activa Pelotón en vivo con los apuntados; al terminar suman puntos. Inicio de Comunidad estilo panel: saludo, hero "Crear salida / Ver salidas", próximas salidas, mis salidas, mis puntos, ranking top 10. Más funciones en tarjetas: Ciclistas cercanos, Mi grupo (código), Pelotón en vivo, Rutas de la comunidad, Puntos ciclistas, Actividad de la comunidad, Puntos y ranking, Logros, Compartir salida en vivo, Alertas de seguridad (112, ubicación, WhatsApp). Todo en versión simple.

**Actividades:** subir GPX/TCX con vista previa, historial en tarjetas, detalle con mapa y perfil.

**Técnica:** PWA, Firebase nuevo (Auth + Realtime Database) con reglas seguras, Mapbox GL JS, OpenRouteService. Entrega archivos completos listos para subir a GitHub.

---

## 11\. Roadmap de implementación

| Fase | Contenido | Resultado |
| --- | --- | --- |
| **1** | Nombre, paleta, barra con botón "+", pantallas base | Esqueleto navegable |
| **2** | **Salidas en grupo:** crear (día, hora, salida, encuentro), tarjetas, "Me apunto", WhatsApp, recordatorios | **El corazón de la app funcionando** |
| **3** | Mapa + hoja "Empieza a planificar" + A→B, etapas y circular (para añadir ruta a una salida) | Rutas funcionales |
| **4** | Rec/Iniciar + navegación en vivo + Pelotón en vivo al empezar salida + guardar actividad | Pedalear en grupo y registrar |
| **5** | Inicio de Comunidad, puntos, ranking, logros, mi grupo, ciclistas cercanos | Comunidad completa |
| **6** | Subir GPX/TCX + historial + detalle | Actividades completas |
| **7** | Rutas de la comunidad, puntos ciclistas, compartir en vivo, alertas | Extras de comunidad y seguridad |
| **8** | Onboarding, accesibilidad, modo claro, pulido | Lista para publicar |

---

## 12\. Decisiones pendientes

1. ~~Paleta de RILY~~ ✅ Resuelta (sección 3.1).
2. ~~Funciones de RideSafe para Comunidad~~ ✅ Resuelta (secciones 6.2 y 6.3). Salidas en grupo = función principal.
3. ~~Nombre definitivo~~ ✅ **VeloGo**.
4. **Plataforma:** recomendada PWA (sección 9) — confirmar.
5. **Logo** (tras fijar el nombre).

---

_Nombre fijado. Fase 1 en marcha._
