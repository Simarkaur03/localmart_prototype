export const STORES = [
  {
    id: 1,
    name: "Sharma General Store",
    category: "Grocery / Dairy",
    distance: "0.8 km",
    rating: 4.5,
    isOpen: true,
    color: "bg-blue-100",
    image: "🛒",
    deliveryTime: "25-30 min",
    minOrder: "₹100"
  },
  {
    id: 2,
    name: "Patel Daily Needs",
    category: "Convenience Store",
    distance: "1.2 km",
    rating: 4.2,
    isOpen: true,
    color: "bg-green-100",
    image: "🥛",
    deliveryTime: "30-40 min",
    minOrder: "₹150"
  },
  {
    id: 3,
    name: "Aggarwal Sweets & Snacks",
    category: "Snacks / Bakery",
    distance: "2.5 km",
    rating: 4.8,
    isOpen: false,
    color: "bg-orange-100",
    image: "🥪",
    deliveryTime: "40-50 min",
    minOrder: "₹200"
  }
];

export const POPULAR_ITEMS = [
  {
    id: 101,
    name: "Fresh Whole Milk",
    price: 65,
    unit: "1L",
    category: "Dairy",
    image: "🥛",
    bgColor: "bg-blue-50"
  },
  {
    id: 102,
    name: "Aashirvaad Atta",
    price: 245,
    unit: "5kg",
    category: "Staples",
    image: "🌾",
    bgColor: "bg-yellow-50"
  },
  {
    id: 103,
    name: "Amul Butter",
    price: 56,
    unit: "100g",
    category: "Dairy",
    image: "🧈",
    bgColor: "bg-yellow-100"
  },
  {
    id: 104,
    name: "Maggi Masala Noodles",
    price: 14,
    unit: "Single Pack",
    category: "Snacks",
    image: "🍜",
    bgColor: "bg-red-50"
  }
];

export const MOCK_ORDERS = [
  {
    id: "ORD-9821",
    customer: "Rahul Singh",
    items: "Milk x2, Bread x1",
    total: 185,
    time: "10 mins ago",
    status: "Pending"
  },
  {
    id: "ORD-9820",
    customer: "Anjali Gupta",
    items: "Atta 5kg, Cooking Oil 1L",
    total: 720,
    time: "25 mins ago",
    status: "Accepted"
  },
  {
    id: "ORD-9818",
    customer: "Vikram Mehra",
    items: "Snacks Combo",
    total: 350,
    time: "1 hour ago",
    status: "Delivered"
  },
  {
    id: "ORD-9815",
    customer: "Priya Das",
    items: "Organic Honey, Green Tea",
    total: 1200,
    time: "3 hours ago",
    status: "Cancelled"
  }
];

export const ADMIN_STATS = [
  { label: "Total Stores", value: "28", trend: "+2 this month" },
  { label: "Active Users", value: "1,204", trend: "+15% vs LY" },
  { label: "Orders Today", value: "87", trend: "₹54,200 Revenue" },
  { label: "Platform Growth", value: "24%", trend: "Strong uptake" }
];
