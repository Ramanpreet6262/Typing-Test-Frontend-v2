import Keys from './SecretKeys/keys';

export default {
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: Keys.userPoolId,
    APP_CLIENT_ID: Keys.appClientId,
    IDENTITY_POOL_ID: Keys.identityPoolId
  }
};
