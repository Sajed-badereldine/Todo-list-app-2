FROM public.ecr.aws/docker/library/node:20-alpine AS build

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM public.ecr.aws/nginx/nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]