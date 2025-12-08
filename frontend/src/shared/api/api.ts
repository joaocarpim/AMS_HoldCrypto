// Caminho: frontend/src/shared/api/api.ts

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  getById: (id: string | number) => `${basePath}/${id}`,
  update: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
});

// As rotas aqui DEVEM corresponder exatamente ao 'UpstreamPathTemplate' do ocelot.json
export const userAPI = crudAPI(`/user`);
export const currencyAPI = crudAPI(`/currency`);
export const authAPI = {
  login: () => `/auth/login`,
  getProfile: () => `/auth/profile`,
};

// Definições para a Wallet API
export const walletAPI = {
  // GET /wallet?userId={userId}
  getUserWallets: (userId: number) => `/wallet?userId=${userId}`,
  // POST /wallet
  createWallet: () => `/wallet`,
  // POST /wallet/{id}/deposit
  deposit: (walletId: number) => `/wallet/${walletId}/deposit`,
  // POST /wallet/{id}/withdraw
  withdraw: (walletId: number) => `/wallet/${walletId}/withdraw`,
  // POST /wallet/transfer (transferência simples)
  transfer: () => `/wallet/transfer`,

  // ****** NOVA ROTA ADICIONADA ******
  // POST /wallet/trade (troca/swap de moedas)
  trade: () => `/wallet/trade`,
  // **********************************
};