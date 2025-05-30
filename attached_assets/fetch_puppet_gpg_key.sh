#!/bin/bash
# Script to fetch the Puppet Security Team GPG key

KEY_ID="8728524FE21D3FC6"
KEYSERVER="hkps://keys.openpgp.org"

echo "Fetching GPG key from $KEYSERVER..."
gpg --keyserver $KEYSERVER --recv-keys $KEY_ID

echo "Verifying key fingerprint..."
gpg --fingerprint $KEY_ID
