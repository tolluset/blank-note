import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

interface JWTPayload {
  userId: string;
  email: string;
}

const auth = new Hono();

auth.post("/google", async (c) => {
  try {
    const body = await c.req.json();

    const { access_token } = body;

    if (!access_token) {
      return c.json({ error: "Access token is required" }, 400);
    }

    // access_token으로 Google API를 호출하여 사용자 정보 가져오기
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
    );

    if (!response.ok) {
      return c.json({ error: "Invalid access token" }, 400);
    }

    const payload = (await response.json()) as {
      id: string;
      email: string;
      name?: string;
      picture?: string;
    };

    const { id: googleId, email, name, picture } = payload;

    let user = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);

    if (user.length === 0) {
      const newUser = {
        id: nanoid(),
        email,
        name: name || null,
        avatar: picture || null,
        googleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(users).values(newUser);
      user = [newUser];
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    return c.json({ token });
  } catch (error) {
    console.error("Google auth error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

auth.get("/me", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "No token provided" }, 401);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as JWTPayload;

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user[0]);
  } catch (error) {
    console.error("Get me error:", error);
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default auth;
