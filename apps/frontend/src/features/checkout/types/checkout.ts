export type CheckoutStepId = "customer" | "delivery" | "payment" | "review";
export type CheckoutPaymentMethod = "card" | "paypal" | "apple-pay";

export type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  signInEmail: string;
  signInPassword: string;
  createAccount: boolean;
  newPassword: string;
  emailPerks: boolean;
  addressId: string;
  shippingMethodId: string;
  paymentMethod: CheckoutPaymentMethod;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  saveCard: boolean;
  confirmed: boolean;
};

export type CheckoutFormErrors = Partial<Record<keyof CheckoutForm, string>>;

export type CheckoutFieldChange = <K extends keyof CheckoutForm>(
  field: K,
  value: CheckoutForm[K],
) => void;

// Monetary values are integer cents, including item unit prices.
export type CheckoutItem = {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
};

export type CheckoutAddress = {
  id: string;
  label: string;
  recipient: string;
  street: string;
  cityLine: string;
  isDefault?: boolean;
};

export type CheckoutShippingMethod = {
  id: string;
  name: string;
  detail: string;
  arrival: string;
  price: number;
};

export type CheckoutPromo = {
  code: string;
  type: "percent" | "amount";
  value: number;
};

export type CheckoutCountry = { code: string; name: string; flag: string };

export type CheckoutData = {
  taxRate: number;
  defaults: CheckoutForm;
  defaultPromoCode: string;
  items: CheckoutItem[];
  addresses: CheckoutAddress[];
  shippingMethods: CheckoutShippingMethod[];
  promos: CheckoutPromo[];
  countries: CheckoutCountry[];
};
