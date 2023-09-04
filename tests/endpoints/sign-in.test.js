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
describe("POST /auth", () => {
  const newUser = {
    // New user data to be used for sign-up
    name: "Usha",
    email: "usha11@gmail.com",
    password: "Bobbybrown89",
  };

  beforeAll(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("with valid data should return 200", async () => {
    // Sign up a new user
    const signUpResponse = await request(app)
      .post("/users")
      .send(newUser)
      .set("Accept", "application/json");

    expect(signUpResponse.statusCode).toBe(200);

    const signInResponse = await request(app)
      .post("/auth")
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .set("Accept", "application/json");

    expect(signInResponse.statusCode).toBe(200);
    expect(signInResponse.body.userId).toBeTruthy;
    expect(signInResponse.body.accessToken).toBeTruthy;
  });

  it("with wrong password should fail", async () => {
    newUser.password = "Bobbybrown99";
    const response = await request(app)
      .post("/auth")
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe("Email address or password not valid");
    expect(response.body.accessToken).toBeUndefined(); // Expect accessToken to be undefined
  });

  it("with wrong email should fail", async () => {
    newUser.email = "usha12@gmail.com";
    newUser.password = "Bobbybrown89";
    const response = await request(app)
      .post("/auth")
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.accessToken).toBeUndefined(); // Expect accessToken to be undefined
  });
});
