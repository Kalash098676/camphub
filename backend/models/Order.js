import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    hostelBlock: { type: String, required: true },
    roomNo: { type: String, required: true },
    shippingAddress: {
      hostel: { type: String },
      roomNumber: { type: String },
      city: { type: String, default: 'Campus' },
      pincode: { type: String, default: '110001' }
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'UPI', 'Wallet'], default: 'COD' },
    orderStatus: { type: String, enum: ['Ordered', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Ordered' }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);

