FROM bitnami/node:8 as builder

WORKDIR /contents-api
COPY package.json /contents-api
RUN npm install --production --unsafe
COPY . /contents-api

FROM bitnami/node:8-prod
WORKDIR /contents-api
RUN npm install --global pm2

COPY --from=builder /contents-api .
EXPOSE 3000

# later, make it works for now
# USER 1001
CMD ["pm2-docker", "--raw", "pm2.yaml"]