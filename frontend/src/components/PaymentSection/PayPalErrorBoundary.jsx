import React from "react";
class PayPalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PayPal Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='payment-section'>
          <div className='section-header'>
            <h2>Payment Error</h2>
          </div>

          <div className='error-container'>
            <div className='error-message'>
              <h3>Payment System Temporarily Unavailable</h3>
              <p>
                We're experiencing technical difficulties with our payment
                system. Please try again in a few moments.
              </p>
              <div className='error-actions'>
                <button className='btn btn-primary' onClick={this.handleRetry}>
                  Try Again
                </button>
                <button
                  className='btn btn-secondary'
                  onClick={() => window.location.reload()}>
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PayPalErrorBoundary;
