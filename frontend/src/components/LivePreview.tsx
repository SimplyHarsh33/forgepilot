import { useRef, useEffect, useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { RefreshCw, Terminal, Eye } from 'lucide-react'

export default function LivePreview() {
  const { files, projectType, compilerLogs, addCompilerLog } = useWorkspace()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  // React Runner Sandbox HTML template
  const getReactRunnerHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"></script>
  <script src="https://unpkg.com/lucide-react@0.395.0/dist/umd/lucide-react.min.js"></script>
  <style>
    body { background-color: #fdfbf7; color: #2d312e; font-family: sans-serif; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #fdfbf7; }
    ::-webkit-scrollbar-thumb { background: #e6e2d8; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #869d7a; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.addEventListener('message', async (event) => {
      const { files, entry } = event.data;
      if (!files) return;

      const log = (msg) => window.parent.postMessage({ type: 'LOG', msg }, '*');
      const logErr = (msg) => window.parent.postMessage({ type: 'ERR', msg }, '*');

      log("[Compiler] Bundling components...");

      try {
        window.__modules = {};

        // Transpile TSX/TS/JS
        for (const path in files) {
          const file = files[path];
          if (file.isFolder) continue;

          const ext = path.split('.').pop();
          if (ext === 'tsx' || ext === 'ts' || ext === 'jsx' || ext === 'js') {
            const result = Babel.transform(file.content, {
              presets: ['react', 'typescript'],
              filename: path
            });
            window.__modules[path] = new Function('exports', 'require', 'module', result.code);
          }
        }

        // Resolves file imports inside Sandbox
        const resolvePath = (referrer, importPath) => {
          if (importPath.startsWith('./')) {
            const parts = referrer.split('/');
            parts.pop(); // remove filename
            const relativeParts = importPath.substring(2).split('/');
            return parts.concat(relativeParts).join('/');
          }
          if (importPath.startsWith('../components/')) {
            return 'src/components/' + importPath.replace('../components/', '');
          }
          if (importPath.startsWith('./components/')) {
            return 'src/components/' + importPath.replace('./components/', '');
          }
          return importPath;
        };

        const cache = {};
        const customRequire = (importPath, referrer) => {
          if (importPath === 'react') return window.React;
          if (importPath === 'react-dom') return window.ReactDOM;
          if (importPath === 'react-dom/client') return {
            createRoot: (el) => ({
              render: (node) => {
                // Render root element
                const reactRoot = window.ReactDOM.createRoot(el);
                reactRoot.render(node);
                // Save to window cache so we can unmount on hot-reload
                window.__reactRoot = reactRoot;
              }
            })
          };
          if (importPath === 'lucide-react') return window.Lucide;

          const resolved = resolvePath(referrer, importPath);
          const candidates = [
            resolved,
            resolved + '.tsx',
            resolved + '.ts',
            resolved + '.jsx',
            resolved + '.js',
            resolved.replace('.tsx', '').replace('.ts', '')
          ];
          
          let match = candidates.find(c => window.__modules[c]);
          if (!match) {
            // Check for case insensitive or exact match from relative
            const cleanKeys = Object.keys(window.__modules);
            match = cleanKeys.find(k => candidates.includes(k) || candidates.includes(k.replace('.tsx', '')));
          }

          if (!match) {
            throw new Error("Module not found: " + importPath + " (resolved to: " + resolved + ")");
          }

          if (cache[match]) return cache[match].exports;

          const module = { exports: {} };
          cache[match] = module;
          window.__modules[match](module.exports, (p) => customRequire(p, match), module);
          return module.exports;
        };

        // Unmount old react app if present
        if (window.__reactRoot) {
          try {
            window.__reactRoot.unmount();
          } catch(e) {}
        }
        document.getElementById('root').innerHTML = '<div id="root-container"></div>';

        // Boot
        const entryFn = window.__modules[entry];
        if (!entryFn) throw new Error("Entry point not found: " + entry);

        const entryModule = { exports: {} };
        entryFn(entryModule.exports, (p) => customRequire(p, entry), entryModule);
        log("[Sandbox] Compiled & hot-reloaded successfully.");

      } catch (err) {
        logErr("[Compiler Error] " + err.message);
        document.getElementById('root').innerHTML = '<div style="padding: 24px; font-family: monospace; font-size: 12px; color: #ff5f57;"><strong>Compiler Error:</strong><pre style="margin-top: 10px; white-space: pre-wrap; background: #FAF5F5; border: 1px solid #FFEBEB; padding: 12px; border-radius: 8px;">' + err.message + '\\n\\n' + err.stack + '</pre></div>';
      }
    });
  </script>
</body>
</html>`
  }

  // HTML static sandbox compiler
  const getStaticHtmlSource = () => {
    const indexFile = files['index.html']
    if (!indexFile) return ''

    let content = indexFile.content

    // Inline CSS styles
    const stylesFile = files['styles.css']
    if (stylesFile) {
      content = content.replace(
        /<link[^>]*rel=["']stylesheet["'][^>]*href=["']styles\.css["'][^>]*>/gi,
        `<style>${stylesFile.content}</style>`
      )
    }

    // Inline Javascript
    const scriptFile = files['script.js']
    if (scriptFile) {
      content = content.replace(
        /<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi,
        `<script>${scriptFile.content}</script>`
      )
    }

    return content
  }

  // Sync files to preview iframe
  const compileAndLoad = () => {
    const iframe = iframeRef.current
    if (!iframe) return

    if (projectType === 'html') {
      const srcDoc = getStaticHtmlSource()
      iframe.srcdoc = srcDoc
      addCompilerLog('[Sandbox] Compiled index.html, styled CSS, and linked script.js.')
    } else {
      // Send message to React Runner iframe
      iframe.contentWindow?.postMessage(
        {
          files,
          entry: 'src/main.tsx',
        },
        '*'
      )
    }
  }

  useEffect(() => {
    // Compile on files update (debounced)
    const timeout = setTimeout(() => {
      compileAndLoad()
    }, 600)

    return () => clearTimeout(timeout)
  }, [files, reloadKey, projectType])

  // Handle messages posted from Sandbox iframe
  useEffect(() => {
    const handleSandboxMessages = (event: MessageEvent) => {
      if (event.data?.type === 'LOG') {
        addCompilerLog(event.data.msg)
      } else if (event.data?.type === 'ERR') {
        addCompilerLog(`❌ ${event.data.msg}`)
      }
    }
    window.addEventListener('message', handleSandboxMessages)
    return () => window.removeEventListener('message', handleSandboxMessages)
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0d1117] border-l border-[#E6E2D8] dark:border-[#30363d]">
      
      {/* Sandbox Header Tool row */}
      <div className="px-4 py-2 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <Eye size={13} className="text-[#869D7A]" />
          <span className="text-[10px] font-bold text-[#5B625E] dark:text-[#8b949e] uppercase tracking-wider">
            Live Preview Browser
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLogs(!showLogs)}
            title="Toggle compiler console logs"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
              showLogs
                ? 'bg-[#869D7A]/15 border-[#869D7A]/40 text-[#788E6E]'
                : 'bg-white border-[#E6E2D8] text-[#5B625E] hover:border-[#869D7A]/50'
            }`}
          >
            <Terminal size={11} />
            Console
          </button>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            title="Hard compile sandbox"
            className="p-1 rounded-lg bg-white border border-[#E6E2D8] hover:border-[#869D7A]/50 text-[#5B625E] hover:text-[#2D312E] transition-all"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Frame Container split logs */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <iframe
          ref={iframeRef}
          key={reloadKey}
          srcDoc={projectType === 'react' ? getReactRunnerHtml() : undefined}
          title="Sandbox Runtime"
          className="flex-1 w-full border-none bg-white"
          sandbox="allow-scripts allow-same-origin allow-modals"
        />

        {/* Compiler logs console overlay */}
        {showLogs && (
          <div className="h-44 border-t border-[#E6E2D8] dark:border-[#30363d] bg-[#FAF8F5] dark:bg-[#0d1117] flex flex-col shrink-0 text-left font-mono">
            <div className="px-3 py-1 bg-[#F5F2EB] dark:bg-[#161b22] border-b border-[#E6E2D8] dark:border-[#30363d] flex items-center justify-between text-[9px] font-bold text-[#5B625E] dark:text-[#8b949e]">
              <span>COMPILER CONSOLE LOGS</span>
              <button 
                onClick={() => setShowLogs(false)}
                className="text-[10px] hover:text-[#2D312E]"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-1 text-[9px] text-[#2D312E] dark:text-[#c9d1d9] bg-[#FCFAF7] dark:bg-[#0d1117]">
              {compilerLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-b border-black/5 dark:border-white/5 pb-0.5">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
