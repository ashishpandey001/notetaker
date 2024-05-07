import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

type ApiStackProps = cdk.StackProps & {
  table: cdk.aws_dynamodb.TableV2;
};

export class ApiStack extends cdk.Stack {
  noteTakerApi: cdk.aws_apigatewayv2.HttpApi;
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const apiSecret = new cdk.aws_secretsmanager.Secret(this, 'APIKeySecret', {
      generateSecretString: {
        excludePunctuation: true,
      },
    });

    const authFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'AuthFn', {
      entry: 'src/functions/authorizers/lambda-auth.ts',
      handler: 'handler',
      environment: {
        API_KEY_SECRET_NAME: apiSecret.secretName,
      },
    });

    apiSecret.grantRead(authFn);

    const authorizer = new cdk.aws_apigatewayv2_authorizers.HttpLambdaAuthorizer('NoteTakerAuthorizer', authFn, {
      responseTypes: [cdk.aws_apigatewayv2_authorizers.HttpLambdaResponseType.SIMPLE],
      resultsCacheTtl: cdk.Duration.seconds(0),
    });

    this.noteTakerApi = new cdk.aws_apigatewayv2.HttpApi(this, 'NoteTakerApi', {
      defaultAuthorizer: authorizer,
    });

    const listNotesFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'ListNotesFn', {
      entry: 'src/functions/list-notes.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    const listNotesIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('ListNotesIntegration', listNotesFn);

    const getNoteFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'GetNoteFn', {
      entry: 'src/functions/get-note.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    const getNoteIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('GetNoteIntegration', getNoteFn);

    const createNoteFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'CreateNoteFn', {
      entry: 'src/functions/create-note.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    const createNoteIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('CreateNoteIntegration', createNoteFn);

    const updateNoteFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'UpdateNoteFn', {
      entry: 'src/functions/update-note.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    const updateNoteIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('UpdateNoteIntegration', updateNoteFn);

    const deleteNoteFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'DeleteNoteFn', {
      entry: 'src/functions/delete-note.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    const deleteNoteIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration('DeleteNoteIntegration', deleteNoteFn);

    this.noteTakerApi.addRoutes({
      path: '/notes',
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET],
      integration: listNotesIntegration,
    });

    this.noteTakerApi.addRoutes({
      path: '/notes',
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST],
      integration: createNoteIntegration,
    });

    this.noteTakerApi.addRoutes({
      path: '/notes/{noteId}',
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET],
      integration: getNoteIntegration,
    });

    this.noteTakerApi.addRoutes({
      path: '/notes/{noteId}',
      methods: [cdk.aws_apigatewayv2.HttpMethod.PUT],
      integration: updateNoteIntegration,
    });

    this.noteTakerApi.addRoutes({
      path: '/notes/{noteId}',
      methods: [cdk.aws_apigatewayv2.HttpMethod.DELETE],
      integration: deleteNoteIntegration,
    });

    props.table.grantReadWriteData(listNotesFn);
    props.table.grantReadWriteData(createNoteFn);
    props.table.grantReadWriteData(getNoteFn);
    props.table.grantReadWriteData(updateNoteFn);
    props.table.grantReadWriteData(deleteNoteFn);

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.noteTakerApi.url!,
    });

    new cdk.CfnOutput(this, 'ApiKeySecretId', {
      value: apiSecret.secretName,
    });
  }
}
