const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminEmail = "admin@ecommerce.com";
    const adminPassword = "admin123";
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }
    
    const hashPassword = await bcrypt.hash(adminPassword, 12);
    const adminUser = new User({
      userName: "admin",
      email: adminEmail,
      password: hashPassword,
      role: "admin"
    });
    
    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@ecommerce.com");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();