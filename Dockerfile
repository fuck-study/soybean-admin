FROM node:18.12.0 as builder

ENV WORKDIR=/soybean-admin

WORKDIR $WORKDIR

COPY ./ $WORKDIR/

ARG version
ENV COMMITID=$version
ENV COREPACK_ENABLE_STRICT=0

RUN npm i -g pnpm

RUN pnpm install
RUN pnpm build

FROM nginx:alpine as prod

RUN mkdir /soybean

COPY --from=builder /soybean-admin/dist /soybean-admin
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
