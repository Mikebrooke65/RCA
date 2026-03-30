export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. You can try again anytime.
        </p>
        
        <div className="space-y-3">
          <a
            href="/test-payment"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Try Again
          </a>
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
