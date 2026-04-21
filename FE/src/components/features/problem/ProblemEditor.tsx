import { useRef, useState, useCallback } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { Button } from '../../ui/Button'
import { ChevronDown } from 'lucide-react'

interface Language {
  id: string
  label: string
  monaco: string
  template: string
}

const LANGUAGES: Language[] = [
  {
    id: 'cpp',
    label: 'C++',
    monaco: 'cpp',
    template: `#include <bits/stdc++.h>
using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  // your code here

  return 0;
}`,
  },
  {
    id: 'python',
    label: 'Python 3',
    monaco: 'python',
    template: `import sys
input = sys.stdin.readline

def solve():
    # your code here
    pass

solve()`,
  },
  {
    id: 'java',
    label: 'Java',
    monaco: 'java',
    template: `import java.util.*;
import java.io.*;

public class Main {
  public static void main(String[] args) throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    // your code here
  }
}`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    monaco: 'javascript',
    template: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
let idx = 0;

// your code here
`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    monaco: 'typescript',
    template: `const lines: string[] = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
let idx = 0;

// your code here
`,
  },
  {
    id: 'go',
    label: 'Go',
    monaco: 'go',
    template: `package main

import (
  "bufio"
  "fmt"
  "os"
)

func main() {
  reader := bufio.NewReader(os.Stdin)
  _ = reader
  // your code here
  fmt.Println()
}`,
  },
  {
    id: 'rust',
    label: 'Rust',
    monaco: 'rust',
    template: `use std::io::{self, BufRead};

fn main() {
  let stdin = io::stdin();
  for line in stdin.lock().lines() {
    let _line = line.unwrap();
    // your code here
  }
}`,
  },
]

interface ProblemEditorProps {
  statement: string
  code: string
  onCodeChange: (value: string) => void
  onSubmit: (language: string) => void
}

// ── C++ diagnostic checker ────────────────────────────────────────────────────
function lintCpp(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = []

  // Track bracket/brace/paren balance
  let braceDepth = 0
  let parenDepth = 0
  let bracketDepth = 0
  let lastOpenBraceLine = 0
  let lastOpenParenLine = 0

  // Common C++ keywords that should NOT be used as variable names
  const RESERVED = new Set([
    'int','long','short','char','bool','float','double','void','auto',
    'return','if','else','for','while','do','switch','case','break',
    'continue','class','struct','namespace','template','typename',
    'public','private','protected','const','static','inline','virtual',
  ])

  // STL types that need <> but are often written bare
  const STL_TYPES: Record<string, string> = {
    vector: 'vector<T>', map: 'map<K, V>', set: 'set<T>',
    unordered_map: 'unordered_map<K, V>', priority_queue: 'priority_queue<T>',
    stack: 'stack<T>', queue: 'queue<T>', deque: 'deque<T>', pair: 'pair<A, B>',
  }

  // Patterns that are definitely inside strings/comments — skip those lines
  const isStringOrComment = (line: string) => /^\s*(\/\/|\/\*)/.test(line)

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    const line = raw.trimEnd()
    const trimmed = line.trim()

    if (isStringOrComment(trimmed)) continue

    // Strip string literals to avoid false positives
    const stripped = trimmed.replace(/"([^"\\]|\\.)*"/g, '""').replace(/'([^'\\]|\\.)*'/g, "''")

    // ── Rule 1: Missing semicolon ─────────────────────────────────────────
    // Lines that look like statements but don't end with ; { } , ( ) \ : >>
    const needsSemicolon = /^[^#]/.test(stripped) &&                      // not a preprocessor
      !/^(\/\/|\/\*|\*|\{|\})/.test(stripped) &&                          // not comment/brace
      !stripped.endsWith(';') && !stripped.endsWith('{') &&
      !stripped.endsWith('}') && !stripped.endsWith(',') &&
      !stripped.endsWith('(') && !stripped.endsWith(')') &&               // multiline call
      !stripped.endsWith('\\') && !stripped.endsWith(':') &&              // macro / label
      !stripped.endsWith('>>') && !stripped.endsWith('>') &&
      /^(return|int |long |auto |char |bool |float |double |string |[a-z_]\w*\s*[+\-*/%|&^]?=)/.test(stripped) &&
      !/\bfor\b|\bif\b|\bwhile\b|\belse\b|\bstruct\b|\bclass\b/.test(stripped)

    if (needsSemicolon) {
      const col = line.length + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Expected ';' at end of statement.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 1,
      })
    }

    // ── Rule 2: STL type used without template angle brackets ─────────────
    for (const [name, full] of Object.entries(STL_TYPES)) {
      // Match "vector v" or "vector " not followed by '<'
      const rx = new RegExp(`\\b${name}\\s+(?!<)([a-zA-Z_]\\w*)`)
      const m = rx.exec(stripped)
      if (m) {
        const col = raw.indexOf(name) + 1
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: `'${name}' requires template arguments: use '${full}'.`,
          startLineNumber: lineNo, endLineNumber: lineNo,
          startColumn: col, endColumn: col + name.length,
        })
      }
    }

    // ── Rule 3: Reserved keyword used as variable name ────────────────────
    // e.g. "int return = 5;" or "auto int = ..."
    const varDecl = /\b(int|long|auto|char|bool|float|double|string)\s+(\w+)\s*[=;,(]/.exec(stripped)
    if (varDecl && RESERVED.has(varDecl[2])) {
      const col = raw.indexOf(varDecl[2]) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: `'${varDecl[2]}' is a reserved keyword and cannot be used as a variable name.`,
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + varDecl[2].length,
      })
    }

    // ── Rule 4: cout/cin without std:: or using namespace std ─────────────
    const hasUsing = lines.slice(0, i).some(l => /using\s+namespace\s+std/.test(l))
    if (!hasUsing) {
      const bare = /(?<!\w)(cout|cin|endl|cerr)\b/.exec(stripped)
      if (bare) {
        const col = raw.indexOf(bare[1]) + 1
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: `'${bare[1]}' is in namespace std. Add 'using namespace std;' or use 'std::${bare[1]}'.`,
          startLineNumber: lineNo, endLineNumber: lineNo,
          startColumn: col, endColumn: col + bare[1].length,
        })
      }
    }

    // ── Rule 5: endl performance hint ────────────────────────────────────
    if (/<<\s*endl\b/.test(stripped)) {
      const col = raw.indexOf('endl') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Prefer '\"\\n\"' over 'endl' — endl flushes the buffer and is significantly slower in competitive programming.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 4,
      })
    }

    // ── Rule 6: Brace / paren balance tracking ────────────────────────────
    for (const ch of stripped) {
      if (ch === '{') { braceDepth++; lastOpenBraceLine = lineNo }
      if (ch === '}') braceDepth--
      if (ch === '(') { parenDepth++; lastOpenParenLine = lineNo }
      if (ch === ')') parenDepth--
      if (ch === '[') bracketDepth++
      if (ch === ']') bracketDepth--
    }

    // Unmatched closing brace on this line
    if (braceDepth < 0) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Unexpected '}' — no matching opening '{' found.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: raw.lastIndexOf('}') + 1,
        endColumn: raw.lastIndexOf('}') + 2,
      })
      braceDepth = 0
    }

    // ── Rule 7: Division by zero literal ─────────────────────────────────
    if (/\/\s*0\b/.test(stripped) && !/\/\//.test(stripped.split('/0')[0] ?? '')) {
      const col = raw.search(/\/\s*0\b/) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: 'Division by zero — this causes undefined behaviour at runtime.',
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 8: scanf/printf without format string safety ─────────────────
    const scanfMatch = /\bscanf\s*\(\s*"([^"]*)"/.exec(stripped)
    if (scanfMatch && /%s/.test(scanfMatch[1])) {
      const col = raw.indexOf('scanf') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Unsafe '%s' in scanf — no bounds checking. Prefer scanf(\"%Ns\", ...) with a width limit or use cin.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 5,
      })
    }
  }

  // ── End-of-file: unclosed braces ─────────────────────────────────────────
  if (braceDepth > 0) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: `Unclosed '{' — missing ${braceDepth} closing '}'.`,
      startLineNumber: lastOpenBraceLine, endLineNumber: lastOpenBraceLine,
      startColumn: 1, endColumn: 2,
    })
  }
  if (parenDepth > 0) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: `Unclosed '(' — missing ${parenDepth} closing ')'.`,
      startLineNumber: lastOpenParenLine, endLineNumber: lastOpenParenLine,
      startColumn: 1, endColumn: 2,
    })
  }

  return markers
}

// Per-language linters map
const LINTERS: Partial<Record<string, (code: string, monaco: typeof Monaco) => Monaco.editor.IMarkerData[]>> = {
  cpp: lintCpp,
}

export function ProblemEditor({ statement, code, onCodeChange, onSubmit }: ProblemEditorProps) {
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0])
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof Monaco | null>(null)
  const lintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runLint = useCallback((currentCode: string, langId: string, monacoInstance: typeof Monaco, model: Monaco.editor.ITextModel) => {
    const linter = LINTERS[langId]
    if (!linter) {
      monacoInstance.editor.setModelMarkers(model, 'kodezilla', [])
      return
    }
    const markers = linter(currentCode, monacoInstance)
    monacoInstance.editor.setModelMarkers(model, 'kodezilla', markers)
  }, [])

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // ── C++ LSP-style enhancements ────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        const suggestions: Monaco.languages.CompletionItem[] = [
          // STL containers
          { label: 'vector', kind: monaco.languages.CompletionItemKind.Class, insertText: 'vector<${1:int}> ${2:v};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'STL dynamic array', range },
          { label: 'map', kind: monaco.languages.CompletionItemKind.Class, insertText: 'map<${1:int}, ${2:int}> ${3:mp};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'STL ordered map', range },
          { label: 'unordered_map', kind: monaco.languages.CompletionItemKind.Class, insertText: 'unordered_map<${1:int}, ${2:int}> ${3:mp};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Hash map O(1) avg', range },
          { label: 'set', kind: monaco.languages.CompletionItemKind.Class, insertText: 'set<${1:int}> ${2:s};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'STL ordered set', range },
          { label: 'priority_queue', kind: monaco.languages.CompletionItemKind.Class, insertText: 'priority_queue<${1:int}> ${2:pq};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Max-heap by default', range },
          { label: 'stack', kind: monaco.languages.CompletionItemKind.Class, insertText: 'stack<${1:int}> ${2:st};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'LIFO stack', range },
          { label: 'queue', kind: monaco.languages.CompletionItemKind.Class, insertText: 'queue<${1:int}> ${2:q};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'FIFO queue', range },
          { label: 'deque', kind: monaco.languages.CompletionItemKind.Class, insertText: 'deque<${1:int}> ${2:dq};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Double-ended queue', range },
          { label: 'pair', kind: monaco.languages.CompletionItemKind.Class, insertText: 'pair<${1:int}, ${2:int}> ${3:p};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'STL pair', range },
          // Algorithms
          { label: 'sort', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sort(${1:v.begin()}, ${2:v.end()});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort range ascending', range },
          { label: 'binary_search', kind: monaco.languages.CompletionItemKind.Function, insertText: 'binary_search(${1:v.begin()}, ${2:v.end()}, ${3:val})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Returns bool', range },
          { label: 'lower_bound', kind: monaco.languages.CompletionItemKind.Function, insertText: 'lower_bound(${1:v.begin()}, ${2:v.end()}, ${3:val})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'First element >= val', range },
          { label: 'upper_bound', kind: monaco.languages.CompletionItemKind.Function, insertText: 'upper_bound(${1:v.begin()}, ${2:v.end()}, ${3:val})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'First element > val', range },
          { label: 'reverse', kind: monaco.languages.CompletionItemKind.Function, insertText: 'reverse(${1:v.begin()}, ${2:v.end()});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Reverse range in-place', range },
          { label: 'accumulate', kind: monaco.languages.CompletionItemKind.Function, insertText: 'accumulate(${1:v.begin()}, ${2:v.end()}, ${3:0LL})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sum of range', range },
          { label: 'max_element', kind: monaco.languages.CompletionItemKind.Function, insertText: '*max_element(${1:v.begin()}, ${2:v.end()})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Maximum value in range', range },
          { label: 'min_element', kind: monaco.languages.CompletionItemKind.Function, insertText: '*min_element(${1:v.begin()}, ${2:v.end()})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Minimum value in range', range },
          // Snippets
          { label: 'forloop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop', range },
          { label: 'rep', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Repeat n times', range },
          { label: 'pb', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'push_back(${1})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'push_back shorthand', range },
          { label: 'endl_fast', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '"\\n"', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Use \\n not endl (faster)', range },
          // Typedefs
          { label: 'll', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'long long', documentation: 'long long', range },
          { label: 'pii', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'pair<int,int>', documentation: 'pair<int,int>', range },
          { label: 'vi', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'vector<int>', documentation: 'vector<int>', range },
        ]
        return { suggestions }
      },
      triggerCharacters: ['.', ':', '<', ' '],
    })

    // Hover docs for common STL
    monaco.languages.registerHoverProvider('cpp', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position)?.word
        const docs: Record<string, string> = {
          vector: '**vector\\<T\\>** — Dynamic array. O(1) amortized push_back, O(n) insert.',
          map: '**map\\<K,V\\>** — Red-black tree. O(log n) insert/find/erase.',
          unordered_map: '**unordered_map\\<K,V\\>** — Hash table. O(1) avg, O(n) worst.',
          set: '**set\\<T\\>** — Ordered unique elements. O(log n) ops.',
          priority_queue: '**priority_queue\\<T\\>** — Max-heap by default. O(log n) push/pop.',
          sort: '**sort(first, last)** — Introsort. O(n log n) worst-case.',
          lower_bound: '**lower_bound(first, last, val)** — Iterator to first element ≥ val.',
          upper_bound: '**upper_bound(first, last, val)** — Iterator to first element > val.',
        }
        if (word && docs[word]) {
          return { contents: [{ value: docs[word] }] }
        }
        return null
      },
    })

    // ── Run lint on initial load ──────────────────────────────────────────
    const model = editor.getModel()
    if (model) runLint(code, selectedLang.id, monaco, model)

    // Focus editor
    editor.focus()
  }

  function handleCodeChange(val: string) {
    onCodeChange(val)
    // Debounce lint by 600 ms so it doesn't fire on every keystroke
    if (lintTimer.current) clearTimeout(lintTimer.current)
    lintTimer.current = setTimeout(() => {
      const editor = editorRef.current
      const monaco = monacoRef.current
      if (!editor || !monaco) return
      const model = editor.getModel()
      if (model) runLint(val, selectedLang.id, monaco, model)
    }, 600)
  }

  function selectLanguage(lang: Language) {
    setSelectedLang(lang)
    onCodeChange(lang.template)
    setLangDropdownOpen(false)
    // Clear markers when switching languages
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (editor && monaco) {
      const model = editor.getModel()
      if (model) {
        monacoRef.current!.editor.setModelMarkers(model, 'kodezilla', [])
        // Lint immediately with the new language template
        setTimeout(() => runLint(lang.template, lang.id, monaco, model), 100)
      }
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Problem statement */}
      <article className="border border-neutral-900 bg-white p-6">
        <h2 className="mb-3 font-mono text-2xl font-semibold uppercase text-neutral-950">Problem Statement</h2>
        <p className="leading-8 text-neutral-700">{statement}</p>
      </article>

      {/* Code editor */}
      <article className="flex flex-col border border-neutral-900 bg-neutral-950">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-400">Code Editor</h2>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen((v) => !v)}
              className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-neutral-300 transition hover:border-white/20 hover:text-white"
            >
              {selectedLang.label}
              <ChevronDown size={12} className={`transition-transform duration-150 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-white/10 bg-neutral-900 shadow-2xl">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => selectLanguage(lang)}
                    className={[
                      'flex w-full items-center justify-between px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition',
                      selectedLang.id === lang.id
                        ? 'bg-accent text-white'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monaco editor */}
        <div className="flex-1 min-h-[400px]">
          <Editor
            height="100%"
            language={selectedLang.monaco}
            value={code}
            theme="vs-dark"
            onChange={(val) => handleCodeChange(val ?? '')}
            onMount={handleMount}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'off',
              suggestOnTriggerCharacters: true,
              quickSuggestions: { other: true, comments: false, strings: false },
              parameterHints: { enabled: true },
              formatOnPaste: true,
              formatOnType: true,
              bracketPairColorization: { enabled: true },
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              padding: { top: 12, bottom: 12 },
              scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
            }}
          />
        </div>

        {/* Submit bar */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-neutral-600">
            {selectedLang.label}
          </span>
          <Button variant="solid" onClick={() => onSubmit(selectedLang.id)}>
            Submit Solution
          </Button>
        </div>
      </article>
    </section>
  )
}
