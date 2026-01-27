import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// In-memory store for todos
const todos: Todo[] = [];

const app = new Elysia()
  .use(cors())
  .get("/", () => ({ message: "Todo API Server" }))
  .get("/api/todos", () => todos)
  .post(
    "/api/todos",
    ({ body }) => {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: body.text,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(todo);
      return todo;
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    }
  )
  .patch(
    "/api/todos/:id",
    ({ params, body }) => {
      const todo = todos.find((t) => t.id === params.id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      if (body.text !== undefined) todo.text = body.text;
      if (body.completed !== undefined) todo.completed = body.completed;
      return todo;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        text: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete(
    "/api/todos/:id",
    ({ params }) => {
      const index = todos.findIndex((t) => t.id === params.id);
      if (index === -1) {
        throw new Error("Todo not found");
      }
      todos.splice(index, 1);
      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .listen(3001);

console.log(
  `API server running at http://${app.server?.hostname}:${app.server?.port}`
);
