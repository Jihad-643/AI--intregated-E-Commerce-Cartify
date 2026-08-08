import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Categories to seed
const categories = [
  { name: "Electronics" },
  { name: "Fashion" },
  { name: "Home & Kitchen" },
  { name: "Sports & Outdoors" },
  { name: "Books" },
];

// Products to seed
const products = [
  // Electronics (5 products)
  {
    title: "Wireless Bluetooth Headphones",
    price: 2500,
    description:
      "High-quality wireless headphones with noise cancellation and 20-hour battery life",
    quantity: 50,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    reviews: [
      {
        userEmail: "john.doe@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        review: "Excellent sound quality and battery life! Best headphones I've ever used.",
        date: new Date("2025-12-15"),
      },
      {
        userEmail: "sarah.wilson@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        review: "Great headphones but slightly heavy for long use. Sound is amazing though!",
        date: new Date("2025-12-20"),
      },
    ],
  },
  {
    title: "Smart Watch Pro",
    price: 8500,
    description:
      "Feature-rich smartwatch with fitness tracking, heart rate monitor, and notifications",
    quantity: 30,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    reviews: [
      {
        userEmail: "mike.chen@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        review: "Perfect for tracking my workouts. The battery lasts for days!",
        date: new Date("2025-12-10"),
      },
      {
        userEmail: "emma.brown@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 5,
        review: "Love all the features! Heart rate monitoring is very accurate.",
        date: new Date("2025-12-18"),
      },
    ],
  },
  {
    title: "Portable Power Bank 20000mAh",
    price: 1800,
    description:
      "High-capacity power bank with fast charging support for multiple devices",
    quantity: 75,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    reviews: [
      {
        userEmail: "alex.rodriguez@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/5.jpg",
        rating: 4,
        review: "Charges my phone 4 times. A bit bulky but great capacity.",
        date: new Date("2025-12-12"),
      },
      {
        userEmail: "lisa.taylor@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/6.jpg",
        rating: 5,
        review: "Essential for travel! Fast charging works perfectly.",
        date: new Date("2025-12-22"),
      },
    ],
  },
  {
    title: "4K Webcam with Microphone",
    price: 3200,
    description:
      "Professional webcam with crystal clear 4K video and built-in noise-canceling microphone",
    quantity: 40,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1584641542519-ccd5c53ce01e?w=500",
    reviews: [
      {
        userEmail: "david.kim@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/7.jpg",
        rating: 5,
        review: "Crystal clear video quality. Perfect for video conferences!",
        date: new Date("2025-12-08"),
      },
      {
        userEmail: "rachel.green@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/8.jpg",
        rating: 4,
        review: "Great webcam, microphone is decent but video quality is outstanding.",
        date: new Date("2025-12-16"),
      },
    ],
  },
  {
    title: "Wireless Gaming Mouse",
    price: 2200,
    description:
      "Ergonomic wireless gaming mouse with RGB lighting and programmable buttons",
    quantity: 60,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    reviews: [
      {
        userEmail: "chris.parker@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/9.jpg",
        rating: 5,
        review: "Best gaming mouse! No lag, perfect ergonomics, and RGB is stunning.",
        date: new Date("2025-12-11"),
      },
      {
        userEmail: "jennifer.lopez@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/10.jpg",
        rating: 5,
        review: "Comfortable for long gaming sessions. Highly recommend!",
        date: new Date("2025-12-19"),
      },
    ],
  },

  // Fashion (5 products)
  {
    title: "Classic Denim Jacket",
    price: 3500,
    description: "Timeless denim jacket perfect for casual wear in all seasons",
    quantity: 45,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    reviews: [
      {
        userEmail: "tom.anderson@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/11.jpg",
        rating: 5,
        review: "Perfect fit and quality. Goes with everything!",
        date: new Date("2025-12-14"),
      },
      {
        userEmail: "amy.white@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/12.jpg",
        rating: 4,
        review: "Love the style but runs a bit large. Quality is great though!",
        date: new Date("2025-12-21"),
      },
    ],
  },
  {
    title: "Premium Leather Wallet",
    price: 1500,
    description:
      "Genuine leather wallet with multiple card slots and RFID protection",
    quantity: 80,
    category: "Fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    reviews: [
      {
        userEmail: "james.miller@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/13.jpg",
        rating: 5,
        review: "Excellent quality leather. RFID protection is a great bonus!",
        date: new Date("2025-12-09"),
      },
      {
        userEmail: "sophia.davis@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/14.jpg",
        rating: 5,
        review: "Bought it as a gift. He loved it! Very classy and well-made.",
        date: new Date("2025-12-17"),
      },
    ],
  },
  {
    title: "Sport Running Shoes",
    price: 4200,
    description:
      "Lightweight running shoes with breathable mesh and cushioned sole",
    quantity: 55,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    reviews: [
      {
        userEmail: "kevin.martinez@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/15.jpg",
        rating: 5,
        review: "Most comfortable running shoes ever! Great for long runs.",
        date: new Date("2025-12-13"),
      },
      {
        userEmail: "olivia.johnson@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/16.jpg",
        rating: 4,
        review: "Very comfortable and lightweight. Good arch support.",
        date: new Date("2025-12-20"),
      },
    ],
  },
  {
    title: "Casual Cotton T-Shirt Pack",
    price: 1200,
    description: "Set of 3 premium cotton t-shirts in assorted colors",
    quantity: 100,
    category: "Fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    reviews: [
      {
        userEmail: "ryan.thomas@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/17.jpg",
        rating: 4,
        review: "Good quality cotton, soft and comfortable. Great value for money.",
        date: new Date("2025-12-10"),
      },
      {
        userEmail: "mia.garcia@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/18.jpg",
        rating: 5,
        review: "Perfect basic t-shirts! Colors are vibrant and fabric is soft.",
        date: new Date("2025-12-18"),
      },
    ],
  },
  {
    title: "Designer Sunglasses",
    price: 2800,
    description:
      "UV protection sunglasses with polarized lenses and stylish frame",
    quantity: 35,
    category: "Fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    reviews: [
      {
        userEmail: "brian.lee@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/19.jpg",
        rating: 5,
        review: "Stylish and great UV protection. Worth every penny!",
        date: new Date("2025-12-15"),
      },
      {
        userEmail: "emily.moore@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/20.jpg",
        rating: 5,
        review: "Love these sunglasses! Perfect fit and very fashionable.",
        date: new Date("2025-12-22"),
      },
    ],
  },

  // Home & Kitchen (5 products)
  {
    title: "Stainless Steel Cookware Set",
    price: 5500,
    description:
      "10-piece premium cookware set with non-stick coating and heat-resistant handles",
    quantity: 25,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500",
    reviews: [
      {
        userEmail: "daniel.harris@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/21.jpg",
        rating: 5,
        review: "Excellent cookware set! Non-stick works perfectly, easy to clean.",
        date: new Date("2025-12-07"),
      },
      {
        userEmail: "nicole.clark@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/22.jpg",
        rating: 4,
        review: "Great quality pots and pans. Heats evenly and cleans easily.",
        date: new Date("2025-12-16"),
      },
    ],
  },
  {
    title: "Electric Coffee Maker",
    price: 3800,
    description:
      "Programmable coffee maker with auto-brew feature and thermal carafe",
    quantity: 40,
    category: "Home & Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
    reviews: [
      {
        userEmail: "steven.wright@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/23.jpg",
        rating: 5,
        review: "Makes perfect coffee every morning! Auto-brew is a lifesaver.",
        date: new Date("2025-12-11"),
      },
      {
        userEmail: "jessica.king@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/24.jpg",
        rating: 5,
        review: "Best coffee maker! Keeps coffee hot for hours. Highly recommend.",
        date: new Date("2025-12-19"),
      },
    ],
  },
  {
    title: "Memory Foam Pillow Set",
    price: 2400,
    description:
      "Set of 2 ergonomic memory foam pillows with cooling gel technology",
    quantity: 50,
    category: "Home & Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500",
    reviews: [
      {
        userEmail: "matthew.scott@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/25.jpg",
        rating: 5,
        review: "Best sleep I've had in years! The cooling gel really works.",
        date: new Date("2025-12-08"),
      },
      {
        userEmail: "ashley.adams@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/26.jpg",
        rating: 4,
        review: "Very comfortable pillows. Good support for neck and shoulders.",
        date: new Date("2025-12-17"),
      },
    ],
  },
  {
    title: "LED Desk Lamp",
    price: 1800,
    description:
      "Adjustable LED desk lamp with touch control and USB charging port",
    quantity: 65,
    category: "Home & Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    reviews: [
      {
        userEmail: "andrew.baker@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/27.jpg",
        rating: 5,
        review: "Perfect desk lamp! USB port is very convenient for charging.",
        date: new Date("2025-12-12"),
      },
      {
        userEmail: "lauren.nelson@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/28.jpg",
        rating: 5,
        review: "Love the adjustable brightness. Great for reading and working.",
        date: new Date("2025-12-21"),
      },
    ],
  },
  {
    title: "Ceramic Dinnerware Set",
    price: 4500,
    description:
      "16-piece ceramic dinnerware set with elegant design, service for 4",
    quantity: 30,
    category: "Home & Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1584990347449-39f1426c7d1a?w=500",
    reviews: [
      {
        userEmail: "joshua.carter@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/29.jpg",
        rating: 5,
        review: "Beautiful dinnerware set! Elegant design and very durable.",
        date: new Date("2025-12-09"),
      },
      {
        userEmail: "amanda.mitchell@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/30.jpg",
        rating: 5,
        review: "Absolutely love these dishes! Perfect for dinner parties.",
        date: new Date("2025-12-18"),
      },
    ],
  },

  // Sports & Outdoors (3 products)
  {
    title: "Yoga Mat with Carrying Bag",
    price: 1500,
    description:
      "Non-slip yoga mat with extra cushioning and convenient carrying bag",
    quantity: 70,
    category: "Sports & Outdoors",
    imageUrl:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    reviews: [
      {
        userEmail: "justin.perez@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/31.jpg",
        rating: 5,
        review: "Great yoga mat! Non-slip surface works perfectly. Very comfortable.",
        date: new Date("2025-12-13"),
      },
      {
        userEmail: "victoria.roberts@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/32.jpg",
        rating: 4,
        review: "Good quality mat with nice cushioning. Carrying bag is handy.",
        date: new Date("2025-12-20"),
      },
    ],
  },
  {
    title: "Camping Tent 4-Person",
    price: 6500,
    description:
      "Waterproof camping tent with easy setup and ventilation windows",
    quantity: 20,
    category: "Sports & Outdoors",
    imageUrl:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500",
    reviews: [
      {
        userEmail: "nathan.turner@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/33.jpg",
        rating: 5,
        review: "Excellent tent! Survived a rainstorm perfectly. Easy to set up.",
        date: new Date("2025-12-10"),
      },
      {
        userEmail: "samantha.phillips@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/34.jpg",
        rating: 5,
        review: "Spacious and waterproof! Perfect for family camping trips.",
        date: new Date("2025-12-19"),
      },
    ],
  },
  {
    title: "Resistance Band Set",
    price: 1200,
    description:
      "Set of 5 resistance bands with different strength levels and door anchor",
    quantity: 85,
    category: "Sports & Outdoors",
    imageUrl:
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
    reviews: [
      {
        userEmail: "tyler.campbell@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/35.jpg",
        rating: 5,
        review: "Great for home workouts! Different resistance levels are perfect.",
        date: new Date("2025-12-14"),
      },
      {
        userEmail: "rebecca.evans@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/36.jpg",
        rating: 4,
        review: "Good quality bands. Door anchor works well for various exercises.",
        date: new Date("2025-12-21"),
      },
    ],
  },

  // Books (2 products)
  {
    title: "The Art of Programming",
    price: 950,
    description:
      "Comprehensive guide to modern programming techniques and best practices",
    quantity: 45,
    category: "Books",
    imageUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
    reviews: [
      {
        userEmail: "brandon.edwards@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/37.jpg",
        rating: 5,
        review: "Excellent programming book! Clear explanations and great examples.",
        date: new Date("2025-12-11"),
      },
      {
        userEmail: "stephanie.collins@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/38.jpg",
        rating: 5,
        review: "Best programming book I've read! Very comprehensive and practical.",
        date: new Date("2025-12-19"),
      },
    ],
  },
  {
    title: "Mindfulness and Meditation",
    price: 750,
    description:
      "Practical guide to mindfulness and meditation for stress relief and mental clarity",
    quantity: 60,
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    reviews: [
      {
        userEmail: "jacob.stewart@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/men/39.jpg",
        rating: 5,
        review: "Life-changing book! Helped me manage stress so much better.",
        date: new Date("2025-12-15"),
      },
      {
        userEmail: "michelle.sanchez@gmail.com",
        userPhoto: "https://randomuser.me/api/portraits/women/40.jpg",
        rating: 5,
        review: "Wonderful guide to meditation. Easy to follow and very effective.",
        date: new Date("2025-12-22"),
      },
    ],
  },
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(process.env.DB_NAME || "Cartify");

    // Clear existing data
    console.log("Clearing existing data...");
    await db.collection("categories").deleteMany({});
    await db.collection("products").deleteMany({});

    // Insert categories
    console.log("Inserting categories...");
    const categoryResult = await db
      .collection("categories")
      .insertMany(categories);
    console.log(`✅ Inserted ${categoryResult.insertedCount} categories`);

    // Insert products
    console.log("Inserting products...");
    const productResult = await db.collection("products").insertMany(products);
    console.log(`✅ Inserted ${productResult.insertedCount} products`);

    console.log("\n🎉 Database seeded successfully!");
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Products: ${products.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

seedDatabase();
