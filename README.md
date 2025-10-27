# 🖼️ PNG → WebP Watcher Agent

This Node.js agent automatically converts any **PNG** file dropped into the `/input` folder into an optimized **WebP** image (TinyPNG-like quality) inside the `/output` folder.  
It uses [`sharp`](https://www.npmjs.com/package/sharp) for pixel-level conversion and [`imagemin-webp`](https://www.npmjs.com/package/imagemin-webp) for final optimization.

---

## 🚀 Features

✅ Real PNG → WebP compression (not renaming)  
✅ Smart TinyPNG-like quality (`quality: 95`, `effort: 6`)  
✅ Auto-watcher (no manual commands)  
✅ Keeps a detailed conversion log (`log.json`)  
✅ Handles new files automatically  
✅ Prevents double conversion if file already exists  

---

## 📂 Folder Structure

```
conversion-folder/
├── agent.js        # main watcher agent
├── package.json
├── input/          # drop PNG files here
├── output/         # converted WebP files
└── log.json        # auto-generated conversion log
```

---

## ⚙️ Installation

### 1. Clone or download this project
```bash
git clone https://github.com/aanandkumar8/png-to-webp-watcher-agent.git
cd png-to-webp-watcher-agent
```

### 2. Install dependencies
```bash
npm install sharp chokidar imagemin imagemin-webp
```

> 🧩 `sharp` handles the conversion, `chokidar` watches for file changes, and `imagemin-webp` does the optimization.

---

## ▶️ How to Run

### 1. Start the watcher
```bash
node agent.js
```

### 2. Drop PNG files into `input/`
The script will automatically:
- Wait until the file is fully copied  
- Convert it to WebP  
- Optimize the output  
- Save it in the `/output` folder  
- Log the details in `log.json`

Example output:
```
👀 Watching for new PNG files in: ./input
⚙️ Converting: photo.png → photo.webp
✅ Done: ./output/photo.webp (182.4 KB, 245 ms, optimized: true)
```

---

## 📜 Log Format (`log.json`)

```json
[
  {
    "file": "photo.png",
    "converted": "photo.webp",
    "size_kb": "182.4",
    "time_ms": 245,
    "optimized": true,
    "date": "2025-10-27T12:45:20.987Z"
  }
]
```

---

## ⚙️ Customization

You can adjust conversion quality inside `agent.js`:
```js
sharp(filePath).webp({
  quality: 95,        // lower → smaller size, higher → better quality
  effort: 6,          // higher = slower but smaller file
  smartSubsample: true
})
```

To automatically delete the original PNG after successful conversion:
```js
fs.unlinkSync(filePath);
```

---

