#!/bin/bash

# Sentry Release Script
# This script manages Sentry releases for the CHONK9K project

# Setup configuration values
SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" # This will be provided by environment variable
SENTRY_ORG="boomchainlab-boomtoknlab-boomt"
SENTRY_PROJECT="javascript-vue"
VERSION=$(sentry-cli releases propose-version)

echo "Creating Sentry release $VERSION"

# Check if sentry-cli is installed
if ! command -v sentry-cli &> /dev/null; then
    echo "sentry-cli not found, installing..."
    curl -sL https://sentry.io/get-cli/ | bash
fi

# Check if SENTRY_AUTH_TOKEN is set
if [ -z "$SENTRY_AUTH_TOKEN" ]; then
    echo "Error: SENTRY_AUTH_TOKEN environment variable is not set."
    echo "Please set it with your Sentry authentication token."
    exit 1
fi

# Create a new release
echo "Creating new release: $VERSION"
sentry-cli releases new "$VERSION"

# Associate commits with the release
echo "Setting commits for release: $VERSION"
sentry-cli releases set-commits "$VERSION" --auto

# Finalize the release
echo "Finalizing release: $VERSION"
sentry-cli releases finalize "$VERSION"

echo "Sentry release process completed successfully"
