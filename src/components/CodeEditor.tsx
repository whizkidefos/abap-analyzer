import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { analyzeABAPCode } from '../utils/abapAnalyzer';
import { ABAPAnalysis, ABAPSnippet, KeyboardShortcut } from '../types/abap';
import { useTheme } from '../context/ThemeContext';
import { ExclamationCircleIcon, InformationCircleIcon, CheckCircleIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const SNIPPETS: ABAPSnippet[] = [
  {
    id: 'rap-bo',
    name: 'RAP Business Object',
    description: 'S/4HANA RAP Business Object Template',
    category: 'Class',
    code: `CLASS zcl_product_bo DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_rap_query_provider.
    INTERFACES if_rap_modification.
ENDCLASS.

CLASS zcl_product_bo IMPLEMENTATION.
  METHOD if_rap_query_provider~select.
    " Implement query logic
  ENDMETHOD.

  METHOD if_rap_modification~modify.
    " Implement modification logic
  ENDMETHOD.
ENDCLASS.`
  },
  {
    id: 'cds-view',
    name: 'CDS View',
    description: 'S/4HANA CDS View Template',
    category: 'Interface',
    code: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Product View'
define root view entity ZI_Product
  as select from I_Product
{
  key Product,
      ProductType,
      @Semantics.quantity.unitOfMeasure: 'BaseUnit'
      BaseUnit,
      CreatedBy,
      CreationDateTime,
      LastChangedBy,
      LastChangeDateTime
}`
  }
];

export default function CodeEditor() {
  const [analysis, setAnalysis] = useState<ABAPAnalysis | null>(null);
  const [showSnippets, setShowSnippets] = useState(false);
  const { theme } = useTheme();
  
  const defaultCode = `CLASS zcl_s4h_product_manager DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS:
      get_product_details
        IMPORTING
          iv_product_id TYPE matnr
        RETURNING
          VALUE(rs_product) TYPE ty_s_product.

ENDCLASS.

CLASS zcl_s4h_product_manager IMPLEMENTATION.
  METHOD get_product_details.
    SELECT SINGLE *
      FROM mara
      WHERE matnr = @iv_product_id
      INTO @DATA(ls_product).
      
    " Process product data
    LOOP AT lt_components INTO DATA(ls_component).
      " Handle components
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`;

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Ctrl+Space',
      description: 'Show code snippets',
      action: () => setShowSnippets(prev => !prev)
    },
    {
      key: 'Ctrl+S',
      description: 'Analyze code',
      action: () => handleEditorChange(editor?.getValue())
    }
  ];

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      const result = analyzeABAPCode(value);
      setAnalysis(result);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' }
      ],
      colors: {
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#00000000',
        'scrollbarSlider.hoverBackground': '#00000000',
        'scrollbarSlider.activeBackground': '#00000000',
      }
    });

    monaco.editor.defineTheme('customLight', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'A31515' },
        { token: 'comment', foreground: '008000', fontStyle: 'italic' }
      ],
      colors: {
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#00000000',
        'scrollbarSlider.hoverBackground': '#00000000',
        'scrollbarSlider.activeBackground': '#00000000',
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4 h-[calc(100vh-20rem)] md:h-[calc(100vh-24rem)]">
      <div className="flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSnippets(prev => !prev)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Show code snippets"
            >
              <CodeBracketIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                  {shortcut.key}
                </kbd>
                <span className="ml-2">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 grid gap-4" style={{ gridTemplateColumns: showSnippets ? '1fr 300px' : '1fr' }}>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Editor
              height="100%"
              defaultLanguage="abap"
              defaultValue={defaultCode}
              onChange={handleEditorChange}
              theme={theme === 'dark' ? 'customDark' : 'customLight'}
              beforeMount={beforeMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  useShadows: false
                }
              }}
            />
          </div>

          {showSnippets && (
            <div className={`rounded-lg shadow-lg overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Code Snippets
                </h3>
              </div>
              <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 57px)' }}>
                {SNIPPETS.map(snippet => (
                  <div
                    key={snippet.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      const editor = monaco.editor.getModels()[0];
                      if (editor) {
                        const position = editor.getPosition();
                        editor.pushEditOperations(
                          [],
                          [{
                            range: new monaco.Range(
                              position.lineNumber,
                              position.column,
                              position.lineNumber,
                              position.column
                            ),
                            text: snippet.code
                          }]
                        );
                      }
                    }}
                  >
                    <div className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {snippet.name}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {snippet.description}
                    </div>
                    <div className={`text-xs mt-2 inline-block px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {snippet.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-y-auto p-4`}>
        {analysis ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {analysis.codeQuality}%
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Code Quality
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {analysis.performanceScore}%
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Performance
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {analysis.bestPracticesScore}%
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Best Practices
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Analysis Results
              </h3>
              {analysis.issues.map((issue, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    theme === 'dark' 
                      ? (issue.severity === 'error' ? 'bg-red-900/50' : issue.severity === 'warning' ? 'bg-yellow-900/50' : 'bg-blue-900/50')
                      : (issue.severity === 'error' ? 'bg-red-50' : issue.severity === 'warning' ? 'bg-yellow-50' : 'bg-blue-50')
                  }`}
                >
                  {getSeverityIcon(issue.severity)}
                  <div>
                    <div className={`font-mono text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Line {issue.line}
                    </div>
                    <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {issue.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Start typing or paste your ABAP code to see the analysis results
          </div>
        )}
      </div>
    </div>
  );
}