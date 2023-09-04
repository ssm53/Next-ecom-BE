// we're good to go!

import { PrismaClient, Prisma } from "@prisma/client";
import request from "supertest";
import app from "../../app.js";

// this is to clean up data before each test
async function cleanupDatabase() {
  const prisma = new PrismaClient();
  // this one below allows us to track each of our tables and delete it after each test
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

// we're starting our testing for post/users.. we do this to test for correct deets.here we're giving it sample data
describe("POST /users", () => {
  const user = {
    name: "John",
    email: "john9@example.com",
    password: "insecure",
  };

  beforeAll(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("with valid data should return 200", async () => {
    const response = await request(app)
      .post("/users")
      .send(user) // this is to say we're sending a request with this body user
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeTruthy;
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
    expect(response.body.password).toBe(undefined);
  });

  it("with same email should fail", async () => {
    const response = await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe("already taken");
  });

  it("with invalid password should fail", async () => {
    user.email = "unique@example.com";
    user.password = "short";
    const response = await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.password).toBe(
      "should be at least 8 characters"
    );
  });

  it("with invalid email should fail", async () => {
    user.email = "shaunshanil99gmail.com";
    user.password = "Bobbybrown89";
    const response = await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe("is invalid");
  });

  it("with blank name should fail", async () => {
    user.email = "shaunshanil99@gmail.com";
    user.password = "Bobbybrown89";
    user.name = "";
    const response = await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.name).toBe("cannot be blank");
  });
});
