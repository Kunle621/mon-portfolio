import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authMiddleware } from "./auth";
import { loginSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema } from "@shared/schema";
import express from "express";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Public routes - Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(admin.id);
      
      // Remove password from response
      const { password: _, ...adminData } = admin;
      
      res.json({ admin: adminData, token });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Public routes - Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects(true); // Only published
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || !project.published) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Public routes - Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true); // Only published
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Public routes - Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials(true); // Only published
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Public routes - Services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices(true); // Only published
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Public routes - Contact
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      
      // TODO: Send email notification to admin
      
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Public routes - Newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriberData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getNewsletterSubscribers();
      if (existing.some(s => s.email === subscriberData.email)) {
        return res.status(409).json({ message: "Already subscribed" });
      }

      const subscriber = await storage.createNewsletterSubscriber(subscriberData);
      
      // TODO: Send welcome email
      
      res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      await storage.unsubscribeByEmail(email);
      res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Protected routes - Admin Projects
  app.get("/api/admin/projects", authMiddleware, async (req, res) => {
    try {
      const projects = await storage.getProjects(false); // All projects
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/admin/projects", authMiddleware, async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.patch("/api/admin/projects/:id", authMiddleware, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/admin/projects/:id", authMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Protected routes - Admin Blog
  app.get("/api/admin/blog", authMiddleware, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false); // All posts
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", authMiddleware, async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.patch("/api/admin/blog/:id", authMiddleware, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/admin/blog/:id", authMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Protected routes - Admin Testimonials
  app.get("/api/admin/testimonials", authMiddleware, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials(false);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", authMiddleware, async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.patch("/api/admin/testimonials/:id", authMiddleware, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/admin/testimonials/:id", authMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteTestimonial(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Protected routes - Admin Services
  app.get("/api/admin/services", authMiddleware, async (req, res) => {
    try {
      const services = await storage.getServices(false);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", authMiddleware, async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.patch("/api/admin/services/:id", authMiddleware, async (req, res) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/admin/services/:id", authMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteService(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Protected routes - Admin Messages
  app.get("/api/admin/messages", authMiddleware, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/admin/messages/:id/read", authMiddleware, async (req, res) => {
    try {
      const success = await storage.markMessageAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  app.delete("/api/admin/messages/:id", authMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteContactMessage(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Protected routes - Admin Newsletter
  app.get("/api/admin/newsletter", authMiddleware, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.delete("/api/admin/newsletter/:id", authMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteNewsletterSubscriber(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      res.json({ message: "Subscriber deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  // Protected routes - Admin Profile
  app.get("/api/admin/profile", authMiddleware, async (req, res) => {
    try {
      const adminId = (req as any).adminId;
      const admin = await storage.getAdmin(adminId);
      
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const { password: _, ...adminData } = admin;
      res.json(adminData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/admin/profile", authMiddleware, async (req, res) => {
    try {
      const adminId = (req as any).adminId;
      const { password, ...updateData } = req.body;

      // Hash password if provided
      if (password) {
        updateData.password = await hashPassword(password);
      }

      const admin = await storage.updateAdmin(adminId, updateData);
      
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const { password: _, ...adminData } = admin;
      res.json(adminData);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Protected routes - File Upload
  app.post("/api/admin/upload", authMiddleware, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Protected routes - Stats
  app.get("/api/admin/stats", authMiddleware, async (req, res) => {
    try {
      const [projects, posts, messages, subscribers] = await Promise.all([
        storage.getProjects(true),
        storage.getBlogPosts(true),
        storage.getContactMessages(),
        storage.getNewsletterSubscribers(),
      ]);

      const unreadMessages = messages.filter(m => !m.read).length;

      res.json({
        projectsCount: projects.length,
        postsCount: posts.length,
        unreadMessagesCount: unreadMessages,
        subscribersCount: subscribers.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
