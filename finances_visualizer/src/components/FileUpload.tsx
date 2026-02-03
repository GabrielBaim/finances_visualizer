import { useState, useRef, useCallback } from 'react'
import { parseCSVFile, validateCSVFile } from '@/lib/csv-parser'
import type { Transaction } from '@/types/transaction'

interface FileUploadProps {
  onFileLoad: (transactions: Transaction[]) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in bytes
}

export function FileUpload({
  onFileLoad,
  onError,
  accept = '.csv',
  maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length === 0) return

      await processFile(files[0])
    },
    []
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      await processFile(files[0])
    },
    []
  )

  const processFile = async (file: File) => {
    // Validate file
    const validation = validateCSVFile(file)
    if (!validation.valid) {
      onError?.(validation.error || 'Arquivo inválido')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const result = await parseCSVFile(file, (percent) => {
        setProgress(percent)
      })

      // Check if we got any transactions
      if (result.transactions.length === 0) {
        onError?.('Nenhuma transação encontrada no arquivo.')
        return
      }

      // Show errors if any
      if (result.errors.length > 0) {
        console.warn('Parsing errors:', result.errors)
        onError?.(
          `Arquivo processado com ${result.errors.length} erro(s). Verifique o console para detalhes.`
        )
      }

      onFileLoad(result.transactions)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao processar arquivo'
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
      setProgress(0)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-slate-600 hover:border-primary hover:bg-slate-800/50'
          }
          ${isProcessing ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {isProcessing ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-white">
              Processando arquivo...
            </p>
            <div className="w-full max-w-xs mx-auto bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400">{progress.toFixed(0)}%</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                Arraste e solte seu arquivo CSV aqui
              </p>
              <p className="text-sm text-slate-400 mt-2">
                ou clique para selecionar
              </p>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Formatos suportados: Nubank</p>
              <p>Tamanho máximo: {maxSize / (1024 * 1024)}MB</p>
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <p className="text-center text-sm text-slate-400 mt-4">
          Aguarde enquanto processamos suas transações...
        </p>
      )}
    </div>
  )
}
