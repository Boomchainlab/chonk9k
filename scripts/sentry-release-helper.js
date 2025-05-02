/**
 * Sentry Release Helper Script
 * 
 * This script provides functions to manage Sentry releases for CHONK9K
 * It implements the CLI steps you provided in a JavaScript format
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration values
const SENTRY_ORG = 'boomchainlab-boomtoknlab-boomt';
const SENTRY_PROJECT = 'javascript-vue';

/**
 * Checks if Sentry CLI is installed
 */
async function checkSentryCLI() {
  try {
    await execAsync('sentry-cli --version');
    console.log('Sentry CLI is already installed');
    return true;
  } catch (error) {
    console.log('Sentry CLI not found, installing...');
    try {
      await execAsync('curl -sL https://sentry.io/get-cli/ | bash');
      console.log('Sentry CLI installed successfully');
      return true;
    } catch (installError) {
      console.error('Failed to install Sentry CLI:', installError.message);
      return false;
    }
  }
}

/**
 * Gets a proposed version for the release
 */
async function proposeVersion() {
  try {
    const { stdout } = await execAsync('sentry-cli releases propose-version');
    return stdout.trim();
  } catch (error) {
    console.error('Error proposing version:', error.message);
    // Fallback to timestamp-based version
    return `chonk9k-release-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  }
}

/**
 * Creates a new Sentry release
 */
async function createRelease(version, authToken) {
  if (!authToken) {
    console.error('No SENTRY_AUTH_TOKEN provided');
    return false;
  }

  try {
    console.log(`Creating Sentry release: ${version}`);
    await execAsync(`SENTRY_AUTH_TOKEN=${authToken} sentry-cli releases new "${version}"`);
    console.log('Release created successfully');
    return true;
  } catch (error) {
    console.error('Error creating release:', error.message);
    return false;
  }
}

/**
 * Associates commits with the release
 */
async function setCommits(version, authToken) {
  try {
    console.log(`Setting commits for release: ${version}`);
    await execAsync(`SENTRY_AUTH_TOKEN=${authToken} sentry-cli releases set-commits "${version}" --auto`);
    console.log('Commits associated successfully');
    return true;
  } catch (error) {
    console.error('Error setting commits:', error.message);
    return false;
  }
}

/**
 * Finalizes the release
 */
async function finalizeRelease(version, authToken) {
  try {
    console.log(`Finalizing release: ${version}`);
    await execAsync(`SENTRY_AUTH_TOKEN=${authToken} sentry-cli releases finalize "${version}"`);
    console.log('Release finalized successfully');
    return true;
  } catch (error) {
    console.error('Error finalizing release:', error.message);
    return false;
  }
}

/**
 * Runs the complete release process
 */
async function runReleaseProcess(authToken) {
  if (!authToken) {
    console.error('Error: SENTRY_AUTH_TOKEN is not provided');
    console.error('Please provide your Sentry authentication token.');
    return false;
  }

  const cliInstalled = await checkSentryCLI();
  if (!cliInstalled) {
    return false;
  }

  const version = await proposeVersion();
  console.log(`Using version: ${version}`);

  const releaseCreated = await createRelease(version, authToken);
  if (!releaseCreated) {
    return false;
  }

  const commitsSet = await setCommits(version, authToken);
  if (!commitsSet) {
    return false;
  }

  const releaseFinalized = await finalizeRelease(version, authToken);
  if (!releaseFinalized) {
    return false;
  }

  console.log('\nSentry release process completed successfully!');
  console.log(`Release version: ${version}`);
  return true;
}

// Export functions to be used in other scripts
export {
  runReleaseProcess,
  proposeVersion,
  createRelease,
  setCommits,
  finalizeRelease
};

// If this script is run directly
if (typeof require !== 'undefined' && require.main === module) {
  const authToken = process.env.SENTRY_AUTH_TOKEN;
  runReleaseProcess(authToken);
}
