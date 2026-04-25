import { CSSProperties, ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { loadDraftTheme, loadSavedThemes, saveDraftTheme, saveSavedThemes } from "./storage";
import {
  ImportReport,
  TmuxTheme,
  cloneTheme,
  createThemeFromPreset,
  defaultPreset,
  exportTmuxSnippet,
  generateThemeId,
  importTmuxSnippet,
  makeNamedCopy,
  themePresets,
} from "./theme";

type SegmentSection = "bar" | "session" | "window" | "windowActive" | "battery" | "date" | "time";
type MessageSection = "command" | "message";
type PaneField = "background" | "text";
type HistoryState = {
  past: TmuxTheme[];
  present: TmuxTheme;
  future: TmuxTheme[];
};

const INITIAL_IMPORT_REPORT: ImportReport = {
  applied: [],
  unsupported: [],
  errors: [],
};

function App() {
  const [history, setHistory] = useState<HistoryState>(() => ({
    past: [],
    present: loadDraftTheme(),
    future: [],
  }));
  const [savedThemes, setSavedThemes] = useState<TmuxTheme[]>(() => loadSavedThemes());
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [importReport, setImportReport] = useState<ImportReport>(INITIAL_IMPORT_REPORT);

  const theme = history.present;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const tmuxSnippet = useMemo(() => exportTmuxSnippet(theme), [theme]);

  useEffect(() => {
    saveDraftTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveSavedThemes(savedThemes);
  }, [savedThemes]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const modifierPressed = event.metaKey || event.ctrlKey;
      if (!modifierPressed) {
        return;
      }

      if (event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function commitTheme(nextTheme: TmuxTheme) {
    setHistory((current) => ({
      past: [...current.past, cloneTheme(current.present)].slice(-80),
      present: cloneTheme(nextTheme),
      future: [],
    }));
  }

  function updateTheme(mutator: (current: TmuxTheme) => TmuxTheme) {
    commitTheme(mutator(cloneTheme(theme)));
  }

  function undo() {
    setHistory((current) => {
      if (current.past.length === 0) {
        return current;
      }

      const previous = current.past[current.past.length - 1];
      return {
        past: current.past.slice(0, -1),
        present: cloneTheme(previous),
        future: [cloneTheme(current.present), ...current.future].slice(0, 80),
      };
    });
  }

  function redo() {
    setHistory((current) => {
      if (current.future.length === 0) {
        return current;
      }

      const [next, ...rest] = current.future;
      return {
        past: [...current.past, cloneTheme(current.present)].slice(-80),
        present: cloneTheme(next),
        future: rest,
      };
    });
  }

  function applyPreset(presetId: string) {
    const presetTheme = createThemeFromPreset(presetId);
    commitTheme({
      ...presetTheme,
      id: generateThemeId(),
      name: presetTheme.name,
    });
    setImportReport(INITIAL_IMPORT_REPORT);
  }

  function updateThemeName(event: ChangeEvent<HTMLInputElement>) {
    const nextName = event.target.value;
    updateTheme((current) => ({
      ...current,
      name: nextName,
    }));
  }

  function updateStatusSegment(
    section: SegmentSection,
    field: "bg" | "fg",
    value: `#${string}`,
  ) {
    updateTheme((current) => ({
      ...current,
      status: {
        ...current.status,
        [section]: {
          ...current.status[section],
          [field]: value,
        },
      },
    }));
  }

  function updateStatusBold(section: Exclude<SegmentSection, "bar">, checked: boolean) {
    updateTheme((current) => ({
      ...current,
      status: {
        ...current.status,
        [section]: {
          ...current.status[section],
          bold: checked,
        },
      },
    }));
  }

  function updatePaneField(field: PaneField, value: `#${string}`) {
    updateTheme((current) => ({
      ...current,
      pane: {
        ...current.pane,
        [field]: value,
      },
    }));
  }

  function updatePaneSegment(segment: "border" | "activeBorder", field: "bg" | "fg", value: `#${string}`) {
    updateTheme((current) => ({
      ...current,
      pane: {
        ...current.pane,
        [segment]: {
          ...current.pane[segment],
          [field]: value,
        },
      },
    }));
  }

  function updateMessageSegment(section: MessageSection, field: "bg" | "fg", value: `#${string}`) {
    updateTheme((current) => ({
      ...current,
      message: {
        ...current.message,
        [section]: {
          ...current.message[section],
          [field]: value,
        },
      },
    }));
  }

  function saveCurrentTheme() {
    setSavedThemes((current) => {
      const existingIndex = current.findIndex((item) => item.id === theme.id);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = cloneTheme(theme);
        return next;
      }

      return [cloneTheme(theme), ...current];
    });
  }

  function loadSavedTheme(themeId: string) {
    const savedTheme = savedThemes.find((item) => item.id === themeId);
    if (!savedTheme) {
      return;
    }

    commitTheme(cloneTheme(savedTheme));
  }

  function duplicateCurrentTheme() {
    const duplicated = makeNamedCopy(theme, `${theme.name} Copy`);
    commitTheme(duplicated);
  }

  function renameSavedTheme(themeId: string) {
    const existing = savedThemes.find((item) => item.id === themeId);
    if (!existing) {
      return;
    }

    const nextName = window.prompt("Rename saved theme", existing.name);
    if (!nextName || !nextName.trim()) {
      return;
    }

    setSavedThemes((current) =>
      current.map((item) =>
        item.id === themeId
          ? {
              ...item,
              name: nextName.trim(),
            }
          : item,
      ),
    );
  }

  function deleteSavedTheme(themeId: string) {
    setSavedThemes((current) => current.filter((item) => item.id !== themeId));
  }

  function handleImport() {
    const result = importTmuxSnippet(importText, theme);
    commitTheme({
      ...result.theme,
      id: theme.id,
      name: theme.name,
    });
    setImportReport(result.report);
  }

  async function copySnippet() {
    await navigator.clipboard.writeText(tmuxSnippet);
    setCopied(true);
  }

  function downloadSnippet() {
    const file = new Blob([tmuxSnippet], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    const safeName = theme.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    anchor.href = url;
    anchor.download = `${safeName || "tmux-theme"}.conf`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const darkPresets = themePresets.filter((preset) => preset.appearance === "dark");
  const lightPresets = themePresets.filter((preset) => preset.appearance === "light");

  return (
    <main className={`app-shell appearance-${theme.appearance}`}>
      <section className="hero-panel">
        <div className="hero-copy-block">
          <p className="eyebrow">Tmux Theme Studio</p>
          <h1>Build tmux themes visually, keep the powerline aesthetic, and back every change with undo.</h1>
          <p className="hero-copy">
            The editor now includes multiple light and dark presets, a shared theme model for preview and export,
            local saved themes, import reports, and keyboard-friendly undo/redo.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" onClick={copySnippet}>
            {copied ? "Copied" : "Copy snippet"}
          </button>
          <button type="button" className="ghost" onClick={downloadSnippet}>
            Download .conf
          </button>
          <button type="button" className="ghost" onClick={saveCurrentTheme}>
            Save theme
          </button>
          <button type="button" className="ghost" onClick={duplicateCurrentTheme}>
            Duplicate
          </button>
          <button type="button" className="ghost" onClick={undo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" className="ghost" onClick={redo} disabled={!canRedo}>
            Redo
          </button>
        </div>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <Panel title="Current Theme" label="Workspace">
            <label className="text-field">
              <span>Name</span>
              <input type="text" value={theme.name} onChange={updateThemeName} />
            </label>
            <div className="status-line">
              <span className="pill">{theme.appearance}</span>
              <span className="tiny-copy">Undo: {history.past.length} changes</span>
            </div>
          </Panel>

          <Panel title="Dark Presets" label="Presets">
            <div className="preset-list">
              {darkPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`preset-card ${theme.name === preset.name ? "selected" : ""}`}
                  onClick={() => applyPreset(preset.id)}
                >
                  <span className="preset-title">{preset.name}</span>
                  <span className="preset-description">{preset.description}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Light Presets" label="Presets">
            <div className="preset-list">
              {lightPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`preset-card ${theme.name === preset.name ? "selected" : ""}`}
                  onClick={() => applyPreset(preset.id)}
                >
                  <span className="preset-title">{preset.name}</span>
                  <span className="preset-description">{preset.description}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Saved Themes" label="Library">
            <div className="saved-list">
              {savedThemes.length === 0 ? (
                <p className="empty-state">No saved themes yet. Save the current one to build your library.</p>
              ) : (
                savedThemes.map((savedTheme) => (
                  <div key={savedTheme.id} className="saved-item">
                    <div>
                      <strong>{savedTheme.name}</strong>
                      <p>{savedTheme.appearance}</p>
                    </div>
                    <div className="saved-actions">
                      <button type="button" className="mini-button" onClick={() => loadSavedTheme(savedTheme.id)}>
                        Load
                      </button>
                      <button type="button" className="mini-button" onClick={() => renameSavedTheme(savedTheme.id)}>
                        Rename
                      </button>
                      <button type="button" className="mini-button danger" onClick={() => deleteSavedTheme(savedTheme.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </aside>

        <section className="main-column">
          <div className="two-up">
            <Panel title="Status Bar" label="Editor">
              <div className="control-grid">
                <ColorField
                  label="Bar background"
                  value={theme.status.bar.bg}
                  onChange={(value) => updateStatusSegment("bar", "bg", value)}
                />
                <ColorField
                  label="Bar text"
                  value={theme.status.bar.fg}
                  onChange={(value) => updateStatusSegment("bar", "fg", value)}
                />
                <ColorField
                  label="Session background"
                  value={theme.status.session.bg}
                  onChange={(value) => updateStatusSegment("session", "bg", value)}
                />
                <ColorField
                  label="Session text"
                  value={theme.status.session.fg}
                  onChange={(value) => updateStatusSegment("session", "fg", value)}
                />
                <ToggleField
                  label="Session bold"
                  checked={Boolean(theme.status.session.bold)}
                  onChange={(checked) => updateStatusBold("session", checked)}
                />
                <ColorField
                  label="Inactive window background"
                  value={theme.status.window.bg}
                  onChange={(value) => updateStatusSegment("window", "bg", value)}
                />
                <ColorField
                  label="Inactive window text"
                  value={theme.status.window.fg}
                  onChange={(value) => updateStatusSegment("window", "fg", value)}
                />
                <ToggleField
                  label="Inactive window bold"
                  checked={Boolean(theme.status.window.bold)}
                  onChange={(checked) => updateStatusBold("window", checked)}
                />
                <ColorField
                  label="Active window background"
                  value={theme.status.windowActive.bg}
                  onChange={(value) => updateStatusSegment("windowActive", "bg", value)}
                />
                <ColorField
                  label="Active window text"
                  value={theme.status.windowActive.fg}
                  onChange={(value) => updateStatusSegment("windowActive", "fg", value)}
                />
                <ToggleField
                  label="Active window bold"
                  checked={Boolean(theme.status.windowActive.bold)}
                  onChange={(checked) => updateStatusBold("windowActive", checked)}
                />
              </div>
            </Panel>

            <Panel title="Right Segments" label="Editor">
              <div className="control-grid">
                <ColorField
                  label="Battery background"
                  value={theme.status.battery.bg}
                  onChange={(value) => updateStatusSegment("battery", "bg", value)}
                />
                <ColorField
                  label="Battery text"
                  value={theme.status.battery.fg}
                  onChange={(value) => updateStatusSegment("battery", "fg", value)}
                />
                <ToggleField
                  label="Battery bold"
                  checked={Boolean(theme.status.battery.bold)}
                  onChange={(checked) => updateStatusBold("battery", checked)}
                />
                <ColorField
                  label="Date background"
                  value={theme.status.date.bg}
                  onChange={(value) => updateStatusSegment("date", "bg", value)}
                />
                <ColorField
                  label="Date text"
                  value={theme.status.date.fg}
                  onChange={(value) => updateStatusSegment("date", "fg", value)}
                />
                <ToggleField
                  label="Date bold"
                  checked={Boolean(theme.status.date.bold)}
                  onChange={(checked) => updateStatusBold("date", checked)}
                />
                <ColorField
                  label="Time background"
                  value={theme.status.time.bg}
                  onChange={(value) => updateStatusSegment("time", "bg", value)}
                />
                <ColorField
                  label="Time text"
                  value={theme.status.time.fg}
                  onChange={(value) => updateStatusSegment("time", "fg", value)}
                />
                <ToggleField
                  label="Time bold"
                  checked={Boolean(theme.status.time.bold)}
                  onChange={(checked) => updateStatusBold("time", checked)}
                />
              </div>
            </Panel>
          </div>

          <div className="two-up">
            <Panel title="Panes" label="Editor">
              <div className="control-grid">
                <ColorField
                  label="Pane background"
                  value={theme.pane.background}
                  onChange={(value) => updatePaneField("background", value)}
                />
                <ColorField
                  label="Pane text"
                  value={theme.pane.text}
                  onChange={(value) => updatePaneField("text", value)}
                />
                <ColorField
                  label="Pane border background"
                  value={theme.pane.border.bg}
                  onChange={(value) => updatePaneSegment("border", "bg", value)}
                />
                <ColorField
                  label="Pane border foreground"
                  value={theme.pane.border.fg}
                  onChange={(value) => updatePaneSegment("border", "fg", value)}
                />
                <ColorField
                  label="Active border background"
                  value={theme.pane.activeBorder.bg}
                  onChange={(value) => updatePaneSegment("activeBorder", "bg", value)}
                />
                <ColorField
                  label="Active border foreground"
                  value={theme.pane.activeBorder.fg}
                  onChange={(value) => updatePaneSegment("activeBorder", "fg", value)}
                />
              </div>
            </Panel>

            <Panel title="Messages" label="Editor">
              <div className="control-grid">
                <ColorField
                  label="Command message background"
                  value={theme.message.command.bg}
                  onChange={(value) => updateMessageSegment("command", "bg", value)}
                />
                <ColorField
                  label="Command message text"
                  value={theme.message.command.fg}
                  onChange={(value) => updateMessageSegment("command", "fg", value)}
                />
                <ColorField
                  label="Status message background"
                  value={theme.message.message.bg}
                  onChange={(value) => updateMessageSegment("message", "bg", value)}
                />
                <ColorField
                  label="Status message text"
                  value={theme.message.message.fg}
                  onChange={(value) => updateMessageSegment("message", "fg", value)}
                />
              </div>
            </Panel>
          </div>

          <Panel title="Live Preview" label="Preview">
            <div className="tmux-preview" style={{ background: theme.status.bar.bg, color: theme.status.bar.fg }}>
              <div className="status-row">
                <PowerlineSegment
                  text=" session "
                  bg={theme.status.session.bg}
                  fg={theme.status.session.fg}
                  nextBg={theme.status.bar.bg}
                />
                <div className="window-row">
                  <PowerlineSegment
                    text=" 1 editor "
                    bg={theme.status.windowActive.bg}
                    fg={theme.status.windowActive.fg}
                    nextBg={theme.status.bar.bg}
                  />
                  <PowerlineSegment
                    text=" 2 shell "
                    bg={theme.status.window.bg}
                    fg={theme.status.window.fg}
                    nextBg={theme.status.bar.bg}
                  />
                </div>
                <div className="right-row">
                  <ReversePowerlineSegment
                    text=" 88% "
                    bg={theme.status.battery.bg}
                    fg={theme.status.battery.fg}
                    prevBg={theme.status.bar.bg}
                  />
                  <ReversePowerlineSegment
                    text=" Apr 21 "
                    bg={theme.status.date.bg}
                    fg={theme.status.date.fg}
                    prevBg={theme.status.battery.bg}
                  />
                  <ReversePowerlineSegment
                    text=" 14:05 "
                    bg={theme.status.time.bg}
                    fg={theme.status.time.fg}
                    prevBg={theme.status.date.bg}
                  />
                </div>
              </div>
              <div className="terminal-body" style={{ background: theme.pane.background, color: theme.pane.text }}>
                <div
                  className="pane active"
                  style={{
                    borderColor: theme.pane.activeBorder.fg,
                  }}
                >
                  <p>$ tmux source-file ~/.tmux.conf</p>
                  <p className="muted">Undo and redo preserve the visual loop while you iterate.</p>
                </div>
                <div
                  className="pane"
                  style={{
                    borderColor: theme.pane.border.fg,
                  }}
                >
                  <p>$ opencode</p>
                  <p className="muted">Preview and export are driven by the same theme structure.</p>
                </div>
              </div>
              <div
                className="message-bar"
                style={{ background: theme.message.command.bg, color: theme.message.command.fg }}
              >
                command prompt: set-option -g status-style
              </div>
              <div
                className="message-bar secondary"
                style={{ background: theme.message.message.bg, color: theme.message.message.fg }}
              >
                status: theme ready for export
              </div>
            </div>
          </Panel>

          <div className="two-up">
            <Panel title="Import Snippet" label="Import">
              <textarea
                className="snippet-input"
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                placeholder="Paste supported tmux theme lines here"
              />
              <div className="inline-actions">
                <button type="button" onClick={handleImport}>
                  Import supported lines
                </button>
                <button type="button" className="ghost" onClick={() => setImportText(tmuxSnippet)}>
                  Load current export
                </button>
              </div>
              <div className="report-grid">
                <ReportList title="Applied" items={importReport.applied} />
                <ReportList title="Unsupported" items={importReport.unsupported} />
                <ReportList title="Errors" items={importReport.errors} />
              </div>
            </Panel>

            <Panel title="Export Snippet" label="Export">
              <pre className="snippet-output">{tmuxSnippet}</pre>
            </Panel>
          </div>

          <Panel title="Use In Tmux" label="Instructions">
            <div className="instructions-block">
              <p>
                1. Copy the exported snippet and paste it into <code>~/.tmux.conf</code>, or download the
                generated <code>.conf</code> file and merge it into your tmux config.
              </p>
              <p>
                2. Reload tmux without closing your session:
                <code> tmux source-file ~/.tmux.conf </code>
              </p>
              <p>
                3. If you want true powerline glyphs in the real terminal, use a Nerd Font or Powerline-patched
                terminal font such as <code>JetBrainsMono Nerd Font</code> or <code>MesloLGS NF</code>.
              </p>
              <p>
                4. If your config already has other <code>status</code>, <code>window-status</code>,
                <code>pane-border</code>, or <code>message-style</code> settings, the last matching line in
                <code>~/.tmux.conf</code> wins. Keep one final exported block near the end of the file.
              </p>
            </div>
          </Panel>
        </section>
      </section>
    </main>
  );
}

function Panel({
  title,
  label,
  children,
}: {
  title: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-label">{label}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: `#${string}`;
  onChange: (value: `#${string}`) => void;
}) {
  return (
    <label className="color-field">
      <span>{label}</span>
      <div className="swatch-row">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value as `#${string}`)} />
        <code>{value}</code>
      </div>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-field">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function PowerlineSegment({
  text,
  bg,
  fg,
  nextBg,
}: {
  text: string;
  bg: string;
  fg: string;
  nextBg: string;
}) {
  return (
    <div className="segment-wrap">
      <span className="segment" style={{ background: bg, color: fg }}>
        {text}
      </span>
      <span
        className="arrow arrow-right"
        style={
          {
            "--arrow-color": bg,
            "--arrow-background": nextBg,
          } as CSSProperties
        }
      />
    </div>
  );
}

function ReversePowerlineSegment({
  text,
  bg,
  fg,
  prevBg,
}: {
  text: string;
  bg: string;
  fg: string;
  prevBg: string;
}) {
  return (
    <div className="segment-wrap reverse">
      <span
        className="arrow arrow-left"
        style={
          {
            "--arrow-color": bg,
            "--arrow-background": prevBg,
          } as CSSProperties
        }
      />
      <span className="segment" style={{ background: bg, color: fg }}>
        {text}
      </span>
    </div>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="report-box">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="empty-state">Nothing yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={`${title}-${item}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
