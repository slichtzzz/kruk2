import React from 'react'

const withErrorHandling = WrappedComponent => ({ showError, children, ...props }) => {
  return (
    <WrappedComponent {...props}>
      {showError && <div className="error-message">Oops! Something went wrong!</div>}
      {children}
    </WrappedComponent>
  )
}

const DivWithErrorHandling = withErrorHandling(({ children }) => <div>{children}</div>)

export {
  withErrorHandling,
  DivWithErrorHandling,
}
