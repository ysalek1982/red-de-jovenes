import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ModuleErrorFallback } from './ModuleErrorFallback'

interface AppErrorBoundaryProps {
  children: ReactNode
  moduleName?: string
  resetKey?: string
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Module render error', error, errorInfo)
    }
  }

  componentDidUpdate(previousProps: AppErrorBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ModuleErrorFallback
          moduleName={this.props.moduleName}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
