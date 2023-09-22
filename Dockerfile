FROM node:20.6.1-alpine AS runtime
WORKDIR /app

# Copy the package.json and package-lock.json over in the intermedate "build" image
COPY ./package.json ./
COPY ./package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the source code into the build image
COPY ./ ./

# Build the project
RUN npm run build


ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD npm run start