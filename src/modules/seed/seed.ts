import bcrypt from "bcryptjs";
import User from "../user/user.model";

export const seedAdminUsers = async () => {
  try {
    const users = [
      {
        email: "admin@gmail.com",
        role: "admin",
        name:"admin1"
      },
      {
        email: "agent@gmail.com",
        role: "agent",
        name:"agent1"
      },
    ];

    const password = "Test@123";
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });

      if (!existing) {
        await User.create({
          full_name: u.role,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          status: 1,
        });

        console.log(`✅ ${u.role} created`);
      } else {
        console.log(`⚠️ ${u.role} already exists`);
      }
    }
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
};