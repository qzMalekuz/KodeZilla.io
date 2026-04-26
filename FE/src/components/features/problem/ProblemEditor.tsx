import { useRef, useState, useCallback } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { Button } from '../../ui/Button'
import { ChevronDown } from 'lucide-react'
import type { Problem } from '../../../types'

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
  problem: Problem
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

// ── Python linter ─────────────────────────────────────────────────────────────
function lintPython(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = []

  let indentStack: number[] = [0]

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    const trimmed = raw.trimEnd()
    if (trimmed.trim() === '' || trimmed.trim().startsWith('#')) continue

    const stripped = trimmed.trim().replace(/"([^"\\]|\\.)*"/g, '""').replace(/'([^'\\]|\\.)*'/g, "''")

    // ── Rule 1: == used in assignment context ─────────────────────────────
    if (/^\w+\s*==\s*[^=]/.test(stripped) && !/\bif\b|\bwhile\b|\bassert\b|\breturn\b/.test(stripped)) {
      const col = raw.indexOf('==') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Did you mean '=' for assignment? '==' is a comparison operator.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 2: print without parentheses (Python 2 style) ────────────────
    if (/^print\s+[^(]/.test(stripped)) {
      const col = raw.indexOf('print') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Python 3: 'print' is a function — use print(...) with parentheses.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 5,
      })
    }

    // ── Rule 3: division that looks like integer division but uses / ───────
    if (/\/[^/=]/.test(stripped) && /\bint\b/.test(lines.slice(0, i).join(' '))) {
      // skip — too noisy without type info
    }

    // ── Rule 4: bare except ───────────────────────────────────────────────
    if (/^except\s*:/.test(stripped)) {
      const col = raw.indexOf('except') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Bare 'except:' catches all exceptions including KeyboardInterrupt. Prefer 'except Exception:'.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 6,
      })
    }

    // ── Rule 5: mutable default argument ─────────────────────────────────
    if (/def\s+\w+\s*\(.*=\s*(\[\]|\{\}|\(\))/.test(stripped)) {
      const col = raw.search(/=\s*(\[\]|\{\}|\(\))/) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Mutable default argument: [] or {} is shared across all calls. Use 'None' and initialise inside the function.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 6: missing colon after if/for/while/def/class ────────────────
    if (/^(if|elif|else|for|while|def|class|with|try|except|finally)\b/.test(stripped) && !stripped.endsWith(':') && !stripped.endsWith('\\')) {
      const col = raw.length + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Expected ':' at end of compound statement.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 1,
      })
    }

    // ── Rule 7: undefined name usage (common beginner typos) ─────────────
    const typos: Record<string, string> = { 'lenght': 'length', 'ture': 'True', 'flase': 'False', 'noen': 'None', 'pritn': 'print' }
    for (const [bad, good] of Object.entries(typos)) {
      if (new RegExp(`\\b${bad}\\b`).test(stripped)) {
        const col = raw.indexOf(bad) + 1
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: `Unknown name '${bad}'. Did you mean '${good}'?`,
          startLineNumber: lineNo, endLineNumber: lineNo,
          startColumn: col, endColumn: col + bad.length,
        })
      }
    }

    // ── Rule 8: == None instead of is None ───────────────────────────────
    if (/==\s*None/.test(stripped)) {
      const col = raw.indexOf('== None') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Use 'is None' instead of '== None' for identity comparison.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 7,
      })
    }
  }

  return markers
}

