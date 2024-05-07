import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DBStack extends cdk.Stack {
  noteTakerTable: cdk.aws_dynamodb.TableV2;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.noteTakerTable = new cdk.aws_dynamodb.TableV2(this, 'NoteTakerTable', {
      partitionKey: { name: 'pk', type: cdk.aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: cdk.aws_dynamodb.AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: {
            name: 'gsi1pk',
            type: cdk.aws_dynamodb.AttributeType.STRING,
          },
          sortKey: {
            name: 'gsi1sk',
            type: cdk.aws_dynamodb.AttributeType.STRING,
          },
        },
      ],
    });
  }
}
