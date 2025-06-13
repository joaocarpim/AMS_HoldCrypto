module.exports = {
  reactStrictMode: true,
  env: {
    API_URL: 'http://localhost:5294',  // URL do backend
  },
  async redirects() {
    return [
      {
        source: '/',
      destination: '/register', // Alterado para a página de registro
      permanent: true,
      },
    ];
  },
};
