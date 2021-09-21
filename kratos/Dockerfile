FROM oryd/kratos:v0.6.1-alpha.1

USER root
RUN apk add --no-cache postgresql-client jq
RUN wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_amd64.tar.gz -O - |\
  tar xz && mv yq_linux_amd64 /usr/bin/yq

RUN mkdir -p /etc/config/kratos/
RUN chown ory:ory /etc/config/kratos/

RUN mkdir -p /certs

USER ory

ENTRYPOINT []
