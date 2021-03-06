#!/bin/bash

npm run test-server:start

if [[ "$1" != "single" ]]
then
  if [[ $CI == "true" ]]
  then
    npm run webpack-build:ci
  else
    npm run webpack-build
  fi
    
  RESULT=$?

  if [[ RESULT -gt 0 ]]
  then
    exit $RESULT
  fi
fi

npm run test:node:single && npm run test:karma:single
RESULT=$?

npm run test-server:stop

exit $RESULT
