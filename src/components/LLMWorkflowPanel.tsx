import { useState } from 'react'
import { X, Copy, Check, Wand2, ChevronRight, AlertCircle } from 'lucide-react'
import { generateLLMPrompt, parseDiagramSpec } from '../utils/diagram'
import type { DiagramExport } from '../types'

interface LLMWorkflowPanelProps {
  onClose: () => void
  onLoad: (spec: DiagramExport) => void
}

type Step = 1 | 2 | 3

export function LLMWorkflowPanel({ onClose, onLoad }: LLMWorkflowPanelProps) {
  const [step, setStep] = useState<Step>(1)
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [copied, setCopied] = useState(false)
  const [parseError, setParseError] = useState('')

  function handleGeneratePrompt() {
    const d = description.trim()
    if (!d) return
    setPrompt(generateLLMPrompt(d))
    setStep(2)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback: select the text
    }
  }

  function handleLoad() {
    setParseError('')
    try {
      const spec = parseDiagramSpec(response)
      onLoad(spec)
      onClose()
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Invalid JSON — check the format and try again.')
    }
  }

  const stepDot = (n: Step, label: string) => (
    <div className="flex items-center gap-2 mb-3">
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          step >= n ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'
        }`}
      >
        {n}
      </span>
      <span className="font-medium text-sm text-gray-700">{label}</span>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            <h2 className="font-semibold text-gray-800">LLM Workflow</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Explanation banner */}
          <p className="text-xs text-gray-500 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 leading-relaxed">
            Generate a prompt that describes your icon library, paste it into any AI assistant
            (Claude, ChatGPT, Gemini…), then paste the JSON response back here to auto-populate the canvas.
          </p>

          {/* Step 1 */}
          <div
            className={`rounded-xl border-2 p-4 transition-colors ${
              step === 1 ? 'border-purple-300 bg-purple-50/40' : 'border-gray-100'
            }`}
          >
            {stepDot(1, 'Describe your diagram')}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGeneratePrompt()
              }}
              placeholder="e.g. Show the intrinsic apoptosis pathway starting from cellular stress, through mitochondria, caspase cascade, to DNA fragmentation"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleGeneratePrompt}
              disabled={!description.trim()}
              className="mt-2 flex items-center gap-1.5 px-4 py-1.5 bg-purple-500 text-white text-xs font-medium rounded-lg hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Generate prompt
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2 */}
          {step >= 2 && (
            <div
              className={`rounded-xl border-2 p-4 transition-colors ${
                step === 2 ? 'border-blue-300 bg-blue-50/40' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                {stepDot(2, 'Copy prompt → paste into your LLM')}
                <button
                  onClick={handleCopy}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy to clipboard</>
                  )}
                </button>
              </div>
              <pre className="text-[10px] bg-gray-900 text-gray-200 rounded-lg p-3 overflow-auto max-h-44 font-mono leading-relaxed whitespace-pre-wrap">
                {prompt}
              </pre>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">
                  Paste into Claude, ChatGPT, Gemini, or any AI assistant — then paste the JSON response below.
                </p>
                <button
                  onClick={() => setStep(3)}
                  className="text-[10px] text-blue-500 hover:underline shrink-0 ml-4"
                >
                  I have the response →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step >= 2 && (
            <div
              className={`rounded-xl border-2 p-4 transition-colors ${
                step === 3 ? 'border-green-300 bg-green-50/40' : 'border-gray-100'
              }`}
            >
              {stepDot(3, "Paste the LLM's JSON response")}
              <textarea
                value={response}
                onChange={(e) => {
                  setResponse(e.target.value)
                  setParseError('')
                  if (e.target.value.trim()) setStep(3)
                }}
                placeholder={'{\n  "title": "My diagram",\n  "nodes": [ ... ],\n  "edges": [ ... ]\n}'}
                rows={6}
                className={`w-full text-xs font-mono border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 ${
                  parseError
                    ? 'border-red-300 bg-red-50 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-green-400'
                }`}
              />
              {parseError && (
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            disabled={!response.trim()}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Load diagram
          </button>
        </div>
      </div>
    </div>
  )
}
