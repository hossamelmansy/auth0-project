# auth0-project
Demo React app calling Lambda functions through API Gateway, authenticating using Auth0

A demonstration project on how to integrate Auth0 authentication with AWS API Gateway and Lambda funcions.

A frontend uses React app that uses Auth0 for authentication, and access a Lambda function to get data from it through an AWS API Gateway. The request passes through an authorizer that validates user authentication from Auth0.