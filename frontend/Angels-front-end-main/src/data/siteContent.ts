export type ShippingOptionId = "standard" | "pickup";
export type PaymentMethodId = "cod";

interface NavLinkItem {
  label: string;
  to: string;
}

interface SocialLink {
  label: string;
  href: string;
}

export const brand: {
  name: string;
  full: string;
  tagline: string;
} = {
  name: "Angel's",
  full: "Angel's Cakes and Pastries",
  tagline:
    "Cake is happiness. If you know the way of the cake, you know the way of happiness.",
};

export const nav: NavLinkItem[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Menu", to: "/menu" },
];

export const about: {
  heading: string;
  bodies: string[];
} = {
  heading: "Our Story ",
  bodies: [
    "Angel’s Cakes and Pastries began with a simple love for baking and a dream of bringing a little more sweetness into people’s lives. What started as a passion for creating homemade treats slowly grew into a small business built on creativity, dedication, and the joy of making every occasion special.",
    "Every cake and Pastry we make is carefully prepared with quality ingredients and attention to detail. We believe that desserts are more than just food—they can be part of birthdays, celebrations, family gatherings, special milestones, or even a simple moment when you just want to treat yourself.",
    "At Angel’s Cakes and Pastries, we continue to create delicious and beautiful treats that are made with love. Whether you're celebrating something big or simply craving something sweet, we're happy to be part of your story—one delightful bite at a time.",
  ],
};

export const contact: {
  address: string;
  phone: string;
  email: string;
  social: SocialLink[];
} = {
  address: "Day-as, Cordova, Cebu",
  phone: "+63 912 345 6789",
  email: "angelscakes@gmail.com",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "X", href: "https://x.com" },
  ],
};

export const shippingOptions: {
  id: ShippingOptionId;
  label: string;
  price: number;
}[] = [
  { id: "standard", label: "Standard Delivery", price: 25 },
  { id: "pickup", label: "Pick-up", price: 0 },
];

export const paymentMethods: {
  id: PaymentMethodId;
  label: string;
}[] = [
  { id: "cod", label: "COD" },
];