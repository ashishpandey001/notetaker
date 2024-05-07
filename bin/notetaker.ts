#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { DBStack } from '../lib/db-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const dbStack = new DBStack(app, 'DBStack', {
  env: devEnv,
});

new ApiStack(app, 'ApiStack', {
  env: devEnv,
  table: dbStack.noteTakerTable,
});
