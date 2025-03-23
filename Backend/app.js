const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";
const MONGO_URI = "mongodb://localhost:27017/connectDB";

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow frontend to communicate with backend

// ✅ User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["volunteer", "ngo", "government"], required: true },
    extra_fields: [{ key: String, value: mongoose.Schema.Types.Mixed }],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      },
      address: { type: String }
    },
    skills: [{ type: String }],
    interests: [{ type: String }],
  },
  { timestamps: true }
);

// ✅ Issue Schema - Updated categories to match frontend
const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    category: {
      type: String,
      enum: ["Environment", "Education", "Health", "Infrastructure", "Safety", "Other"],
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere", // Enables geospatial queries
      },
      address: { type: String }
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// ✅ Comment Schema - Added to support project comments
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

// ✅ Project Schema - Updated categories to match frontend
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category: {
      type: String,
      enum: ["Environment", "Education", "Health", "Infrastructure", "Safety", "Other"],
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere"
      },
      address: { type: String }
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    imageUrl: {
      type: String
    },
    volunteersNeeded: {
      type: Number,
      default: 1
    },
    volunteers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ["active", "completed", "left"],
        default: "active"
      },
      hours: {
        type: Number,
        default: 0
      }
    }],
    status: {
      type: String,
      enum: ["planning", "active", "completed", "cancelled"],
      default: "planning"
    },
    events: [{
      title: { type: String, required: true },
      description: { type: String },
      date: { type: Date, required: true },
      location: { type: String },
      duration: { type: Number } // in hours
    }],
    skills: [{ type: String }],
    relatedIssue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue"
    },
    // 🆕 Added comments array to Project schema
    comments: [commentSchema]
  },
  { timestamps: true }
);

// ✅ Contribution Schema
const contributionSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    projectTitle: {
      type: String,
      required: true
    },
    organization: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    hours: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending"
    },
    skills: [{ type: String }],
    impact: {
      type: String
    },
    community: {
      type: String
    }
  },
  { timestamps: true }
);

// Create models
const User = mongoose.model("User", userSchema);
const Issue = mongoose.model("Issue", issueSchema);
const Project = mongoose.model("Project", projectSchema);
const Contribution = mongoose.model("Contribution", contributionSchema);

// ✅ Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user;
    next();
  });
};

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, phone, role, extra_fields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "Username or Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
      extra_fields,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token with user role
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User Profile by ID
app.get("/api/user/:userId/profile", authenticateToken, async (req, res) => {
  try {
    // Check if the requesting user is authorized to access this profile
    // Only allow if it's the user's own profile or an admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to access this profile" });
    }
    
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update User Profile
app.post("/api/user/:userId/update", authenticateToken, async (req, res) => {
  try {
    // Check if the requesting user is authorized to update this profile
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Update user fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.extra_fields = req.body.extra_fields || user.extra_fields;
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;
    
    await user.save();
    
    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Current User Profile
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Create a new issue
app.post("/api/issues", authenticateToken, async (req, res) => {
  try {
    const { title, description, category, image, location } = req.body;

    const newIssue = new Issue({
      userId: req.user.id,
      title,
      description,
      category,
      image,
      location,
    });

    await newIssue.save();
    res.status(201).json({ message: "Issue created successfully", issue: newIssue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get all issues
// ✅ Get all issues that are not converted to projects
app.get("/api/issues", async (req, res) => {
    try {
      // Find all issues with no related project
      const issues = await Issue.find({ status: { $ne: "in-progress" } }).populate(
        "userId",
        "username email"
      );
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  

// ✅ Get issues by user ID
app.get("/api/issues/user/:userId", authenticateToken, async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.params.userId });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get nearby issues
app.get("/api/issues/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius in kilometers
    
    const issues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // convert to meters
        }
      }
    }).populate("userId", "username");
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🆕 Create a project from an issue
app.post("/api/projects/create/:issueId", authenticateToken, async (req, res) => {
  try {
    // Verify user is an NGO or government entity
    if (req.user.role !== 'ngo' && req.user.role !== 'government'  ) {
      return res.status(403).json({ message: "Only NGOs and government entities can create projects" });
    }

    // Find the issue
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    // Create a new project based on the issue
    const newProject = new Project({
      title: issue.title,
      description: issue.description,
      organization: req.user.id,
      category: issue.category,
      location: issue.location,
      startDate: new Date(), // Current date as default start date
      relatedIssue: issue._id,
      comments: [], // Initialize with empty comments array
      status: "planning"
    });

    await newProject.save();

    // Update issue status
    issue.status = "in-progress";
    await issue.save();

    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🆕 Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("organization", "username") 
      .populate("comments.userId", "username");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🆕 Get project by ID
app.get("/api/projects/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("organization", "username")
      .populate("comments.userId", "username");
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🆕 Add comment to a project
app.post("/api/projects/:projectId/comment", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Add new comment
    project.comments.push({
      userId: req.user.id,
      text
    });

    await project.save();
    
    // Return updated project with populated user data
    const updatedProject = await Project.findById(req.params.projectId)
      .populate("organization", "username")
      .populate("comments.userId", "username");
    
    res.status(201).json({ message: "Comment added successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🆕 Get projects by NGO ID (organization)
app.get("/api/projects/ngo/:organizationId", async (req, res) => {
  try {
    const projects = await Project.find({ organization: req.params.organizationId })
      .populate("organization", "username")
      .populate("comments.userId", "username");
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});