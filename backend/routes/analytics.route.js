import express from 'express'
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySaleData } from '../controllers/analytics.controller.js';

const router = express.Router()

router.get('/', protectedRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData()
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySaleData(startDate, endDate)
    res.status(200).json({
      analyticsData,
      dailySalesData,
    })
  } catch (error) {
    console.log("Error AnalyticsData router :", error.message)
    res.status(500).json({ message: "Error in router Analytics", error: error.message })
  }


})









export default router;