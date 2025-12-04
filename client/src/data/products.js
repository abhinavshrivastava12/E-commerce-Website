// 📁 src/data/products.js - Expanded with 50+ Products
const products = [
  // Electronics
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    originalPrice: 4999,
    category: "Electronics",
    image: "/images/headphone.jpeg",
    rating: 4.5,
    discount: 40,
    stock: 25,
    trending: true,
    featured: true
  },
  {
    id: 2,
    name: "Smartwatch",
    price: 4999,
    originalPrice: 7999,
    category: "Electronics",
    image: "/images/smartwatch.jpeg",
    rating: 4.8,
    discount: 38,
    stock: 15,
    bestSeller: true
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    price: 1999,
    originalPrice: 3999,
    category: "Electronics",
    image: "/images/speaker.jpeg",
    rating: 4.4,
    discount: 50,
    stock: 30,
    featured: true
  },
  {
    id: 9,
    name: "Wireless Mouse",
    price: 799,
    originalPrice: 1299,
    category: "Electronics",
    image: "/images/mouse.jpeg",
    rating: 4.3,
    discount: 38,
    stock: 50,
    trending: true
  },
  {
    id: 10,
    name: "Mechanical Keyboard",
    price: 3499,
    originalPrice: 5999,
    category: "Electronics",
    image: "/images/keyboard.jpeg",
    rating: 4.7,
    discount: 42,
    stock: 20
  },
  {
    id: 11,
    name: "Gaming Headset",
    price: 4999,
    originalPrice: 7999,
    category: "Electronics",
    image: "/images/gaming-headset.jpeg",
    rating: 4.6,
    discount: 38,
    stock: 18,
    bestSeller: true
  },
  {
    id: 12,
    name: "Power Bank 20000mAh",
    price: 1499,
    originalPrice: 2499,
    category: "Electronics",
    image: "/images/powerbank.jpeg",
    rating: 4.4,
    discount: 40,
    stock: 60
  },
  {
    id: 13,
    name: "Webcam HD 1080p",
    price: 2999,
    originalPrice: 4999,
    category: "Electronics",
    image: "/images/webcam.jpeg",
    rating: 4.5,
    discount: 40,
    stock: 25,
    trending: true
  },
  {
    id: 14,
    name: "USB-C Hub",
    price: 1999,
    originalPrice: 2999,
    category: "Electronics",
    image: "/images/usb-hub.jpeg",
    rating: 4.3,
    discount: 33,
    stock: 40
  },
  {
    id: 15,
    name: "Portable SSD 1TB",
    price: 8999,
    originalPrice: 12999,
    category: "Electronics",
    image: "/images/ssd.jpeg",
    rating: 4.9,
    discount: 31,
    stock: 15,
    featured: true
  },

  // Clothing
  {
    id: 3,
    name: "Men's White Shirt",
    price: 799,
    originalPrice: 1299,
    category: "Clothing",
    image: "/images/formalshirt.jpeg",
    rating: 4.2,
    discount: 38,
    stock: 35
  },
  {
    id: 4,
    name: "Women's Kurti",
    price: 999,
    originalPrice: 1999,
    category: "Clothing",
    image: "/images/kurti.jpeg",
    rating: 4.6,
    discount: 50,
    stock: 28,
    trending: true
  },
  {
    id: 8,
    name: "Formal Black Shirt",
    price: 999,
    originalPrice: 1499,
    category: "Clothing",
    image: "/images/shirt.jpeg",
    rating: 4.1,
    discount: 33,
    stock: 42
  },
  {
    id: 16,
    name: "Men's Denim Jeans",
    price: 1499,
    originalPrice: 2499,
    category: "Clothing",
    image: "/images/jeans.jpeg",
    rating: 4.5,
    discount: 40,
    stock: 30,
    bestSeller: true
  },
  {
    id: 17,
    name: "Women's Summer Dress",
    price: 1799,
    originalPrice: 2999,
    category: "Clothing",
    image: "/images/dress.jpeg",
    rating: 4.7,
    discount: 40,
    stock: 22
  },
  {
    id: 18,
    name: "Men's T-Shirt Pack (3)",
    price: 899,
    originalPrice: 1499,
    category: "Clothing",
    image: "/images/tshirt-pack.jpeg",
    rating: 4.4,
    discount: 40,
    stock: 50,
    trending: true
  },
  {
    id: 19,
    name: "Women's Leggings",
    price: 599,
    originalPrice: 999,
    category: "Clothing",
    image: "/images/leggings.jpeg",
    rating: 4.3,
    discount: 40,
    stock: 45
  },
  {
    id: 20,
    name: "Men's Hoodie",
    price: 1999,
    originalPrice: 3499,
    category: "Clothing",
    image: "/images/hoodie.jpeg",
    rating: 4.8,
    discount: 43,
    stock: 18,
    featured: true
  },
  {
    id: 21,
    name: "Women's Saree",
    price: 2499,
    originalPrice: 4999,
    category: "Clothing",
    image: "/images/saree.jpeg",
    rating: 4.9,
    discount: 50,
    stock: 12,
    bestSeller: true
  },
  {
    id: 22,
    name: "Men's Blazer",
    price: 3999,
    originalPrice: 6999,
    category: "Clothing",
    image: "/images/blazer.jpeg",
    rating: 4.6,
    discount: 43,
    stock: 15
  },

  // Groceries
  {
    id: 5,
    name: "Rice - 5kg",
    price: 349,
    category: "Groceries",
    image: "/images/rice.jpeg",
    rating: 4.3,
    stock: 100
  },
  {
    id: 6,
    name: "Aashirvaad Atta - 10kg",
    price: 459,
    category: "Groceries",
    image: "/images/atta.jpeg",
    rating: 4.7,
    stock: 85,
    bestSeller: true
  },
  {
    id: 23,
    name: "Toor Dal - 1kg",
    price: 149,
    category: "Groceries",
    image: "/images/dal.jpeg",
    rating: 4.5,
    stock: 120
  },
  {
    id: 24,
    name: "Cooking Oil - 5L",
    price: 899,
    category: "Groceries",
    image: "/images/oil.jpeg",
    rating: 4.4,
    stock: 60
  },
  {
    id: 25,
    name: "Sugar - 5kg",
    price: 249,
    category: "Groceries",
    image: "/images/sugar.jpeg",
    rating: 4.2,
    stock: 95
  },
  {
    id: 26,
    name: "Tea Powder - 500g",
    price: 299,
    category: "Groceries",
    image: "/images/tea.jpeg",
    rating: 4.6,
    stock: 70,
    trending: true
  },
  {
    id: 27,
    name: "Coffee Powder - 200g",
    price: 399,
    category: "Groceries",
    image: "/images/coffee.jpeg",
    rating: 4.8,
    stock: 55
  },
  {
    id: 28,
    name: "Basmati Rice - 5kg",
    price: 799,
    category: "Groceries",
    image: "/images/basmati.jpeg",
    rating: 4.9,
    stock: 45,
    featured: true
  },

  // Home & Kitchen
  {
    id: 29,
    name: "Non-Stick Cookware Set",
    price: 2999,
    originalPrice: 4999,
    category: "Home & Kitchen",
    image: "/images/cookware.jpeg",
    rating: 4.7,
    discount: 40,
    stock: 20,
    featured: true
  },
  {
    id: 30,
    name: "Electric Kettle",
    price: 899,
    originalPrice: 1499,
    category: "Home & Kitchen",
    image: "/images/kettle.jpeg",
    rating: 4.5,
    discount: 40,
    stock: 35
  },
  {
    id: 31,
    name: "Mixer Grinder",
    price: 3499,
    originalPrice: 5999,
    category: "Home & Kitchen",
    image: "/images/mixer.jpeg",
    rating: 4.6,
    discount: 42,
    stock: 18,
    bestSeller: true
  },
  {
    id: 32,
    name: "Toaster",
    price: 1299,
    originalPrice: 1999,
    category: "Home & Kitchen",
    image: "/images/toaster.jpeg",
    rating: 4.4,
    discount: 35,
    stock: 28
  },
  {
    id: 33,
    name: "Vacuum Cleaner",
    price: 4999,
    originalPrice: 7999,
    category: "Home & Kitchen",
    image: "/images/vacuum.jpeg",
    rating: 4.8,
    discount: 38,
    stock: 12,
    trending: true
  },
  {
    id: 34,
    name: "Air Fryer",
    price: 5999,
    originalPrice: 9999,
    category: "Home & Kitchen",
    image: "/images/airfryer.jpeg",
    rating: 4.9,
    discount: 40,
    stock: 15,
    featured: true,
    bestSeller: true
  },
  {
    id: 35,
    name: "Bedsheet Set",
    price: 1299,
    originalPrice: 2499,
    category: "Home & Kitchen",
    image: "/images/bedsheet.jpeg",
    rating: 4.5,
    discount: 48,
    stock: 40
  },
  {
    id: 36,
    name: "Curtain Set",
    price: 1999,
    originalPrice: 3499,
    category: "Home & Kitchen",
    image: "/images/curtain.jpeg",
    rating: 4.3,
    discount: 43,
    stock: 25
  },
  {
    id: 37,
    name: "Wall Clock",
    price: 599,
    originalPrice: 999,
    category: "Home & Kitchen",
    image: "/images/clock.jpeg",
    rating: 4.4,
    discount: 40,
    stock: 50
  },
  {
    id: 38,
    name: "LED Table Lamp",
    price: 799,
    originalPrice: 1299,
    category: "Home & Kitchen",
    image: "/images/lamp.jpeg",
    rating: 4.6,
    discount: 38,
    stock: 35
  },

  // Beauty
  {
    id: 39,
    name: "Face Cream",
    price: 499,
    originalPrice: 799,
    category: "Beauty",
    image: "/images/facecream.jpeg",
    rating: 4.5,
    discount: 38,
    stock: 60,
    trending: true
  },
  {
    id: 40,
    name: "Hair Serum",
    price: 699,
    originalPrice: 1199,
    category: "Beauty",
    image: "/images/serum.jpeg",
    rating: 4.7,
    discount: 42,
    stock: 45
  },
  {
    id: 41,
    name: "Makeup Kit",
    price: 1999,
    originalPrice: 3499,
    category: "Beauty",
    image: "/images/makeup.jpeg",
    rating: 4.8,
    discount: 43,
    stock: 22,
    featured: true
  },
  {
    id: 42,
    name: "Perfume Set",
    price: 1499,
    originalPrice: 2499,
    category: "Beauty",
    image: "/images/perfume.jpeg",
    rating: 4.6,
    discount: 40,
    stock: 30,
    bestSeller: true
  },
  {
    id: 43,
    name: "Hair Straightener",
    price: 1299,
    originalPrice: 2199,
    category: "Beauty",
    image: "/images/straightener.jpeg",
    rating: 4.4,
    discount: 41,
    stock: 25
  },
  {
    id: 44,
    name: "Face Wash Set",
    price: 399,
    originalPrice: 699,
    category: "Beauty",
    image: "/images/facewash.jpeg",
    rating: 4.5,
    discount: 43,
    stock: 70
  },
  {
    id: 45,
    name: "Body Lotion",
    price: 299,
    originalPrice: 499,
    category: "Beauty",
    image: "/images/lotion.jpeg",
    rating: 4.3,
    discount: 40,
    stock: 55
  },
  {
    id: 46,
    name: "Lipstick Set (5 shades)",
    price: 899,
    originalPrice: 1499,
    category: "Beauty",
    image: "/images/lipstick.jpeg",
    rating: 4.7,
    discount: 40,
    stock: 38,
    trending: true
  },

  // Sports
  {
    id: 47,
    name: "Yoga Mat",
    price: 799,
    originalPrice: 1299,
    category: "Sports",
    image: "/images/yogamat.jpeg",
    rating: 4.6,
    discount: 38,
    stock: 40,
    trending: true
  },
  {
    id: 48,
    name: "Dumbbell Set",
    price: 1999,
    originalPrice: 3499,
    category: "Sports",
    image: "/images/dumbbell.jpeg",
    rating: 4.7,
    discount: 43,
    stock: 25,
    bestSeller: true
  },
  {
    id: 49,
    name: "Cricket Bat",
    price: 1499,
    originalPrice: 2499,
    category: "Sports",
    image: "/images/bat.jpeg",
    rating: 4.5,
    discount: 40,
    stock: 20
  },
  {
    id: 50,
    name: "Football",
    price: 699,
    originalPrice: 1199,
    category: "Sports",
    image: "/images/football.jpeg",
    rating: 4.4,
    discount: 42,
    stock: 35
  },
  {
    id: 51,
    name: "Badminton Racket Set",
    price: 1299,
    originalPrice: 1999,
    category: "Sports",
    image: "/images/racket.jpeg",
    rating: 4.6,
    discount: 35,
    stock: 28
  },
  {
    id: 52,
    name: "Gym Bag",
    price: 899,
    originalPrice: 1499,
    category: "Sports",
    image: "/images/gymbag.jpeg",
    rating: 4.3,
    discount: 40,
    stock: 45
  },
  {
    id: 53,
    name: "Resistance Bands Set",
    price: 599,
    originalPrice: 999,
    category: "Sports",
    image: "/images/bands.jpeg",
    rating: 4.5,
    discount: 40,
    stock: 50,
    featured: true
  },
  {
    id: 54,
    name: "Sports Water Bottle",
    price: 299,
    originalPrice: 499,
    category: "Sports",
    image: "/images/bottle.jpeg",
    rating: 4.4,
    discount: 40,
    stock: 80
  }
];

export default products;