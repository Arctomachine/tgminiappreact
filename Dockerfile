FROM oven/bun:alpine as base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/install
COPY package.json bun.lockb /temp/install/
RUN cd /temp/install && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/install/node_modules node_modules
COPY . .
RUN bun run build

FROM base AS release
COPY --from=install /temp/install/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist dist
COPY --from=prerelease /usr/src/app/public public
COPY --from=prerelease /usr/src/app/package.json .
ENV NODE_ENV=production

USER bun
EXPOSE 4173/tcp
ENTRYPOINT ["bun", "run", "preview"]