// ── Java linter ───────────────────────────────────────────────────────────────
function lintJava(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = []
  let braceDepth = 0
  let lastOpenLine = 0

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    const trimmed = raw.trimEnd()
    if (/^\s*(\/\/|\/\*)/.test(trimmed)) continue
    const stripped = trimmed.trim().replace(/"([^"\\]|\\.)*"/g, '""')

    // ── Rule 1: Missing semicolon ─────────────────────────────────────────
    if (
      !stripped.endsWith(';') && !stripped.endsWith('{') &&
      !stripped.endsWith('}') && !stripped.endsWith(',') &&
      !stripped.endsWith('(') && stripped !== '' &&
      /^(return|int |long |String |boolean |double |float |char |var |[a-z]\w*\s*[+\-*]?=)/.test(stripped) &&
      !/\bif\b|\bfor\b|\bwhile\b|\belse\b|\bclass\b|\binterface\b/.test(stripped)
    ) {
      const col = trimmed.length + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Expected ';' at end of statement.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 1,
      })
    }

    // ── Rule 2: System.out.println on a potentially null object ──────────
    if (/System\.out\.println\s*\(\s*\)/.test(stripped)) {
      const col = raw.indexOf('System.out.println') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "println() with no args prints an empty line. Did you forget an argument?",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 18,
      })
    }

    // ── Rule 3: == for String comparison ─────────────────────────────────
    if (/"\s*==\s*"/.test(stripped) || /\bString\b.*==/.test(stripped)) {
      const col = raw.indexOf('==') + 1
      if (col > 0) markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Use .equals() to compare Strings in Java, not '=='. '==' compares object references.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 4: catching generic Exception silently ───────────────────────
    if (/catch\s*\(\s*Exception\s+\w+\s*\)\s*\{\s*\}/.test(stripped)) {
      const col = raw.indexOf('catch') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Empty catch block swallows exceptions silently. At least log the error.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 5,
      })
    }

    // ── Rule 5: int overflow risk ─────────────────────────────────────────
    if (/\bint\b.*(1000000000|\*.*\*)/.test(stripped)) {
      const col = raw.search(/\bint\b/) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Potential int overflow with large values. Consider using 'long' instead.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 3,
      })
    }

    // ── Rule 6: Brace balance ─────────────────────────────────────────────
    for (const ch of stripped) {
      if (ch === '{') { braceDepth++; lastOpenLine = lineNo }
      if (ch === '}') braceDepth--
    }
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
  }

  if (braceDepth > 0) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: `Unclosed '{' — missing ${braceDepth} closing '}'.`,
      startLineNumber: lastOpenLine, endLineNumber: lastOpenLine,
      startColumn: 1, endColumn: 2,
    })
  }

  return markers
}

// ── JavaScript linter ─────────────────────────────────────────────────────────
function lintJavaScript(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = []
  let braceDepth = 0, lastOpenLine = 0

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    if (/^\s*\/\//.test(raw)) continue
    const stripped = raw.trim().replace(/"([^"\\]|\\.)*"/g, '""').replace(/`([^`\\]|\\.)*`/g, '``')

    // ── Rule 1: var usage ─────────────────────────────────────────────────
    if (/\bvar\b/.test(stripped)) {
      const col = raw.indexOf('var') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "'var' is function-scoped and hoisted. Use 'const' or 'let' instead.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 3,
      })
    }

    // ── Rule 2: == instead of === ─────────────────────────────────────────
    const eqMatch = /(?<![=!<>])={2}(?!=)/.exec(stripped)
    if (eqMatch) {
      const col = raw.indexOf('==') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Use '===' (strict equality) instead of '==' to avoid unexpected type coercion.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 3: console.log left in ──────────────────────────────────────
    if (/\bconsole\.log\b/.test(stripped)) {
      const col = raw.indexOf('console.log') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Remove console.log before submitting — debug output may affect judge output matching.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 11,
      })
    }

    // ── Rule 4: == null check (prefer nullish) ────────────────────────────
    if (/==\s*null\b/.test(stripped) || /==\s*undefined\b/.test(stripped)) {
      const col = raw.search(/==\s*(null|undefined)/) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Use '=== null' or '??' (nullish coalescing) for clearer null/undefined checks.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 5: Brace balance ─────────────────────────────────────────────
    for (const ch of stripped) {
      if (ch === '{') { braceDepth++; lastOpenLine = lineNo }
      if (ch === '}') braceDepth--
    }
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

    // ── Rule 6: parseInt without radix ───────────────────────────────────
    if (/\bparseInt\s*\([^,)]+\)/.test(stripped)) {
      const col = raw.indexOf('parseInt') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Always pass a radix to parseInt(), e.g. parseInt(x, 10) to avoid octal parsing bugs.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 8,
      })
    }
  }

  if (braceDepth > 0) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: `Unclosed '{' — missing ${braceDepth} closing '}'.`,
      startLineNumber: lastOpenLine, endLineNumber: lastOpenLine,
      startColumn: 1, endColumn: 2,
    })
  }

  return markers
}

