FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./
# Install optional native packages too; Tailwind's oxide package needs its
# platform-specific binding inside the Linux container.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates python3 make g++ \
	&& npm install --include=optional \
	&& apt-get remove -y --purge python3 make g++ \
	&& apt-get autoremove -y \
	&& rm -rf /var/lib/apt/lists/*

COPY . ./

EXPOSE 5173

# Run Vite dev server listening on all interfaces so the host can access it
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 5173"]
