#!/bin/bash
cd /home/kavia/workspace/code-generation/recipevault-57302-41fe5e30/recipevault_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