// ── TypeScript linter (extends JS rules) ─────────────────────────────────────
function lintTypeScript(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = [...lintJavaScript(code, monaco)]

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    if (/^\s*\/\//.test(raw)) continue
    const stripped = raw.trim()

    // ── Rule 1: any type usage ────────────────────────────────────────────
    if (/:\s*any\b/.test(stripped) || /as\s+any\b/.test(stripped)) {
      const col = raw.search(/:\s*any\b|as\s+any\b/) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Avoid 'any' — it disables TypeScript's type checking. Use a specific type or 'unknown'.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 3,
      })
    }

    // ── Rule 2: non-null assertion overuse ────────────────────────────────
    if (/!\./.test(stripped)) {
      const col = raw.indexOf('!.') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Non-null assertion '!' bypasses null checks. Consider optional chaining '?.' or a null guard instead.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 3: @ts-ignore without explanation ────────────────────────────
    if (/@ts-ignore/.test(stripped)) {
      const col = raw.indexOf('@ts-ignore') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "'@ts-ignore' suppresses all errors on the next line. Prefer '@ts-expect-error' or fix the root cause.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 10,
      })
    }

    // ── Rule 4: console.log left in (override hint from JS linter) ────────
    // Already covered by JS linter — skip duplicate
  }

  return markers
}

// ── Go linter ─────────────────────────────────────────────────────────────────
function lintGo(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = []
  let braceDepth = 0, lastOpenLine = 0

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    if (/^\s*\/\//.test(raw)) continue
    const stripped = raw.trim().replace(/"([^"\\]|\\.)*"/g, '""')

    // ── Rule 1: fmt.Println left in ──────────────────────────────────────
    if (/\bfmt\.Println\b/.test(stripped) && i > 5) {
      const col = raw.indexOf('fmt.Println') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Remove fmt.Println debug statements before submitting — output must match exactly.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 11,
      })
    }

    // ── Rule 2: err ignored (:= without checking err) ─────────────────────
    if (/,\s*_\s*:=/.test(stripped) && /err/.test(raw)) {
      const col = raw.indexOf('_') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "Ignoring error return value with '_'. Unhandled errors can cause silent failures.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 1,
      })
    }

    // ── Rule 3: goroutine without WaitGroup/channel sync ─────────────────
    if (/\bgo\s+\w+\s*\(/.test(stripped)) {
      const col = raw.search(/\bgo\s+\w+\s*\(/) + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "Goroutine launched — ensure it's synchronised with sync.WaitGroup or a channel, or the main goroutine may exit before it finishes.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 4: := in package scope (only valid inside functions) ─────────
    if (/^\w+\s*:=/.test(stripped) && braceDepth === 0 && !/^func\b/.test(stripped)) {
      const col = raw.indexOf(':=') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "':=' short variable declaration is not allowed at package scope. Use 'var' instead.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 2,
      })
    }

    // ── Rule 5: Brace must be on same line in Go ─────────────────────────
    if (/^(func|if|for|switch|select)\b/.test(stripped) && !stripped.endsWith('{') && !stripped.endsWith(')')) {
      // next line starts with {
      const nextLine = (lines[i + 1] ?? '').trim()
      if (nextLine === '{') {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: "In Go, the opening '{' must be on the same line as the statement — not on a new line.",
          startLineNumber: lineNo + 1, endLineNumber: lineNo + 1,
          startColumn: (lines[i + 1] ?? '').indexOf('{') + 1,
          endColumn: (lines[i + 1] ?? '').indexOf('{') + 2,
        })
      }
    }

    // ── Rule 6: Brace balance ─────────────────────────────────────────────
    for (const ch of stripped) {
      if (ch === '{') { braceDepth++; lastOpenLine = lineNo }
      if (ch === '}') braceDepth--
    }
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
  }

  if (braceDepth > 0) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: `Unclosed '{' — missing ${braceDepth} closing '}'.`,
      startLineNumber: lastOpenLine, endLineNumber: lastOpenLine,
      startColumn: 1, endColumn: 2,
    })
  }

  return markers
}

