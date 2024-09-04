import express from "express";
import {
  createNewOrder,
  getSingleOrder,
  getMyOrders,
  getPlacedOrders,
  updateOrderDetails
} from "../controllers/order.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

router.route("/new").post(auth, createNewOrder);

router.route("/:id").get(auth, getSingleOrder);

router.route("/my/orders").get(auth, getMyOrders);

router.route("/orders/placed").get(auth, authByUserRole, getPlacedOrders);

router.route("/update/:id").put(auth, authByUserRole, updateOrderDetails);

export default router;
