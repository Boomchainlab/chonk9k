FROM alpine:latest

# Update Alpine packages
RUN apk update

# Install required packages
RUN apk add --no-cache curl bash libssl1.1

# Install Solana CLI
RUN curl -sSf https://release.solana.com/v1.11.9/solana-release-x86_64-unknown-linux-gnu.tar.bz2 | tar -xj -C /usr/local/bin

# Verify Solana CLI installation
RUN solana --version

# Set Solana network to Mainnet
RUN solana config set --url https://api.mainnet-beta.solana.com

# Set Solana network to Devnet (for testing)
# RUN solana config set --url https://api.devnet.solana.com

# Configure wallet (replace with actual keypair path)
# RUN solana config set --keypair /path/to/your/keypair.json
