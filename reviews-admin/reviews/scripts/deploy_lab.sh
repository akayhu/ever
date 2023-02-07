#!/bin/bash

aws cloudformation deploy --template-file structure.yml\
 --stack-name ${serviceName}\
 --parameter-overrides Image=$IMAGE_URI\
  ServiceName=${serviceName}\
  HealthCheckPath=/index.html\
  EnvType=lab\
  Priority=3\
  ParentType=dev\
  TaskCount=1\
  CpuNum=256\
  MemSize=512\
  WebHostedZoneName=reviews.104-dev.com.tw\

  # WebSubdomain=rs\

# Output to the screen every 9 minutes to prevent a travis timeout
export PID=$!
while [[ `ps -p $PID | tail -n +2` ]]; do
  echo '[LAB] Deploying...'
  sleep 10
done