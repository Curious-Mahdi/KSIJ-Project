import { NextResponse } from "next/server";
// import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // Mock Razorpay instance (in a real app, instantiate with real keys from env)
    /*
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    });

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: "receipt_order_1234"
    };
    
    const order = await razorpay.orders.create(options);
    */

    // Since it's a basic test one, we can mock the order ID response if the Razorpay package is not installed.
    // If the package is installed, we should use it. For now, we mock the response to avoid crashing if `razorpay` is not in package.json.
    
    return NextResponse.json({ 
      id: "order_mock_" + Math.random().toString(36).substring(7), 
      amount: amount * 100,
      currency: "INR" 
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
