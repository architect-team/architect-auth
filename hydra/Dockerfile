FROM oryd/hydra:v1.9-alpine

USER root
RUN apk add --no-cache postgresql-client
RUN mkdir -p /etc/config/hydra/
RUN chown ory:ory /etc/config/hydra/
USER ory

ENTRYPOINT [""]
