import stripe from '../lib/stripe.js';
import couponModel from '../model/couponModel.js'
import orderModel from '../model/orderModel.js';
import userModel from '../model/userModel.js';
import dotenv from "dotenv"
dotenv.config()

// createCheckOutSession
export const createCheckOutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body
    if (!Array.isArray(products) && products.length !== 0) {
      return res.status(400).json({ message: "Invalid or empty array Products" })
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await couponModel.findOne({ code: couponCode, userId: req.user._id, isActive: true })
      if (coupon) {
        totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100)
      }

    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card",],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon ? [
        {
          coupon: await createStripeCoupon(coupon.discountPercentage)
        },
      ] : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
                   id: p._id,
                   quantity: p.quantity,
                    price: p.price,
        }))
      ),

      },
    })

    if (totalAmount > 2000) {
      await createNewCoupon(req.user._id)
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 })

  } catch (error) {
    console.log("Error in CreateCheoutSession : ", error.message)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}






async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  })
  return coupon.id
}


async function createNewCoupon(userId) {
  await couponModel.findOneAndDelete({ userId }) // deleting the Coupon with this userId for duplication
  const newCoupon = new couponModel({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  })
  await newCoupon.save()
  return newCoupon
}

// checkOut Success

export const checkOutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status == "paid") {
      if (session.metadata.couponCode) {
        await couponModel.findOneAndUpdate(
          { code: session.metadata.couponCode, userId: session.metadata.userId },
          { isActive: false }
        )
      }
      // payment success we create orderModel

      const products = JSON.parse(session.metadata.products)

      const newOrder = new orderModel({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,  // convert cents to $
        stripeSessionId: sessionId
      })

      await newOrder.save()


      // const user= await userModel.findById(session.metadata.userId)
      // if(user){
      //      user.cartItems=[]
      //      await user.save()
      //   }

      res.status(200).json({
        success: true,
        message: "Payment Successfull,order Created  and coupon deactivated",
        orderId: newOrder._id,
      })

    }
  } catch (error) {
    console.log("Error in checkout session:", error.message)
    res.status(500).json({ message: "Error Processing  checkOut ", error: error.message })
  }
}












