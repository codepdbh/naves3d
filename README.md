# 🚀 NEBULA-8: Guardianes del Vacío

[![Live Demo](https://img.shields.io/badge/PLAY_NOW-Live_Demo-00ffcc?style=for-the-badge&logo=gamepad&logoColor=black)](https://codepdbh.github.io/naves3d/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R185-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)](LICENSE)

> **Un videojuego de naves espaciales 3D retro para navegador, inspirado en la era dorada de los 8 bits y las consolas NES.**

---

## 🕹️ Jugar Ahora en Línea

El juego está desplegado y listo para jugar en GitHub Pages:

👉 **[https://codepdbh.github.io/naves3d/](https://codepdbh.github.io/naves3d/)**

---

## 🌟 Características Principales

- 👾 **Estética Retro 8 Bits Integrada en 3D**:
  - Modelos tridimensionales low-poly con texturas pixeladas generadas proceduralmente mediante `NearestFilter`.
  - Renderizado offscreen con opciones de resolución interna seleccionables (*Retro Extremo 320x180*, *Retro Equilibrado 480x270*, *Nítido 640x360* y *Nativo*).
  - Efectos visuales retro con líneas de escaneo CRT opcionales.

- 🌌 **5 Sectores Espaciales Únicos**:
  - **Sector 1: Frontera Estelar** — Espacio profundo, asteroides pequeños y drones exploradores.
  - **Sector 2: Nebulosa Carmesí** — Niebla roja estelar, descargas eléctricas y cazas sigilosos.
  - **Sector 3: Cementerio Orbital** — Pasillos estrechos de chatarra espacial y torretas pesadas.
  - **Sector 4: Enjambre Mecánico** — Enjambre sintético con drones de reparación y escudos.
  - **Sector 5: Fortaleza del Vacío** — Bastión enemigo de élite y batalla final contra el *Arquitecto del Vacío*.

- 🚀 **Físicas Arcade & Origen Flotante (Floating Origin)**:
  - Vuelo tridimensional rápido con inclinación al girar (*roll banking*) y aceleración progresiva.
  - Sistema de recentrado de coordenadas (*Floating Origin*) que elimina la pérdida de precisión matemática al viajar largas distancias en el espacio.

- 💥 **Sistema de Colisiones Continuas (CCD) & Spatial Hash**:
  - Rejilla de partición espacial 3D (*SpatialHash*) para consultas de vecindad de alto rendimiento.
  - Detección continua (*Swept Collisions*) para proyectiles rápidos y láseres que evita que atraviesen enemigos.

- 🔫 **Arsenal Variado & Mejoras**:
  - **Láser Estándar**: Disparo rápido con medidor de sobrecalentamiento térmico.
  - **Disparo Triple**: Cobertura amplia para enjambres.
  - **Rayo Perforante**: Rayo concentrado de alta penetración y daño masivo.
  - **Misiles Teledirigidos**: Munición limitada con seguimiento automático y daño de área.
  - **Bomba EMP Especial**: Destrucción de proyectiles enemigos e impacto radial.
  - **Coleccionables en pantalla**: Curación de casco, células de escudo, energía, misiles, bombas y multiplicadores de puntuación.

- 🤖 **3 Jefes Finales Multifase**:
  - **Devorador de Asteroides** (Fragmentos rocosos e invocación de enjambres).
  - **Núcleo del Enjambre** (Barrera de nodos de escudo y disparos en espiral *bullet-hell*).
  - **Arquitecto del Vacío** (Torretas pesadas, fase de persecución y sobrecarga del núcleo).

- 🎵 **Motor de Sonido Chiptune NES Procedural**:
  - Generación de sonido en tiempo real utilizando la **Web Audio API** (ondas de pulso cuadradas, explosiones de ruido blanco, barridos de frecuencia y líneas de bajo triangulares). ¡Sin archivos pesados ni dependencias externas!

---

## 🎮 Controles del Juego

| Acción | Teclado / Ratón | Mando (Gamepad) | Pantalla Táctil |
| :--- | :--- | :--- | :--- |
| **Mover Nave** | `W` / `A` / `S` / `D` | Stick Izquierdo | Joystick Virtual Izquierdo |
| **Subir / Bajar** | `E` / `Q` | D-Pad Arriba / Abajo | Joystick Virtual |
| **Apuntar Cámara** | Mover Ratón | Stick Derecho | Deslizar Pantalla |
| **Disparo Principal** | Clic Izquierdo / `K` | Gatillo Derecho / Botón A | Botón "DISPARO" |
| **Lanzar Misil** | Clic Derecho / `L` | Gatillo Izquierdo / Botón B | Botón "MISIL" |
| **Impulso (Boost)** | `Barra Espaciadora` | Botón X | Botón "IMPULSO" |
| **Bomba EMP** | `F` | Botón Y | Botón "BOMBA" |
| **Cambiar Arma** | `R` | LB / RB | Tap Icono Arma |
| **Pausar** | `Esc` | Botón Start | Botón Pausa |

---

## 📂 Arquitectura del Proyecto

```text
naves3d/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── app/                # Enrutador principal y componentes raíz
│   ├── game/
│   │   ├── GameCanvas.tsx  # Escena principal React Three Fiber
│   │   ├── audio/          # Sintetizador procedural NES Web Audio API
│   │   ├── bosses/         # Lógica y modelos 3D de jefes finales
│   │   ├── camera/         # Cámara arcade suave con screen shake
│   │   ├── collision/      # SpatialHash 3D & detección continua CCD
│   │   ├── debug/          # Panel de depuración FPS, colisiones y cheats
│   │   ├── enemies/        # IA (FSM), fábrica de unidades y modelos 3D
│   │   ├── pickups/        # Objetos recolectables flotantes y atracción
│   │   ├── player/         # Controlador de nave, armas y vuelo
│   │   ├── projectiles/    # Object pooling de láseres y misiles
│   │   ├── rendering/      # Generador de texturas canvas y render pass retro
│   │   ├── waves/          # Director de oleadas y dificultad
│   │   └── world/          # Floating origin, campos de estrellas y asteroides
│   ├── components/         # Menús 8-bit, HUD pixel-art y radar 2D
│   ├── stores/             # Estado global Zustand (juego, opciones, progreso)
│   └── tests/              # Pruebas unitarias con Vitest
```

---

## 🛠️ Instalación y Desarrollo Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/codepdbh/naves3d.git
   cd naves3d
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Ejecutar pruebas unitarias**:
   ```bash
   npm run test
   ```

5. **Compilar para producción**:
   ```bash
   npm run build
   ```

6. **Desplegar en GitHub Pages**:
   ```bash
   npm run deploy
   ```

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
