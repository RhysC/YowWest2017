#!/bin/bash

export AWS_PROFILE="yow-west" && export AWS_REGION=ap-southeast-2.

cd myService
serverless deploy --stage dev --region ap-southeast-2
cd ..
