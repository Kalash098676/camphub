import { z } from 'zod';

// Delivery Address Validation Schema
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number (e.g. 9876543210)'),
  block: z.string().min(1, 'Please select a hostel or building block'),
  room: z.string().min(1, 'Please enter your room or desk number'),
  landmark: z.string().optional()
});

// Card Payment Validation Schema
export const cardPaymentSchema = z.object({
  cardNumber: z.string().regex(/^[\d\s]{16,19}$/, 'Enter a valid 16-digit card number'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Enter valid expiry MM/YY (e.g. 08/28)'),
  cardCvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  cardName: z.string().min(2, 'Enter cardholder name')
});

// Custom UPI Payment Validation Schema
export const upiPaymentSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Enter a valid UPI ID (e.g. mobile@upi or name@okaxis)')
});

// Admin Auth Credentials Schema
export const adminAuthSchema = z.object({
  email: z.string().email('Please enter a valid admin email (e.g. admin@campushub.edu)'),
  password: z.string().min(4, 'Password must be at least 4 characters')
});

// Admin OTP Verification Schema
export const adminOtpSchema = z.object({
  otp: z.string().length(4, 'OTP must be a 4-digit code')
});
