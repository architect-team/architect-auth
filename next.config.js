module.exports = {
  rewrites() {
    return [
      {
        source: '/self-service/:slug*',
        destination: process.env.KRATOS_PUBLIC_URL + '/self-service/:slug*',
      },
      {
        source: '/schemas/:slug*',
        destination: process.env.KRATOS_PUBLIC_URL + '/schemas/:slug*',
      },
      {
        source: '/sessions/:slug*',
        destination: process.env.KRATOS_PUBLIC_URL + '/sessions/:slug*',
      },
      {
        source: '/.well-known/:slug*',
        destination: process.env.HYDRA_PUBLIC_URL + '/.well-known/:slug*',
      },
      {
        source: '/oauth2/:slug*',
        destination: process.env.HYDRA_PUBLIC_URL + '/oauth2/:slug*',
      },
      {
        source: '/userinfo',
        destination: process.env.HYDRA_PUBLIC_URL + '/userinfo',
      },
    ];
  },
};
