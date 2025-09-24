const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  getById: (id: string | number) => `${basePath}/${id}`,
  update: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
});

// As rotas aqui DEVEM corresponder exatamente ao 'UpstreamPathTemplate' do ocelot.json
export const userAPI = crudAPI(`/user`);
export const currencyAPI = crudAPI(`/currency`); // <-- ESTA LINHA ESTAVA FALTANDO
export const authAPI = {
  login: () => `/auth/login`,
  getProfile: () => `/auth/profile`,
};

