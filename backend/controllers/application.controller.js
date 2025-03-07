import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.user?.id; // ✅ Ensure correct user identification
        const jobId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: User ID is missing.",
                success: false
            });
        }

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        console.log("User ID:", userId);
        console.log("Job ID:", jobId);

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            console.log("User has already applied:", existingApplication);
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (!job.applications) {
            job.applications = [];
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId, // ✅ Ensure applicant is set
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error in applyJob:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user?.id; // ✅ Ensure user ID is correctly retrieved
        console.log("Fetching applications for User ID:", userId);

        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "company",
                    options: { sort: { createdAt: -1 } },
                },
            });

        console.log("Applications found:", applications);

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No Applications found",
                success: false
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Admin - View all applicants for a specific job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log("Fetching applicants for Job ID:", jobId);

        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }

        // Find the application by ID
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
