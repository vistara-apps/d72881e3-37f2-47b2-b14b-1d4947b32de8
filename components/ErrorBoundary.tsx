'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card text-center max-w-md">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-text/80 mb-4">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        {error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-text/60 hover:text-text">
              Error details
            </summary>
            <pre className="text-xs bg-surface p-2 rounded mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={resetError}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error handled by hook:', error, errorInfo)
    // In production, you might want to send this to an error reporting service
  }
}

