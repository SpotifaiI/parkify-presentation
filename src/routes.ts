import { Router } from 'express';

const routes = Router();

routes.get('/', (_, res) => {
  res.status(200).send({ ok: true });
});

export { routes };
