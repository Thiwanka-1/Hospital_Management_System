// api/__tests__/treatmentController.test.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js"; // Corrected path
import Treatment from "../models/treatment.model.js";
import User from "../models/user.model.js";

// Mock nodemailer
jest.mock("nodemailer");

let testUser;
let testUser2;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a test user
  testUser = new User({
    username: "test1",
    name: "Test User1",
    email: "testuser1@example.com",
    password: "password123", // Ensure your User model hashes passwords or adjust accordingly
  });
  await testUser.save();

  // Create a test user 2
  testUser2 = new User({
    username: "sachi",
    name: "Test sachi",
    email: "sachi@example.com",
    password: "password123", // Ensure your User model hashes passwords or adjust accordingly
  });
  await testUser2.save();
});

afterEach(async () => {
  // Clean up treatments after each test
  await Treatment.deleteMany({});
});

afterAll(async () => {
  // Clean up users and close connection
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Treatment Controller", () => {
  //Add Testing

  // Positive Test Case 1: Add a treatment successfully
  it("should add a new treatment successfully", async () => {
    const treatmentData = {
      treatmentName: "Physiotherapy",
      patientId: testUser._id.toString(),
      prescribedDate: "2024-04-25",
      doctorName: "Dr. Smith",
      description: "Daily sessions for 2 weeks.",
    };

    const response = await request(app)
      .post("/api/treatments/add")
      .send(treatmentData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Treatment added successfully");
    expect(response.body.treatment).toHaveProperty("_id");
    expect(response.body.treatment.treatmentName).toBe(
      treatmentData.treatmentName
    );
    expect(response.body.treatment.patient).toBe(testUser._id.toString());
  });

  // Negative Test Case 1: Missing required fields
  it("should return an error when required fields are missing", async () => {
    const incompleteTreatmentData = {
      // Missing 'treatmentName'
      patientId: testUser._id.toString(),
      prescribedDate: "2024-06-15",
      doctorName: "Dr. Lee",
      description: "Follow-up session.",
    };

    const response = await request(app)
      .post("/api/treatments/add")
      .send(incompleteTreatmentData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("All fields are required.");
  });

  // Negative Test Case 2: Missing required fields
  it("should return an error when required fields are missing", async () => {
    const incompleteTreatmentData = {
      treatmentName: "Physiotherapy",
      patientId: testUser._id.toString(),
      // Missing 'prescribedDate'
      doctorName: "Dr. Lee",
      description: "Follow-up session.",
    };

    const response = await request(app)
      .post("/api/treatments/add")
      .send(incompleteTreatmentData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("All fields are required.");
  });

  //Update testing

  // Positive Test Case: Successfully updating a treatment
  it("should update an existing treatment successfully", async () => {
    // First, create a treatment to update
    const treatment = new Treatment({
      treatmentName: "Physiotherapy",
      patient: testUser._id,
      prescribedDate: "2024-04-25",
      doctorName: "Dr. Smith",
      description: "Daily sessions for 2 weeks.",
    });
    await treatment.save();

    // Data to update
    const updatedData = {
      treatmentName: "Advanced Physiotherapy",
      prescribedDate: "2024-05-01",
      doctorName: "Dr. John Smith",
      description: "Extended sessions for 3 weeks.",
    };

    const response = await request(app)
      .put(`/api/treatments/update/${treatment._id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Treatment updated successfully");
    expect(response.body.treatment).toHaveProperty(
      "_id",
      treatment._id.toString()
    );
    expect(response.body.treatment.treatmentName).toBe(
      updatedData.treatmentName
    );
    expect(new Date(response.body.treatment.prescribedDate)).toEqual(
      new Date(updatedData.prescribedDate)
    );
    expect(response.body.treatment.doctorName).toBe(updatedData.doctorName);
    expect(response.body.treatment.description).toBe(updatedData.description);
  });

  // Negative Test Case 1: Updating a non-existent treatment
  it("should return a 404 error when trying to update a non-existent treatment", async () => {
    const nonExistentId = testUser2._id.toString(); // user id for treamentid to check

    const updatedData = {
      treatmentName: "Advanced Physiotherapy",
      prescribedDate: "2024-05-01",
      doctorName: "Dr. John Smith",
      description: "Extended sessions for 3 weeks.",
    };

    const response = await request(app)
      .put(`/api/treatments/update/${nonExistentId}`)
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Treatment not found");
  });

  //Negative Test Case 2: Partial updates with some invalid fields
  it("should update only the provided valid fields and ignore invalid ones", async () => {
    // First, create a treatment to update
    const treatment = new Treatment({
      treatmentName: "Physiotherapy",
      patient: testUser._id,
      prescribedDate: "2024-04-25",
      doctorName: "Dr. Smith",
      description: "Daily sessions for 2 weeks.",
    });
    await treatment.save();

    const updatedData = {
      treatmentName: "Occupational Therapy",
      invalidField: "This field does not exist",
    };

    const response = await request(app)
      .put(`/api/treatments/update/${treatment._id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Treatment updated successfully");
    expect(response.body.treatment.treatmentName).toBe(
      updatedData.treatmentName
    );
    expect(response.body.treatment).not.toHaveProperty("invalidField");
  });

  // Delete testing

  // Positive Test Case: Successfully deleting an existing treatment
  it("should delete an existing treatment successfully", async () => {
    // First, create a treatment to delete
    const treatment = new Treatment({
      treatmentName: "Chiropractic",
      patient: testUser._id,
      prescribedDate: "2024-07-20",
      doctorName: "Dr. Who",
      description: "Weekly sessions for 1 month.",
    });
    await treatment.save();

    const response = await request(app)
      .delete(`/api/treatments/delete/${treatment._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Treatment deleted successfully"
    );

    // Verify that the treatment has been deleted from the database
    const deletedTreatment = await Treatment.findById(treatment._id);
    expect(deletedTreatment).toBeNull();
  });

  // Negative Test Case 1: Attempting to delete a non-existent treatment
  it("should return a 404 error when trying to delete a non-existent treatment", async () => {
    const nonExistentId = testUser2._id; // Generate a valid but non-existent ObjectId

    const response = await request(app)
      .delete(`/api/treatments/delete/${nonExistentId}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Treatment not found");
  });
});
