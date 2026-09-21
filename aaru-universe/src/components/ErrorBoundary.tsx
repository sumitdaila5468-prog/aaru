/* ------------------------------------------------------------------ */
/*  ErrorBoundary — if the 3D world ever fails, the story continues     */
/* ------------------------------------------------------------------ */

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { useExperience } from '../state/experience'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[aaru] 3D experience failed, switching to the 2D version', error, info)
    useExperience.getState().setWebgl(false)
  }

  render(): ReactNode {
    if (this.state.hasError) return null
    return this.props.children
  }
}
