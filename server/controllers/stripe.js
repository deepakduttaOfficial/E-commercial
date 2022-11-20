const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
exports.makePayment = (req, res) => {
  const { token, products } = req.body;
  let amount = 0;
  {
    products.map((product) => (amount += product.price));
  }

  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token._id,
    })
    .then((customer) => {
      stripe.paymentIntents
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer._id,
            receipt_email: token.email,
            description: "This is a test account",

            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    });
};
