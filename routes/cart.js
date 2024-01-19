const express = require("express");
const { isLoggedIn } = require("../middleware");
const User = require("../models/User");
const Product = require("../models/product");
const router = express.Router();
const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u')

router.get("/user/cart", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  let user = await User.findById(userId).populate("cart");
  //   console.log(user, "sam");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  //   console.log(totalAmount);

  res.render("cart/cart", { user, totalAmount });
});
// router.get('/checkout/:id',async(req, res) => {
//   let userId = req.user._id;
//   let user = await User.findById(userId).populate("cart");
//   //   console.log(user, "sam");
//   let totalAmount = await user.cart.reduce((sum, curr) => sum + curr.price, 0);
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'T-shirt',
//           },
//           unit_amount: totalAmount,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:4242/success',
//     cancel_url: 'http://localhost:4242/cancel',
//   });

//   res.redirect(303, session.url);
// })
router.get('/checkout/:id',async function(req, res) {
  let userId = req.params.id;
  let user = await User.findById(userId).populate("cart");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  let quantity1 = user.cart.length;
  console.log(quantity1)
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name:'xyz'
          },
            
          unit_amount: totalAmount*100,
        },
        quantity: 1
      },
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name:'xyz'
          },
            
          unit_amount: totalAmount*100,
        },
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4242/success',
    cancel_url: 'http://localhost:4242/cancel',
  });

  res.redirect(303, session.url);
});
router.post("/user/:productId/add", isLoggedIn, async (req, res) => {
  let { productId } = req.params;
  let userId = req.user._id;
  let user = await User.findById(userId);
  //   console.log(user, "sam");
  let product = await Product.findById(productId);
  user.cart.push(product);
  await user.save();
  res.redirect("/user/cart");
});

module.exports = router;
