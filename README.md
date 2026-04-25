# Tmux Theme Studio

Local-first web app for creating, previewing, importing, and exporting `tmux` themes without hand-editing `tmux.conf`.

## What It Does

- Edit a normalized `tmux` theme model visually
- Preview status bar, panes, and messages live
- Start from multiple dark and light presets
- Use `undo` / `redo` with buttons or keyboard shortcuts
- Save, load, rename, duplicate, and delete themes in `localStorage`
- Import supported `tmux` theme lines and see an applied / unsupported / error report
- Copy or download an exported `tmux` snippet

## Presets Included

- Nord Powerline
- Catppuccin Mocha
- Tokyo Night
- Kanagawa Paper
- Solarized Light
- Rosé Pine Dawn

## Run Locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
```

## Keyboard Shortcuts

- `Cmd/Ctrl + Z`: undo
- `Cmd/Ctrl + Shift + Z`: redo
- `Ctrl + Y`: redo

## Supported Import Scope

The importer currently handles the theme-oriented lines this app exports:

- `set -g status-style`
- `set -g status-left`
- `setw -g window-status-format`
- `setw -g window-status-current-format`
- `set -g pane-border-style`
- `set -g pane-active-border-style`
- `set -g message-command-style`
- `set -g message-style`

Lines outside that subset are reported as unsupported instead of being silently ignored.
