## Stage 1: Build the TypeScript code
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Primsa genrate
RUN yarn prisma generate

# Compile TypeScript code
RUN yarn run build

## Stage 2: Run the built code
FROM node:20-alpine AS production

# Set NODE_ENV to production by default if not set during build
# This is important because the server will not start if NODE_ENV is not set
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=development /app/package*.json ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy only the necessary files from the build stage
COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma

# Primsa genrate
RUN yarn prisma generate

# Expose the port the app runs on (default 3000, change as needed)
EXPOSE 8000

# Start the application
CMD ["yarn", "run", "start"]