// ── Rust linter ───────────────────────────────────────────────────────────────
function lintRust(code: string, monaco: typeof Monaco): Monaco.editor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: Monaco.editor.IMarkerData[] = []
  let braceDepth = 0, lastOpenLine = 0

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const raw = lines[i]
    if (/^\s*\/\//.test(raw)) continue
    const stripped = raw.trim().replace(/"([^"\\]|\\.)*"/g, '""')

    // ── Rule 1: unwrap() on Result/Option ────────────────────────────────
    if (/\.unwrap\(\)/.test(stripped)) {
      const col = raw.indexOf('.unwrap()') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: "'.unwrap()' panics on Err/None. Prefer '.expect(\"message\")' for debugging or match/if let for safe handling.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 9,
      })
    }

    // ── Rule 2: Missing semicolon on non-expression lines ─────────────────
    if (
      !stripped.endsWith(';') && !stripped.endsWith('{') &&
      !stripped.endsWith('}') && !stripped.endsWith(',') &&
      !stripped.endsWith('(') && stripped !== '' &&
      /^(let |return |println!|eprintln!)/.test(stripped) &&
      !stripped.endsWith(')')
    ) {
      const col = raw.trimEnd().length + 1
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Expected ';' at end of statement.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 1,
      })
    }

    // ── Rule 3: let mut without mutation ─────────────────────────────────
    // Track mut vars and warn if never reassigned — simplified: just hint on let mut
    if (/\blet\s+mut\b/.test(stripped)) {
      const varMatch = /let\s+mut\s+(\w+)/.exec(stripped)
      if (varMatch) {
        const varName = varMatch[1]
        const rest = lines.slice(i + 1).join('\n')
        if (!new RegExp(`\\b${varName}\\s*(=|\\+=|-=|\\*=)`).test(rest)) {
          const col = raw.indexOf('mut') + 1
          markers.push({
            severity: monaco.MarkerSeverity.Hint,
            message: `Variable '${varName}' is declared 'mut' but never mutated. Remove 'mut'.`,
            startLineNumber: lineNo, endLineNumber: lineNo,
            startColumn: col, endColumn: col + 3,
          })
        }
      }
    }

    // ── Rule 4: clone() overuse ───────────────────────────────────────────
    if (/\.clone\(\)/.test(stripped)) {
      const col = raw.indexOf('.clone()') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "'.clone()' allocates a new copy. Consider borrowing ('&') to avoid the allocation if ownership isn't needed.",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 8,
      })
    }

    // ── Rule 5: println! without format arg ──────────────────────────────
    if (/\bprintln!\s*\(\s*\)/.test(stripped)) {
      const col = raw.indexOf('println!') + 1
      markers.push({
        severity: monaco.MarkerSeverity.Hint,
        message: "println!() with no arguments prints an empty line. Did you forget a format string?",
        startLineNumber: lineNo, endLineNumber: lineNo,
        startColumn: col, endColumn: col + 8,
      })
    }

    // ── Rule 6: Brace balance ─────────────────────────────────────────────
    for (const ch of stripped) {
      if (ch === '{') { braceDepth++; lastOpenLine = lineNo }
      if (ch === '}') braceDepth--
    }
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
  }

  if (braceDepth > 0) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: `Unclosed '{' — missing ${braceDepth} closing '}'.`,
      startLineNumber: lastOpenLine, endLineNumber: lastOpenLine,
      startColumn: 1, endColumn: 2,
    })
  }

  return markers
}

// Per-language linters map
const LINTERS: Partial<Record<string, (code: string, monaco: typeof Monaco) => Monaco.editor.IMarkerData[]>> = {
  cpp:        lintCpp,
  python:     lintPython,
  java:       lintJava,
  javascript: lintJavaScript,
  typescript: lintTypeScript,
  go:         lintGo,
  rust:       lintRust,
}

