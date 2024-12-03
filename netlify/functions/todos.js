import serverless from "serverless-http";

import { app, router } from "../..";

router.get("/", async(req, res) => {
  try {
    const result = await req.dbClient.query('SELECT * FROM todos');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/", async (req, res) => {
  try {
    const { task, completed } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const result = await req.dbClient.query(
      'INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *',
      [task, completed || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await req.dbClient.query('SELECT * FROM todos WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;

    if (!task && completed === undefined) {
      return res.status(400).json({ error: 'At least one field (task or completed) must be provided' });
    }

    const result = await req.dbClient.query(
      'UPDATE todos SET task = COALESCE($1, task), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *',
      [task, completed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(result.rows[0]);  // Return the updated todo
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await req.dbClient.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use("/todos", router);

export const handler = serverless(app);
