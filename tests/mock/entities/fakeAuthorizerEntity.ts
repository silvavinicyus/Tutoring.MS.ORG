import { IAuthorizerInformation } from '@business/dto/role/authorize'

export const fakeAuthorizer: IAuthorizerInformation = {
  user_real_id: 1,
  user_real_uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  birthdate: new Date().toString(),
  email: 'email@email.com',
  name: 'name',
  permissions: 'permissions',
  phone: '82 981981981',
  role: 'admin',
}
