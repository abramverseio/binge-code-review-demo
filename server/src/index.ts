import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Buttercup Wedding Planner API listening on http://localhost:${PORT}`);
});
