

# This is an AWS CDK Typescript Project

## Get started:

1. Setup aws-cdk cli as listed [here](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_account).

2. configure your IAM profile in `~/.aws/config` as such:
```
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
region = ap-south-1
```
3. bootstrap your environment using `npx cdk bootstrap aws://account/region`, use the account and region as per your profile

Once done, clone this repo and from the repo root run `npx cdk deploy --all`

This will deploy the cloudformation stacks to the appropriate account and region and return an api endpoint that you can interact with.

## Sample endpoint
Here's a [sample endpoint](https://v5lonzrode.execute-api.ap-south-1.amazonaws.com/) where this application is currently active.

## OpenAPI spec for the API
Current spec is [here](https://github.com/ashishpandey001/notetaker/blob/main/notetaker-api.paw.json)

Please reach out for the API key.

## Architecture
The API application is built using AWS services such as API Gateway V2, DynamoDB, Lambda and Secerts Manager.

The implementation follows the least privilege principle and incrementally grants each service the privilege that it needs to perform its role.

Some examples of this are:
- Authorization header is mandatory to invoke any Lambda function via the API route. Without the header, the gateway itself rejects the request and prevents proxying it to the respective Lambda function.
- Each API route is separately proxied to a single Lambda function and can't trigger any other Lambda functions.
- Each Lambda function can access the DynamoDB table for read/write operations only. The iam role available to these Lambda functions can't perform any other DynamoDB control plane operations such as adding/removing indexes, adding/removing replicas, etc.
- Finally, the Authoriztion header check is also separate from all other Lambda Functions and cannot be hijacked due to the other Lambda function's having no access to the secrets manager secret.