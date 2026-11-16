FROM node:20-alpine
WORKDIR /app
COPY package.json LICENSE ./
COPY bin ./bin
ENTRYPOINT ["node", "/app/bin/finops.mjs", "mcp"]
