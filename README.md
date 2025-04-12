## Instructions to run

First, run the development server:

```bash
docker compose up
pnpm install
pnpm dlx prisma generate
pnpm dlx prisma db push
pnpm dev
ngrok http --url=hardly-upward-robin.ngrok-free.app 3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
