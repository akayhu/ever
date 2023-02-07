#!/bin/bash

aws cloudformation deploy --template-file structure.yml\
 --stack-name ${serviceName}\
 --parameter-overrides Image=$IMAGE_URI\
  ServiceName=${serviceName}\
  HealthCheckPath=/index.html\
  EnvType=production\
  Priority=3\
  ParentType=prod\
  TaskCount=2\
  CpuNum=256\
  MemSize=512\
  WebHostedZoneName=reviews.104.com.tw\

# Output to the screen every 9 minutes to prevent a travis timeout
export PID=$!
while [[ `ps -p $PID | tail -n +2` ]]; do
  echo '[Production] Deploying...'
  sleep 10
done