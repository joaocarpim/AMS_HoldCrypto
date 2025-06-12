// src/services/api.ts
const PREFIX = '/api';  

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll:   () => `${basePath}`,
  getById:  (id: string|number) => `${basePath}/${id}`,
  update:   (id: string|number) => `${basePath}/${id}`,
  delete:   (id: string|number) => `${basePath}/${id}`,
});

export const userAPI = crudAPI(`${PREFIX}/user`);
export const authAPI = {
  login:        () => `${PREFIX}/auth/login`,
  logout:       () => `${PREFIX}/auth/logout`,
  refreshToken: () => `${PREFIX}/auth/refreshToken`,
};
