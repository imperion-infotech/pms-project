import React from 'react'

/**
 * ErrorBoundary - Enterprise Stability Feature
 * 
 * Agar project ke kisi bhi component mein coding error (crash) aata hai,
 * toh yeh poori application ko band hone se rokta hai 
 * aur ek user-friendly "Oops" message dikhata hai.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Agli baar render hone par error dikhane ke liye state update karein
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Aap yaha base error log (jaise Sentry) bhej sakte hain
    console.error("Industrial Level Error Catch:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Crash hone par dikhaye jaane wala UI
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-900">
          <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">Oops!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Something went wrong in the PMS module.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-600 active:scale-95"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
