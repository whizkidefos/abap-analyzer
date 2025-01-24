import { ABAPAnalysis, CodeIssue } from '../types/abap';

export function analyzeABAPCode(code: string): ABAPAnalysis {
  const issues: CodeIssue[] = [];
  const lines = code.split('\n');

  // Analyze code structure
  lines.forEach((line, index) => {
    // S/4HANA Specific Checks
    if (line.toUpperCase().includes('MATNR') && !line.toUpperCase().includes('TO_MATNR')) {
      issues.push({
        line: index + 1,
        severity: 'warning',
        message: 'Use TO_MATNR conversion for material numbers in S/4HANA',
        rule: 'S4H_MATNR_CONVERSION'
      });
    }

    if (line.toUpperCase().includes('MARA') && !line.toUpperCase().includes('I_PRODUCT')) {
      issues.push({
        line: index + 1,
        severity: 'warning',
        message: 'Consider using I_PRODUCT CDS view instead of MARA in S/4HANA',
        rule: 'S4H_CDS_VIEWS'
      });
    }

    // Check for SELECT * usage
    if (line.toUpperCase().includes('SELECT *')) {
      issues.push({
        line: index + 1,
        severity: 'warning',
        message: 'Avoid using SELECT *, specify required fields explicitly',
        rule: 'AVOID_SELECT_ALL'
      });
    }

    // Check for proper chain declarations
    if (line.toUpperCase().includes('CHAIN OF')) {
      if (!line.toUpperCase().includes('END-OF-CHAIN')) {
        issues.push({
          line: index + 1,
          severity: 'error',
          message: 'Missing END-OF-CHAIN statement',
          rule: 'CHAIN_STRUCTURE'
        });
      }
    }

    // Check for proper documentation
    if (line.includes('METHOD') && !lines[index - 1]?.includes('*')) {
      issues.push({
        line: index + 1,
        severity: 'info',
        message: 'Add method documentation',
        rule: 'METHOD_DOCUMENTATION'
      });
    }

    // S/4HANA RAP Check
    if (line.toUpperCase().includes('UPDATE DATABASE') || line.toUpperCase().includes('INSERT INTO')) {
      issues.push({
        line: index + 1,
        severity: 'warning',
        message: 'Consider using RAP business objects for database operations in S/4HANA',
        rule: 'S4H_RAP_USAGE'
      });
    }
  });

  // Calculate scores based on issues
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  return {
    codeQuality: calculateCodeQuality(errorCount, warningCount),
    performanceScore: calculatePerformanceScore(code),
    bestPracticesScore: calculateBestPracticesScore(code),
    issues
  };
}

function calculateCodeQuality(errors: number, warnings: number): number {
  const baseScore = 100;
  return Math.max(0, baseScore - (errors * 10) - (warnings * 5));
}

function calculatePerformanceScore(code: string): number {
  let score = 100;
  
  // S/4HANA specific performance checks
  if (code.toUpperCase().includes('SELECT * FROM')) score -= 15;
  if (!code.toUpperCase().includes('WITH INDICATORS')) score -= 5;
  if (code.toUpperCase().includes('LOOP AT') && !code.toUpperCase().includes('WHERE')) score -= 10;
  if (!code.toUpperCase().includes('CDS')) score -= 10;
  
  return Math.max(0, score);
}

function calculateBestPracticesScore(code: string): number {
  let score = 100;
  
  // S/4HANA best practices
  if (!code.includes('CLASS')) score -= 10;
  if (!code.toUpperCase().includes('TYPES:')) score -= 5;
  if (code.includes('BREAK-POINT')) score -= 20;
  if (!code.toUpperCase().includes('BDEF')) score -= 10;
  if (!code.toUpperCase().includes('BEHAVIOR IMPLEMENTATION')) score -= 10;
  
  return Math.max(0, score);
}