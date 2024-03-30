# Prerequisites

To set up an account with AWS, an adminstrative user, and AWS CLI, follow the following tutorial:
https://www.youtube.com/watch?v=CjKhQoYeR4Q&t=938s

If you already have an account and everything is set up, you can start by installing aws-cli and configuring your credentials:
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

**The README assumes you have the prerequisites and aws-cli is configured. If not, follow the tutorials above.**

# Dependencies

For python, you should install boto3 using:
`pip install boto3`

For Typescript, you should install:
`npm install @aws-sdk/client-s3 && npm install papaparse && npm install @types/papaparse && npm install ts-node` Alternatively, you can do
`cd task1 && npm install` assuming the `package.json` file exists.

# How To Run

## Typescript

First of all, make sure that aws-cli is configured with your credentials. In the `typescript` directory, open `index.ts` and change the variables to your needs (i.e. extracted fields, including log ID in output, name of s3 bucket, and output file name). You can either run `npm run test` or `ts-node index.ts` and your output should be in the `Results.txt` file if the variable was not modified.

## Python

First of all, make sure that aws-cli is configured with your credentials. In the `python` directory, open `index.py` and change the variables to your needs (i.e. name of s3 bucket, and output file name). You can run `python3 index.py` and your output should be in the `Results.txt` file if the variable was not modified.
