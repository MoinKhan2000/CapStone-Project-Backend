import { createNewOrderRepo, getOrderByIdRepo, getUserOrdersRepo, getAllOrdersRepo, updateOrderByIdRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

// Create a new order
export const createNewOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    orderData.user = req.user._id;
    const newOrder = await createNewOrderRepo(orderData);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    next(new ErrorHandler(500, error.message || "Failed to place the order"));
  }
};

// Get a single order by ID
export const getSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdRepo(id);

    if (!order) {
      return next(new ErrorHandler(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler(500, error.message || "Failed to retrieve the order"));
  }
};

// Get the logged-in user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await getUserOrdersRepo(userId);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(new ErrorHandler(500, error.message || "Failed to retrieve your orders"));
  }
};

// Get all placed orders (Admin feature)
export const getPlacedOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersRepo();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(new ErrorHandler(500, error.message || "Failed to retrieve orders"));
  }
};

// Update order details (Admin feature)
export const updateOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedOrder = await updateOrderByIdRepo(id, req.body);

    if (!updatedOrder) {
      return next(new ErrorHandler(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(new ErrorHandler(500, error.message || "Failed to update the order"));
  }
};
