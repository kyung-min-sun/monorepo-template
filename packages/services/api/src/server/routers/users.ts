import type { Elysia } from "elysia";

import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

/**
 * Users router - Example CRUD operations
 */
export function usersRouter<T extends Elysia>(app: T) {
  return app
    .get("/", async ({ db }) => {
      const users = await db.client.user.findMany();
      return { users };
    })
    .get("/:id", async ({ db, params }) => {
      const user = await db.client.user.findUnique({
        where: { id: params.id },
      });
      return { user };
    })
    .post(
      "/",
      async ({ db, body }) => {
        const parsed = CreateUserSchema.parse(body);
        const user = await db.client.user.create({
          data: parsed,
        });
        return { user };
      },
      {
        body: CreateUserSchema,
      },
    )
    .delete("/:id", async ({ db, params }) => {
      await db.client.user.delete({
        where: { id: params.id },
      });
      return { success: true };
    });
}
