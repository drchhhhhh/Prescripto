import express from "express";
import {
  getDashboardStats,
  getInventoryStatus,
  getRevenue,
  getMedicinesAvailable,
  getMedicineShortage,
  getTotalMedicines,
  getMedicineGroups,
  getMedicinesSold,
  getInvoicesGenerated,
  getTotalCustomers,
  getFrequentlyBoughtItem
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Route: GET /api/dashboard - Get all dashboard stats for current branch
router.get("/", getDashboardStats);

// Individual dashboard metric routes
router.get("/inventory-status", getInventoryStatus);
router.get("/revenue", getRevenue);
router.get("/medicines-available", getMedicinesAvailable);
router.get("/medicine-shortage", getMedicineShortage);
router.get("/total-medicines", getTotalMedicines);
router.get("/medicine-groups", getMedicineGroups);
router.get("/medicines-sold", getMedicinesSold);
router.get("/invoices-generated", getInvoicesGenerated);
router.get("/total-customers", getTotalCustomers);
router.get("/frequently-bought", getFrequentlyBoughtItem);

export default router;