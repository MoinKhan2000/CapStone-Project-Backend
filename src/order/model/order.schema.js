import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Shipping address is required."],
    },
    state: {
      type: String,
      required: [true, "State is required."],
    },
    country: {
      type: String,
      required: [true, "Country is required."],
      default: "IN",
    },
    pincode: {
      type: Number,
      required: [true, "Pincode is required."],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone number is required."],
    },
  },
  orderedItems: [
    {
      name: {
        type: String,
        required: [true, "Product name is required."],
      },
      price: {
        type: Number,
        required: [true, "Product price is required."],
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity is required."],
      },
      image: {
        type: String,
        required: [true, "Product image is required."],
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required."],
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required."],
  },
  paymentInfo: {
    id: {
      type: String,
      required: [true, "Payment ID is required."],
    },
    status: {
      type: Boolean,
      default: false,
      required: [true, "Payment status is required."],
    },
  },
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    default: 0,
    required: [true, "Items price is required."],
  },
  taxPrice: {
    type: Number,
    default: 0,
    required: [true, "Tax price is required."],
  },
  shippingPrice: {
    type: Number,
    default: 0,
    required: [true, "Shipping price is required."],
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: [true, "Total price is required."],
  },
  orderStatus: {
    type: String,
    required: [true, "Order status is required."],
    default: "Processing",
  },
  deliveredAt: Date,
}, {
  timestamps: true
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