export function ProblemEditor({ problem, code, onCodeChange, onSubmit }: ProblemEditorProps) {
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
      provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
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
      provideHover: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
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

    // ── Python completions + hover ────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordUntilPosition(position)
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
        const suggestions: Monaco.languages.CompletionItem[] = [
          { label: 'len', kind: monaco.languages.CompletionItemKind.Function, insertText: 'len(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return length of object', range },
          { label: 'range', kind: monaco.languages.CompletionItemKind.Function, insertText: 'range(${1:n})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Range of integers', range },
          { label: 'enumerate', kind: monaco.languages.CompletionItemKind.Function, insertText: 'enumerate(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Enumerate with index', range },
          { label: 'zip', kind: monaco.languages.CompletionItemKind.Function, insertText: 'zip(${1:a}, ${2:b})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Zip iterables together', range },
          { label: 'sorted', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sorted(${1:iterable}, key=${2:None}, reverse=${3:False})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return sorted list', range },
          { label: 'map', kind: monaco.languages.CompletionItemKind.Function, insertText: 'map(${1:func}, ${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Apply function to iterable', range },
          { label: 'filter', kind: monaco.languages.CompletionItemKind.Function, insertText: 'filter(${1:func}, ${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Filter iterable by predicate', range },
          { label: 'int', kind: monaco.languages.CompletionItemKind.Function, insertText: 'int(${1:x})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to integer', range },
          { label: 'str', kind: monaco.languages.CompletionItemKind.Function, insertText: 'str(${1:x})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to string', range },
          { label: 'split', kind: monaco.languages.CompletionItemKind.Method, insertText: 'split(${1:" "})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Split string by delimiter', range },
          { label: 'join', kind: monaco.languages.CompletionItemKind.Method, insertText: '"${1: }".join(${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Join iterable into string', range },
          { label: 'defaultdict', kind: monaco.languages.CompletionItemKind.Class, insertText: 'defaultdict(${1:int})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'collections.defaultdict', range },
          { label: 'heapq', kind: monaco.languages.CompletionItemKind.Module, insertText: 'heapq', documentation: 'Heap queue module', range },
          { label: 'bisect', kind: monaco.languages.CompletionItemKind.Module, insertText: 'bisect', documentation: 'Array bisection / binary search module', range },
          { label: 'forloop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for ${1:i} in range(${2:n}):\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop', range },
          { label: 'listcomp', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '[${1:expr} for ${2:x} in ${3:iterable}]', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'List comprehension', range },
          { label: 'dictcomp', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '{${1:k}: ${2:v} for ${3:k}, ${4:v} in ${5:iterable}}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Dict comprehension', range },
          { label: 'input_ints', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'list(map(int, input().split()))', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Read line of integers', range },
        ]
        return { suggestions }
      },
      triggerCharacters: ['.', '(', ' '],
    })

    monaco.languages.registerHoverProvider('python', {
      provideHover: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordAtPosition(position)?.word
        const docs: Record<string, string> = {
          len: '**len(obj)** — Returns the number of items in a container.',
          range: '**range(stop)** / **range(start, stop[, step])** — Immutable sequence of numbers.',
          enumerate: '**enumerate(iterable, start=0)** — Returns (index, value) pairs.',
          sorted: '**sorted(iterable, *, key=None, reverse=False)** — Returns a new sorted list.',
          defaultdict: '**defaultdict(default_factory)** — dict subclass that calls factory for missing keys.',
          bisect: '**bisect** — Binary search in sorted list. bisect_left / bisect_right.',
          heapq: '**heapq** — Min-heap. heappush(h, x), heappop(h), heapify(h).',
        }
        if (word && docs[word]) return { contents: [{ value: docs[word] }] }
        return null
      },
    })

    // ── Java completions + hover ──────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordUntilPosition(position)
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
        const suggestions: Monaco.languages.CompletionItem[] = [
          { label: 'ArrayList', kind: monaco.languages.CompletionItemKind.Class, insertText: 'ArrayList<${1:Integer}> ${2:list} = new ArrayList<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Dynamic array', range },
          { label: 'HashMap', kind: monaco.languages.CompletionItemKind.Class, insertText: 'HashMap<${1:Integer}, ${2:Integer}> ${3:map} = new HashMap<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Hash map', range },
          { label: 'TreeMap', kind: monaco.languages.CompletionItemKind.Class, insertText: 'TreeMap<${1:Integer}, ${2:Integer}> ${3:map} = new TreeMap<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sorted map (Red-Black tree)', range },
          { label: 'PriorityQueue', kind: monaco.languages.CompletionItemKind.Class, insertText: 'PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Min-heap priority queue', range },
          { label: 'Arrays.sort', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Arrays.sort(${1:arr});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort array in-place', range },
          { label: 'Collections.sort', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Collections.sort(${1:list});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort list in-place', range },
          { label: 'StringBuilder', kind: monaco.languages.CompletionItemKind.Class, insertText: 'StringBuilder ${1:sb} = new StringBuilder();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Mutable string builder', range },
          { label: 'BufferedReader', kind: monaco.languages.CompletionItemKind.Class, insertText: 'BufferedReader ${1:br} = new BufferedReader(new InputStreamReader(System.in));', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Fast input reader', range },
          { label: 'sout', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.out.println(${1});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to stdout', range },
          { label: 'forloop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop', range },
          { label: 'Math.max', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Math.max(${1:a}, ${2:b})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Maximum of two values', range },
          { label: 'Math.min', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Math.min(${1:a}, ${2:b})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Minimum of two values', range },
        ]
        return { suggestions }
      },
      triggerCharacters: ['.', '(', ' '],
    })

    monaco.languages.registerHoverProvider('java', {
      provideHover: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordAtPosition(position)?.word
        const docs: Record<string, string> = {
          ArrayList: '**ArrayList\\<E\\>** — Resizable array. O(1) get/add, O(n) insert/remove.',
          HashMap: '**HashMap\\<K,V\\>** — Hash table. O(1) avg get/put.',
          TreeMap: '**TreeMap\\<K,V\\>** — Red-Black tree. O(log n) get/put. Keys sorted.',
          PriorityQueue: '**PriorityQueue\\<E\\>** — Min-heap. O(log n) offer/poll.',
          StringBuilder: '**StringBuilder** — Mutable string. Use instead of String + for concatenation in loops.',
          BufferedReader: '**BufferedReader** — Fast buffered input. Prefer over Scanner for competitive programming.',
        }
        if (word && docs[word]) return { contents: [{ value: docs[word] }] }
        return null
      },
    })

    // ── JavaScript / TypeScript completions + hover ───────────────────────
    for (const lang of ['javascript', 'typescript'] as const) {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
          const word = model.getWordUntilPosition(position)
          const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
          const suggestions: Monaco.languages.CompletionItem[] = [
            { label: 'console.log', kind: monaco.languages.CompletionItemKind.Function, insertText: 'console.log(${1})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Log to stdout', range },
            { label: 'Array.from', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Array.from({length: ${1:n}}, (_, ${2:i}) => ${3:i})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create array of length n', range },
            { label: 'sort_num', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '${1:arr}.sort((a, b) => a - b)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Numeric sort ascending', range },
            { label: 'reduce', kind: monaco.languages.CompletionItemKind.Method, insertText: '${1:arr}.reduce((${2:acc}, ${3:cur}) => ${4:acc + cur}, ${5:0})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Reduce array to value', range },
            { label: 'Map', kind: monaco.languages.CompletionItemKind.Class, insertText: 'new Map()', documentation: 'ES6 Map — O(1) get/set', range },
            { label: 'Set', kind: monaco.languages.CompletionItemKind.Class, insertText: 'new Set()', documentation: 'ES6 Set — unique values', range },
            { label: 'parseInt', kind: monaco.languages.CompletionItemKind.Function, insertText: 'parseInt(${1:str}, 10)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Parse integer with radix 10', range },
            { label: 'Math.max', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Math.max(${1:a}, ${2:b})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Maximum of values', range },
            { label: 'Math.min', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Math.min(${1:a}, ${2:b})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Minimum of values', range },
            { label: 'forloop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop', range },
            { label: 'arrowfn', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '(${1:x}) => ${2:x}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Arrow function', range },
          ]
          return { suggestions }
        },
        triggerCharacters: ['.', '(', ' '],
      })

      monaco.languages.registerHoverProvider(lang, {
        provideHover: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
          const word = model.getWordAtPosition(position)?.word
          const docs: Record<string, string> = {
            Map: '**Map\\<K,V\\>** — ES6 Map. O(1) get/set/has. Preserves insertion order.',
            Set: '**Set\\<T\\>** — ES6 Set. O(1) add/has/delete. Unique values only.',
            reduce: '**arr.reduce(fn, init)** — Folds array to single value left-to-right.',
            parseInt: '**parseInt(str, radix)** — Always pass radix=10 to avoid octal bugs.',
            Promise: '**Promise\\<T\\>** — Represents an async operation. Use async/await for cleaner syntax.',
          }
          if (word && docs[word]) return { contents: [{ value: docs[word] }] }
          return null
        },
      })
    }

    // ── Go completions + hover ────────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider('go', {
      provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordUntilPosition(position)
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
        const suggestions: Monaco.languages.CompletionItem[] = [
          { label: 'fmt.Println', kind: monaco.languages.CompletionItemKind.Function, insertText: 'fmt.Println(${1})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print line to stdout', range },
          { label: 'fmt.Fprintf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'fmt.Fprintf(os.Stdout, "${1:%d}\\n", ${2:val})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Formatted print to writer', range },
          { label: 'fmt.Scan', kind: monaco.languages.CompletionItemKind.Function, insertText: 'fmt.Scan(&${1:x})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Read from stdin', range },
          { label: 'make_slice', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '${1:s} := make([]${2:int}, ${3:n})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Make a slice of length n', range },
          { label: 'make_map', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '${1:m} := make(map[${2:int}]${3:int})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Make a map', range },
          { label: 'forrange', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for ${1:i}, ${2:v} := range ${3:slice} {\n\t${4}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For-range loop', range },
          { label: 'goroutine', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'go func() {\n\t${1}\n}()', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Anonymous goroutine', range },
          { label: 'sort.Ints', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sort.Ints(${1:slice})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort []int ascending', range },
          { label: 'sort.Slice', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sort.Slice(${1:s}, func(i, j int) bool { return ${1:s}[i] < ${1:s}[j] })', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort slice with custom comparator', range },
          { label: 'bufio_scan', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'scanner := bufio.NewScanner(os.Stdin)\nscanner.Buffer(make([]byte, 1<<20), 1<<20)\nfor scanner.Scan() {\n\tline := scanner.Text()\n\t_ = line\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Buffered line scanner', range },
        ]
        return { suggestions }
      },
      triggerCharacters: ['.', '(', ' '],
    })

    monaco.languages.registerHoverProvider('go', {
      provideHover: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordAtPosition(position)?.word
        const docs: Record<string, string> = {
          make: '**make(t, n)** — Allocates and initialises slices, maps, channels. Returns reference type.',
          append: '**append(slice, elems...)** — Appends elements to slice. May allocate new backing array.',
          defer: '**defer** — Schedules function call to run when surrounding function returns. LIFO order.',
          goroutine: '**go func()** — Launches a concurrent goroutine. Synchronise with channels or sync.WaitGroup.',
          channel: '**chan T** — Typed channel for goroutine communication. Use make(chan T, buf) for buffered.',
        }
        if (word && docs[word]) return { contents: [{ value: docs[word] }] }
        return null
      },
    })

    // ── Rust completions + hover ──────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider('rust', {
      provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordUntilPosition(position)
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
        const suggestions: Monaco.languages.CompletionItem[] = [
          { label: 'println', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'println!("{}", ${1:val});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to stdout', range },
          { label: 'eprintln', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'eprintln!("{}", ${1:val});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to stderr', range },
          { label: 'vec_new', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'let ${1:v}: Vec<${2:i64}> = Vec::new();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'New empty Vec', range },
          { label: 'vec_macro', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'vec![${1:0}; ${2:n}]', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Vec filled with value', range },
          { label: 'HashMap', kind: monaco.languages.CompletionItemKind.Class, insertText: 'use std::collections::HashMap;\nlet ${1:map}: HashMap<${2:i64}, ${3:i64}> = HashMap::new();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Hash map', range },
          { label: 'BTreeMap', kind: monaco.languages.CompletionItemKind.Class, insertText: 'use std::collections::BTreeMap;\nlet ${1:map}: BTreeMap<${2:i64}, ${3:i64}> = BTreeMap::new();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sorted map (B-tree)', range },
          { label: 'BinaryHeap', kind: monaco.languages.CompletionItemKind.Class, insertText: 'use std::collections::BinaryHeap;\nlet ${1:heap}: BinaryHeap<${2:i64}> = BinaryHeap::new();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Max-heap priority queue', range },
          { label: 'match_expr', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'match ${1:expr} {\n\t${2:pattern} => ${3:result},\n\t_ => ${4:default},\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Match expression', range },
          { label: 'if_let', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if let Some(${1:val}) = ${2:option} {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'if let destructure', range },
          { label: 'sort', kind: monaco.languages.CompletionItemKind.Method, insertText: '${1:v}.sort();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort Vec in-place (ascending)', range },
          { label: 'sort_by', kind: monaco.languages.CompletionItemKind.Method, insertText: '${1:v}.sort_by(|a, b| a.cmp(b));', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sort Vec with comparator', range },
          { label: 'iter_collect', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '${1:iter}.collect::<Vec<_>>()', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Collect iterator into Vec', range },
          { label: 'read_line', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'let mut ${1:line} = String::new();\nstd::io::stdin().read_line(&mut ${1:line}).unwrap();\nlet ${1:line} = ${1:line}.trim();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Read a line from stdin', range },
        ]
        return { suggestions }
      },
      triggerCharacters: ['.', ':', '(', ' '],
    })

    monaco.languages.registerHoverProvider('rust', {
      provideHover: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordAtPosition(position)?.word
        const docs: Record<string, string> = {
          Vec: '**Vec\\<T\\>** — Growable heap-allocated array. O(1) amortized push, O(1) index.',
          HashMap: '**HashMap\\<K,V\\>** — Hash table. O(1) avg insert/get. Use BTreeMap for sorted order.',
          BTreeMap: '**BTreeMap\\<K,V\\>** — B-Tree sorted map. O(log n) insert/get. Keys always ordered.',
          BinaryHeap: '**BinaryHeap\\<T\\>** — Max-heap. O(log n) push/pop. Use Reverse<T> for min-heap.',
          unwrap: '**.unwrap()** — Extracts Ok/Some value, panics on Err/None. Use .expect("msg") for better panic messages.',
          clone: '**.clone()** — Deep copies the value. Requires Clone trait. Consider borrowing to avoid allocation.',
          iter: '**.iter()** — Borrows elements as &T. Use .iter_mut() for &mut T or .into_iter() for owned T.',
        }
        if (word && docs[word]) return { contents: [{ value: docs[word] }] }
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
    <section className="grid gap-3 lg:grid-cols-2" style={{ height: 'calc(100vh - 152px)' }}>
      {/* Problem statement */}
      <article className="overflow-y-auto border border-neutral-900 bg-white p-6">
        {/* Limits */}
        {(problem.timeLimit || problem.memoryLimit) && (
          <div className="mb-5 flex gap-6 font-mono text-xs text-neutral-500">
            {problem.timeLimit && <span>time limit: {problem.timeLimit}</span>}
            {problem.memoryLimit && <span>memory limit: {problem.memoryLimit}</span>}
          </div>
        )}

        {/* Statement */}
        <h2 className="mb-3 font-mono text-xl font-semibold uppercase text-neutral-950">Problem Statement</h2>
        <p className="mb-5 whitespace-pre-line leading-7 text-neutral-700">
          {problem.statement ?? 'No statement provided.'}
        </p>

        {/* Input format */}
        {problem.inputFormat && (
          <div className="mb-5">
            <h3 className="mb-1 font-mono text-sm font-semibold uppercase tracking-wide text-neutral-950">Input</h3>
            <p className="whitespace-pre-line leading-7 text-neutral-600 text-sm">{problem.inputFormat}</p>
          </div>
        )}

        {/* Output format */}
        {problem.outputFormat && (
          <div className="mb-5">
            <h3 className="mb-1 font-mono text-sm font-semibold uppercase tracking-wide text-neutral-950">Output</h3>
            <p className="whitespace-pre-line leading-7 text-neutral-600 text-sm">{problem.outputFormat}</p>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-2 font-mono text-sm font-semibold uppercase tracking-wide text-neutral-950">Constraints</h3>
            <ul className="space-y-1">
              {problem.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wide text-neutral-950">Examples</h3>
            <div className="space-y-4">
              {problem.examples.map((ex, i) => (
                <div key={i} className="border border-neutral-900/15">
                  <div className="grid grid-cols-2 divide-x divide-neutral-900/15">
                    <div className="p-3">
                      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">Input</p>
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-neutral-800">{ex.input}</pre>
                    </div>
                    <div className="p-3">
                      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">Output</p>
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-neutral-800">{ex.output}</pre>
                    </div>
                  </div>
                  {ex.explanation && (
                    <div className="border-t border-neutral-900/10 bg-neutral-50 px-3 py-2">
                      <p className="text-xs leading-5 text-neutral-500"><span className="font-semibold text-neutral-700">Note: </span>{ex.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {problem.note && (
          <div className="border-l-2 border-accent pl-4">
            <h3 className="mb-1 font-mono text-sm font-semibold uppercase tracking-wide text-neutral-950">Note</h3>
            <p className="text-sm leading-6 text-neutral-600">{problem.note}</p>
          </div>
        )}
      </article>

      {/* Code editor */}
      <article className="flex min-h-0 flex-col border border-neutral-900 bg-neutral-950">
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
        <div className="min-h-0 flex-1">
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
