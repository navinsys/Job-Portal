import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    console.log("Req user in postJob:", req.user); // ✅ Debugging req.user

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.user?.id; // ✅ Fixed: Using req.user.id
    console.log("User ID in postJob:", userId); // ✅ Debugging userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID", success: false });
    }

    if (
      !title ||
      !description ||
      !requirements ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({ message: "Please fill all the fields", success: false });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      createdBy: userId, // ✅ Fixed: Now correctly defined
    });

    return res.status(201).json({
      message: "Job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log("Error in postJob:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query).populate({path:"company"}).sort({ createdAt: -1 });
    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found", success: false });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    console.log("Req user in getAdminJobs:", req.user); // ✅ Debugging req.user
    const adminId = req.user?.id; // ✅ Fixed: Using req.user.id
    console.log("Admin ID in getAdminJobs:", adminId); // ✅ Debugging adminId

    const jobs = await Job.find({ createdBy: adminId });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found", success: false });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};
