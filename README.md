# StoryVocab

Una experiencia web offline-first para aprender inglés C1 leyendo historias cortas. El prototipo está construido con HTML semántico, CSS moderno y JavaScript vanilla: no necesita build step ni backend.

## Incluye

- Biblioteca editorial con 14 historias de ficción y no ficción repartidas en 7 categorías.
- Lector responsive con palabras clave interactivas, definición EN/ES, pronunciación, ejemplo y guardado local.
- Ejercicios post-lectura: cloze, comprensión y vocabulario en contexto.
- Repaso espaciado basado en una versión simplificada de SM-2 con cuatro niveles de respuesta.
- Mi vocabulario con filtros, búsqueda, estados y detalles.
- Dashboard de actividad, retención, categorías y próximos hitos.
- Persistencia en `localStorage`; los datos permanecen en el dispositivo del usuario.
- Navegación responsive con barra lateral en escritorio y navegación inferior en móvil.

## Ejecutar en local

Como el contenido se carga desde archivos JSON, sirve la carpeta con cualquier servidor HTTP estático:

```bash
python3 -m http.server 4173
```

Después abre <http://localhost:4173>.

También funciona con extensiones de servidor local de VS Code o con cualquier hosting estático.

## Estructura

```text
.
├── index.html
├── styles/main.css
├── js/app.js
└── data/
    ├── categories.json
    ├── stories.json
    └── vocabulary.json
```

La aplicación utiliza rutas hash (`#home`, `#library`, `#read/1`, `#exercise/1`, `#review`, `#vocabulary`, `#stats`) para ofrecer varias vistas sin servidor de rutas.

## Datos y progreso

El contenido está separado del código para que añadir historias sea directo. El progreso se guarda bajo la clave `storyvocab-state-v1` y puede reiniciarse desde el icono de ajustes en la parte inferior de la barra lateral.

Para probar una sesión completa:

1. Abre una historia.
2. Haz clic en una palabra subrayada y guárdala.
3. Completa los ejercicios.
4. Entra en **Repaso de hoy** y califica tu recuerdo.
5. Consulta **Mi progreso** para ver cómo cambian tus métricas.

## Decisiones de producto

- Se priorizó una interfaz editorial y calmada para sesiones de 12–20 minutos.
- El español se usa en la interfaz y las definiciones, mientras que las historias y los ejemplos permanecen en inglés.
- No se añadieron audio, autenticación ni sincronización multi-dispositivo porque quedan fuera del MVP offline.
