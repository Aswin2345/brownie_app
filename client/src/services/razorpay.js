export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async ({
  orderId,
  amount,
  customerInfo,
  onSuccess,
  onFailure,
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure?.('Failed to load Razorpay SDK. Please check your internet connection.');
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    amount: amount * 100,
    currency: 'INR',
    name: 'Sharp SK Brownies',
    description: 'Premium Handcrafted Brownies',
    order_id: orderId,
    handler: (response) => {
      onSuccess?.({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    prefill: {
      name: customerInfo?.name || '',
      email: customerInfo?.email || '',
      contact: customerInfo?.phone || '',
    },
    theme: {
      color: '#D4A574',
      backdrop_color: 'rgba(13, 9, 7, 0.85)',
    },
    modal: {
      ondismiss: () => {
        onFailure?.('Payment was cancelled.');
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.on('payment.failed', (response) => {
    onFailure?.(response.error?.description || 'Payment failed. Please try again.');
  });
  razorpay.open();
};
