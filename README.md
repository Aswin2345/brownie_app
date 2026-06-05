# Aswin Brownies

Premium brownie ordering app with a React client, Express API, MongoDB, admin dashboard, WhatsApp contact, Cash on Delivery, and Razorpay online payments.

## Current Availability

Delivery is currently available only in Pondicherry. More places will be added soon.

## Run With Docker

```bash
docker compose up --build
```

Client: http://localhost:5173  
API: http://localhost:5000/api

The compose file includes development defaults so the app can start without local secrets. Cash on Delivery works with the defaults. Online payment needs real Razorpay keys.

## Environment Variables

Server:

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/aswin-brownies
JWT_SECRET=change-this-secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
VITE_UPI_ID=your-upi-id@bank
VITE_UPI_PAYEE_NAME=Aswin Brownies
```

## Payment Flow

Cash on Delivery:

1. Customer fills checkout details.
2. Backend validates cart items, recalculates product prices from MongoDB, validates Pondicherry delivery, and creates the order.
3. Order is marked `confirmed` with `paymentStatus: pending`.

Razorpay:

1. Customer selects Pay Online.
2. Backend creates a Razorpay order using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Backend creates an internal pending order tied to that Razorpay order ID.
4. Razorpay Checkout opens in the browser using `VITE_RAZORPAY_KEY_ID`.
5. After payment, the client sends the Razorpay payment ID, order ID, and signature to the backend.
6. Backend verifies the HMAC signature, checks the Razorpay order amount matches the internal order total, then marks the order `paid` and `confirmed`.

If Razorpay keys are missing or placeholder values, the API returns a clear message asking the user to use Cash on Delivery.

Direct UPI:

1. Add your UPI ID in `VITE_UPI_ID`.
2. Customer selects Direct UPI and taps Pay.
3. The app opens the customer's UPI app with amount, payee, and note prefilled.
4. Customer completes payment and enters the UPI transaction/reference ID.
5. Backend stores the full order and UPI reference with `paymentStatus: awaiting_verification`.
6. Admin verifies the payment manually in the UPI/bank app before preparing the order.

Direct UPI is intentionally marked `awaiting_verification` because UPI deep links do not prove payment success to the website. For automatic paid status, use Razorpay.

## WhatsApp Order Details

After order creation, the backend sends WhatsApp notifications to the business owner and the customer with the order ID, items, address, total, and payment method.

Fully automatic WhatsApp delivery requires valid `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, and `WHATSAPP_OWNER_NUMBER` values. With placeholder values, the API logs a mock message instead.

## Admin

Admin dashboard: http://localhost:5173/admin/login

Seed data creates the default admin:

```text
Email: admin@aswinbrownies.com
Password: Aswin@2024
```

## Contact

Phone / WhatsApp: +91 6374923162  
Email: aswincse2@gmail.com  
Instagram: https://www.instagram.com/aswinbrownies/
