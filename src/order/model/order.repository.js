import OrderModel from "./order.schema.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

// Create a new order
export const createNewOrderRepo = async (orderData) => {
  try {
    const newOrder = new OrderModel(orderData);
    const savedOrder = await newOrder.save();
    return savedOrder;
  } catch (error) {
    throw new ErrorHandler(500, error.message || "Failed to create a new order");
  }
};

export const getOrderByIdRepo = async (orderId) => {
  try {
    const order = await OrderModel.findById(orderId).populate('user', 'name email').populate('orderedItems.product');
    return order;
  } catch (error) {
    throw new ErrorHandler(500, error.message || "Failed to retrieve the order");
  }
};

export const getUserOrdersRepo = async (userId) => {
  try {
    const orders = await OrderModel.find({ user: userId });
    return orders;
  } catch (error) {
    throw new ErrorHandler(500, error.message || "Failed to retrieve orders");
  }
};

// Get all placed orders (Admin feature)
export const getAllOrdersRepo = async () => {
  try {
    const orders = await OrderModel.find();
    return orders;
  } catch (error) {
    throw new ErrorHandler(500, error.message || "Failed to retrieve orders");
  }
};

// Update order details by ID (Admin feature)
export const updateOrderByIdRepo = async (orderId, updateData) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedOrder;
  } catch (error) {
    throw new ErrorHandler(500, error.message || "Failed to update the order");
  }
};
