const mongoose = require("mongoose");
const Menu = require("./models/menu"); // <-- update path if needed

// 1. MONGODB CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/yourDatabaseName", {  // <-- replace your DB name
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// 2. MENU DATA
const menuData = [
  {
    name: "Chicken Biryani",
    price: 180,
    category: "Rice",
    description: "Aromatic basmati rice cooked with tender chicken and spices",
    image: "/uploads/chicken-biryani.jpg"
  },
  {
    name: "Veg Fried Rice",
    price: 120,
    category: "Rice",
    description: "Stir-fried rice with fresh vegetables and soy sauce",
    image: "/uploads/veg-fried-rice.jpg"
  },
  {
    name: "Parotta with Salna",
    price: 60,
    category: "Breakfast",
    description: "Soft layered parotta served with spicy salna",
    image: "/uploads/parotta-salna.jpg"
  },
  {
    name: "Chicken 65",
    price: 140,
    category: "Starters",
    description: "Crispy deep-fried chicken with masala seasoning",
    image: "/uploads/chicken65.jpg"
  },
  {
    name: "Grill Chicken (Half)",
    price: 220,
    category: "Grill",
    description: "Juicy grilled chicken marinated in Arabian spices",
    image: "/uploads/grill-chicken-half.jpg"
  },
  {
    name: "Mutton Kothu Parotta",
    price: 150,
    category: "Dinner",
    description: "Chopped parotta mixed with eggs, mutton, and spices",
    image: "/uploads/mutton-kothu.jpg"
  },
  {
    name: "Idli (2 Pcs)",
    price: 30,
    category: "Breakfast",
    description: "Soft steamed idlis served with chutney and sambar",
    image: "/uploads/idli.jpg"
  },
  {
    name: "Egg Curry",
    price: 90,
    category: "Curry",
    description: "Boiled eggs cooked in spicy gravy",
    image: "/uploads/egg-curry.jpg"
  },
  {
    name: "Fish Fry",
    price: 160,
    category: "Seafood",
    description: "Spicy masala-coated fish fried till crispy",
    image: "/uploads/fish-fry.jpg"
  },
  {
    name: "Paneer Butter Masala",
    price: 140,
    category: "Veg Curry",
    description: "Smooth tomato-based gravy with soft cottage cheese",
    image: "/uploads/paneer-butter-masala.jpg"
  }
];

// 3. INSERT DATA
const seedMenu = async () => {
  try {
    await Menu.deleteMany(); // clear old menu items
    console.log("Old menus cleared");

    await Menu.insertMany(menuData);
    console.log("Menu data seeded successfully!");

    process.exit(); // exit script
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seedMenu();
