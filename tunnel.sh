#!/bin/bash

bitcoinhost=$(cat config/default.json | jq -r '.bitcoin.node')
unixnodeuser=$(cat config/default.json | jq -r '.bitcoin.unixnodeuser')
echo tunnelling to ${unixnodeuser}@${bitcoinhost}

ssh -f ${unixnodeuser}@${bitcoinhost} -L 8332:localhost:8332 -N
