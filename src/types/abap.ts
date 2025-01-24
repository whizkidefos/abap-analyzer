export interface ABAPAnalysis {
  codeQuality: number;
  performanceScore: number;
  bestPracticesScore: number;
  issues: CodeIssue[];
}

export interface CodeIssue {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

export interface ABAPSnippet {
  id: string;
  name: string;
  description: string;
  code: string;
  category: 'Report' | 'Function Module' | 'Class' | 'Interface';
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}