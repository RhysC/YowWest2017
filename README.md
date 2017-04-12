# YOW West 2016
Introduction to Serverless - YOW West 2016

It is assumed you have a ~/.aws/credentials file in your local machine that allows access the AWS account you are using. You should create a profile in this credentials file called "yow-west" if you want to follow along. NB this can be a copy of an existing profile.  
eg:  
```
[yow-west]
aws_access_key_id = YOURACCESSKEYHERE
aws_secret_access_key = YOURSECRETACCESSKEYHERE
```  

See the serverless docs for more information.


It is also assumed you have [Vagrant](https://www.vagrantup.com/intro/index.html) on your local machine. This is not necessary however you will need to install globally some resources defined in the Vagrant file if you do not do this. Using a VM means this demo doesn't pollute your local machines global settings :)



# Running the project

In the root of the project spin up the vagrant box:  
```
vagrant up
```

SSH in to the box ``cd`` in to the ``src`` directory and run the create services script:  
```
vagrant ssh

cd src
./1_create_service.sh
```

This will create a service in the folder "myService" with all the serverless defaults.  
Uncomment the Events node and the http child node and rename the path to "hello" i.e.:  
```
events:
  - http:
      path: hello
      method: get
```

You have now defined an HTTP endpoint (AWS [API Gateway](https://aws.amazon.com/api-gateway/)) that will call your handler (AWS [Lambda](https://aws.amazon.com/lambda/)).  
Yup, it was that easy!  
Look at the rest of the file for example settings you can apply including IAM [policies](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html) and [roles](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html) and additional resources that may be required for your service eg [DynamoDB Tables](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html) or [S3 buckets](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html)

Deploy your service:  
```
./2_deploy.sh
```

If you have valid credentials under a profile called "yow-west" you should see the deployment go through. The first deployment may take a minute or so, subsequent deploys do speed up.  

Time to test the endpoint with curl. Copy the url retuned by the previous deploy step and hit it with curl:  
```
curl  https://tkhma8fuwh.execute-api.ap-southeast-2.amazonaws.com/dev/hello
```

You should see a JSON response come back with a message and a bunch of HTTP context.

Yay!! You have a working serverless HTTP endpoint!!!

# Linting and Testing
We would like to make sure our code passes basic coding standards and is correct as per the business rules, so lets add in *ESLint* and a *Mocha* Test to make sure our new Lambda Function says "Hi" to the audience.
Lets run the following:  
```
./3_set_up_for_ci.sh
```

That should have installed the development dependencies defined in our `packages.json` file which should now allows us to see if our code looks correct:  
```
npm run lint
```

and if it functions correctly:  
```
npm test
```

Let quickly correct the linting error in the handler. It should just be double quote issues.  
Re run the lint step and we should no longer have any errors:  
```
npm run lint
```

Looks good!

Now we seem to have an issue that the handler is not correctly greeting our audience, lets fix that.  
In the newly created handler, replace the text:  
"Go Serverless v1.0! Your function executed successfully!"  
with  
"Hello, YOW West!"  

rerun  
```
npm test
```  
and we should be looking good. This is all not really "serverless" so let get back on track...

# Serverless CI!
To keep the source code that is relevant to this demo all together I have put it in the src folder, allowing the ``vagrant``, ``.gitignore`` & ``readme.md`` etc to be in the root. Because of this the lambCI default of calling ``npm install && npm test`` wont work as the ``package.json`` file is not in the root. For this reason i have a ``.lambci.json`` to override the default behaviour and to just run from the src folder instead of root.

To configure LambCI is recommend just reviewing the docs [there](https://github.com/lambci/lambci)

You will need a github access token and slack token to emulate the demo.
