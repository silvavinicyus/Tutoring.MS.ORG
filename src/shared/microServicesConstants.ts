const usEast2 = 'us-east-2'

export const MS_ORG = {
  name: `tutoring-org-${
    process.env.IS_OFFLINE === 'true' ? 'dev' : process.env.STAGE
  }`,
  region: usEast2,
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:4101' : ``,
  sns: {
    endpoint: process.env.IS_OFFLINE ? 'http://localhost:4099' : ``,
    createUser: process.env.SNS_CREATE_USER,
  },
}

export const MS_AUTH = {
  name: `tutoring-auth-${
    process.env.IS_OFFLINE === 'true' ? 'dev' : process.env.STAGE
  }`,
  region: usEast2,
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:4001' : ``,
  sns: {
    endpoint: process.env.IS_OFFLINE ? 'http://localhost:3999' : ``,
  },
}
