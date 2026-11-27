# syntax=docker/dockerfile:1

# Build stage: builds the app from source, so the image needs no prior npm run build on the host.
# Node's major version follows .nvmrc. No install scripts, like CI's build job (esbuild ships prebuilt binaries).
FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
WORKDIR /build
COPY package.json package-lock.json ./
# The cache mount keeps npm's downloads between builds without putting them in a layer
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund
COPY . .
RUN npm run build

# Runtime stage: nginx as user 101 on port 8080, pid and temp files in /tmp. Pinned by digest; Dependabot updates it.
FROM nginxinc/nginx-unprivileged:1.31-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e
LABEL org.opencontainers.image.source="https://github.com/esistegalaber/build-bro-ui" \
      org.opencontainers.image.description="Build Bruh UI: the Angular app, served by nginx, with /api passed on to the API" \
      org.opencontainers.image.licenses="Apache-2.0"
# The base image's default server would listen next to ours; without it, the entrypoint's IPv6 script has nothing to edit
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/snippets/ /etc/nginx/snippets/
COPY docker/conf.d/default.conf.template /etc/nginx/templates/conf.d/default.conf.template
COPY --from=build /build/dist/build-bro-ui/browser/ /usr/share/nginx/build-bro-ui/
# BUILDZ_API: the API's host name (port 8080). The entrypoint reads the resolver from /etc/resolv.conf and
# renders the server config into /tmp/conf.d, so a read-only root filesystem with a tmpfs on /tmp works.
ENV BUILDZ_API=api \
    NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1 \
    NGINX_ENVSUBST_OUTPUT_DIR=/tmp
USER 101:101
EXPOSE 8080
