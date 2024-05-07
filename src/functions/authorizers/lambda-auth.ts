import { APIGatewayRequestSimpleAuthorizerHandlerV2 } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secretsManagerClient = new SecretsManagerClient({});

if (!process.env.API_KEY_SECRET_NAME) {
  throw new Error('API_KEY_SECRET_NAME environment variable not set');
}
const API_KEY_SECRET_NAME = process.env.API_KEY_SECRET_NAME;

let API_KEY: string | undefined = undefined;

export const handler: APIGatewayRequestSimpleAuthorizerHandlerV2 = async (event) => {
  let response = {
    isAuthorized: false,
    context: {},
  };

  if (!API_KEY) {
    const secretValue = await secretsManagerClient.send(new GetSecretValueCommand({ SecretId: API_KEY_SECRET_NAME }));
    API_KEY = secretValue.SecretString;
  }

  if (event.headers?.authorization === API_KEY) {
    console.log('allowed');
    response = {
      isAuthorized: true,
      context: {},
    };
  }

  return response;
};
