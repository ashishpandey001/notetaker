

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