#!/bin/bash

aws cloudformation deploy --template-file structure.yml\
 --stack-name ${serviceName}\
 --parameter-overrides Image=$IMAGE_URI\
  ServiceName=${serviceName}\
  HealthCheckPath=/index.html\
  EnvType=staging\
  Priority=3\
  ParentType=stag\
  TaskCount=1\
  CpuNum=256\
  MemSize=512\
  WebHostedZoneName=reviews.104-staging.com.tw\

# Output to the screen every 9 minutes to prevent a travis timeout
export PID=$!
while [[ `ps -p $PID | tail -n +2` ]]; do
  echo '[Staging] Deploying...'
  sleep 10
done