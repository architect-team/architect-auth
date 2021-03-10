FROM oryd/kratos:v0.5

USER root
RUN apk add --no-cache postgresql-client
RUN mkdir -p /etc/config/kratos/
RUN chown ory:ory /etc/config/kratos/
USER ory

ENTRYPOINT [""]
