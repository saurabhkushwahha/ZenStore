import userModel from "../model/userModel.js"
import productModel from '../model/productModel.js'
import orderModel from "../model/orderModel.js"

export const getAnalyticsData = async () => {

   const totalUser = await userModel.countDocuments({})
   const totalProducts = await productModel.countDocuments({})
   const saleData = await orderModel.aggregate([
      {
         $group: {
            _id: null,   // its group all the document together
            totalSale: { $sum: 1},
            totalRevenue: { $sum: "$totalAmount" }
         }
      }
   ])
   const { totalSale, totalRevenue } = saleData[0] || { totalSale: 0, totalRevenue: 0 };


   return {
      users: totalUser,
      products: totalProducts,
      totalSale,
      totalRevenue,
   }

}


export const getDailySaleData = async (startDate, endDate) => {
	try {
		const dailySalesData = await orderModel.aggregate([

			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// example of dailySalesData
		// [
		// 	{
		// 		_id: "2024-08-18",
		// 		sales: 12,
		// 		revenue: 1450.75
		// 	},
		// ]

		const dateArray = getDateInRange(startDate, endDate);
		// console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
	} catch (error) {
		throw error;
	}
};

function getDateInRange(startDate, endDate) {
   const dates = []
   let currentDate = new Date(startDate)
   while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
   }
   return dates
}