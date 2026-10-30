import { z } from "zod";

const required = (message: string) => z.string().trim().min(1, message);

export const customerSchema = z
  .object({
    firstName: required("Enter a first name."),
    lastName: required("Enter a last name."),
    email: z.email("Enter a valid email address."),
    phone: required("Enter a phone number."),
    country: required("Select a country."),
    createAccount: z.boolean(),
    newPassword: z.string(),
  })
  .superRefine((value, context) => {
    if (value.createAccount && value.newPassword.length < 8) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "Password must be at least 8 characters.",
      });
    }
  });

export const signInSchema = z.object({
  signInEmail: z.email("Enter a valid email address."),
  signInPassword: z.string().min(8, "Password must be at least 8 characters."),
});

export const resetPasswordSchema = signInSchema.pick({ signInEmail: true });

export const deliverySchema = z.object({
  addressId: required("Select an address."),
  shippingMethodId: required("Select a delivery speed."),
});

function isFutureExpiry(expiry: string) {
  const month = Number(expiry.slice(0, 2));
  const year = 2000 + Number(expiry.slice(3));
  const now = new Date();
  return year * 12 + month >= now.getFullYear() * 12 + now.getMonth() + 1;
}

export const paymentSchema = z
  .object({
    paymentMethod: z.enum(["card", "paypal", "apple-pay"]),
    cardName: z.string(),
    cardNumber: z.string(),
    cardExpiry: z.string(),
    cardCvc: z.string(),
  })
  .superRefine((value, context) => {
    if (value.paymentMethod !== "card") return;

    const fail = (path: string, message: string) =>
      context.addIssue({ code: "custom", path: [path], message });

    if (!value.cardName.trim()) fail("cardName", "Enter the name on the card.");
    if (!/^\d{16}$/.test(value.cardNumber.replaceAll(" ", ""))) {
      fail("cardNumber", "Enter a 16-digit card number.");
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value.cardExpiry)) {
      fail("cardExpiry", "Use the MM/YY format.");
    } else if (!isFutureExpiry(value.cardExpiry)) {
      fail("cardExpiry", "This card has expired.");
    }
    if (!/^\d{3,4}$/.test(value.cardCvc)) {
      fail("cardCvc", "Enter 3 or 4 digits.");
    }
  });

export const reviewSchema = z.object({
  confirmed: z.literal(true, {
    error: "Confirm the order details before placing the order.",
  }),
});
