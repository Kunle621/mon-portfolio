import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seed() {
  console.log("Seeding database...");

  // Create admin user (username: admin, password: admin123)
  const existingAdmin = await storage.getAdminByUsername("admin");
  
  if (!existingAdmin) {
    const hashedPassword = await hashPassword("admin123");
    await storage.createAdmin({
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
      bioFr: "Développeur web passionné avec 5+ années d'expérience dans la création d'applications web modernes et performantes.",
      bioEn: "Passionate web developer with 5+ years of experience in creating modern and performant web applications.",
      skillsFr: ["React & Next.js", "Node.js & Express", "MongoDB & PostgreSQL", "TailwindCSS", "TypeScript"],
      skillsEn: ["React & Next.js", "Node.js & Express", "MongoDB & PostgreSQL", "TailwindCSS", "TypeScript"],
    });
    console.log("✓ Admin user created (username: admin, password: admin123)");
  } else {
    console.log("✓ Admin user already exists");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
