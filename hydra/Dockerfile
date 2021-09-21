FROM oryd/hydra:v1.10.5-alpine

USER root
RUN apk add --no-cache postgresql-client jq
RUN mkdir -p /etc/config/hydra/
RUN chown ory:ory /etc/config/hydra/

RUN mkdir -p /certs

USER ory

ENTRYPOINT []
