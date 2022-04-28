process.env.NODE_ENV = "test";
import supertest from "supertest";

import { app, server } from "../../app";
import { disconnectDb } from "../../models/db";

import hobbyData from "./data/hobby.data.json";

const request = supertest(app);

console.error = jest.fn(); // silence log during test
console.log = jest.fn(); // silence log during test

describe("API Test", () => {
  afterAll(async () => {
    await disconnectDb();
    server.close();
  });

  let mockUserId = "62693de8acf0b9cc14a396c6";
  let mockHobbyId = "62694ab0a14d48681700bbf5";

  it("POST user: Add new user to db", async () => {
    const res = await request.post("/user").send({ name: "john" });
    mockUserId = res.body.result.id;
    expect(res.status).toBe(200);
    expect(res.body.result.name).toBe("john");
  });

  it("GET user: Get all users from db", async () => {
    const res = await request.get("/user");
    // console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.result).toEqual([{ id: mockUserId, name: "john" }]);
  });

  it("POST hobby: Add hobby to db", async () => {
    const postHobby = await request.post("/hobbies").send({
      userId: mockUserId,
      ...hobbyData,
    });

    mockHobbyId = postHobby.body.result.id;
    expect(postHobby.status).toBe(200);
    expect(postHobby.body.result).toEqual({
      id: mockHobbyId,
      ...hobbyData,
    });
  });

  it("GET hobbies: Get user hobbies from db", async () => {
    const res = await request.get("/hobbies/" + mockUserId);
    expect(res.status).toBe(200);
    expect(res.body.result).toEqual([{ id: mockHobbyId, ...hobbyData }]);
  });

  it("GET hobbies Error: Get user hobbies from db", async () => {
    const res = await request.get("/hobbies/invalidId");
    expect(res.status).toBe(400);
  });

  it("DELETE hobby: Delete hobby from db", async () => {
    const res = await request.delete("/hobbies").send({
      userId: mockUserId,
      hobbyId: mockHobbyId,
    });
    expect(res.status).toBe(200);
    expect(res.body.result).toEqual({});
  });
});
