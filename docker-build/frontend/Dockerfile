FROM node:18-alpine AS builder
ENV NODE_ENV production
## Add a work directory
WORKDIR /app
## Cache and Install dependencies
##COPY package.json .
##COPY yarn.lock .
COPY . .
RUN npm install react-scripts-less typescript -g
RUN npm link typescript
RUN npm run build
#ENV GENERATE_SOURCEMAP false
#
#RUN yarn install --production
## Copy app files
##COPY /src/frontend .
## Build the app
#RUN yarn docker-build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY ./docker-build/frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]