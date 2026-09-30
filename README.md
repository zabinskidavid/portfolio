# Portfolio — Dawid Żabiński

Prosta strona portfolio przeznaczona do publikacji prac graficznych.

## Struktura

```text
/
├── index.html
├── style.css
├── script.js
├── projects.json
├── LICENSE
└── images/
    ├── tb_project-1.jpg
    ├── project-1.jpg
    └── ...
```

## Dodawanie i edycja prac

Wszystkie dane dotyczące prac znajdują się w jednym pliku:

`projects.json`

### Grafika

```json
{
  "thumbnail": "images/tb_project-1.jpg",
  "type": "image",
  "preview": "images/project-1.jpg",
  "description": "Opis projektu",
  "categories": ["Branding"]
}
```

### Lokalny film MP4

```json
{
  "thumbnail": "images/tb_project-48.jpg",
  "type": "mp4",
  "preview": "images/motion-1.mp4",
  "description": "Animacja Tetra Pak",
  "categories": ["Projekty cyfrowe"]
}
```


### YouTube

```json
{
  "thumbnail": "images/tb_project-49.jpg",
  "type": "youtube",
  "preview": "https://www.youtube.com/watch?v=F_5Vtdbeal4",
  "description": "Animacja typu explainer dla Tetra Pak",
  "categories": ["Projekty cyfrowe"]
}
```

Obsługiwane są standardowe adresy YouTube, w tym `youtube.com/watch`, `youtu.be`, `youtube.com/shorts` i `youtube.com/embed`.

## Kategorie

- Wszystkie
- Skład publikacji i katalogów
- Okładki
- Ilustracje
- Projekty drukowane
- Projekty cyfrowe
- Branding


### Ważne przy nazwach plików

Ścieżki w `projects.json` muszą dokładnie odpowiadać nazwom plików w folderze `images`. Wielkość liter ma znaczenie na GitHub Pages, np.:

`tb_project-1.jpg` ≠ `TB_Project-1.jpg`

## Licencja

Kod strony oraz materiały wizualne są objęte warunkami opisanymi w pliku `LICENSE`. Materiały portfolio nie są przeznaczone do kopiowania ani dalszej dystrybucji bez zgody autora.
