CHONK9K 🐱🚀

Official repository for $CHONK9K, a community-driven token and NFT ecosystem on Solana.

Overview

CHONK9K is more than just a token—it’s a movement. Built on Solana, it features:
	•	$CHONK9K SPL Token – A utility token for the ecosystem.
	•	NFT Collection – Cybernetic, space-exploring chonky cats with unique traits.
	•	Web3 DApp – A minting and trading platform.

 Repository Structure
 chonk9k/
│── contracts/                # Smart contracts (SPL Token & NFTs)  
│── scripts/                  # Deployment & automation scripts  
│── metadata/                 # Token & NFT metadata  
│── web/                      # Frontend for minting & trading  
│── tests/                    # Smart contract testing  
│── LICENSE  
│── README.md  

Getting Started

1️⃣ Clone the Repository
git clone https://github.com/Boomchainlab/chonk9k.git
cd chonk9k

2️⃣ Install Dependencies

Ensure you have Rust, Solana CLI, and Node.js installed. Then, run:
npm install
cargo build

3️⃣ Deploy CHONK9K Token on Solana
./scripts/deploy_token.sh

4️⃣ Mint an NFT
node scripts/mint_nft.js

Smart Contract Details
	•	Token Mint Address: DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump
	•	Supply: TBD
	•	NFT Metadata Standard: Metaplex

Roadmap 🚀

✅ Deploy CHONK9K Token
✅ Develop NFT Collection
🔜 Launch CHONK9K NFT Marketplace
🔜 Expand Ecosystem Utilities

Contributing

We welcome community contributions! Feel free to open issues and PRs.

License

MIT License.

Deploy

To deploy your project website, you can follow these steps:

* **Set up the environment** 🌐
  - Ensure you have Node.js and npm installed on your machine.
  - Install the necessary dependencies by running `npm install` in the root directory of your project.

* **Build the project** 🛠️
  - Run the build command specified in the `package.json` file: `npm run build`. This will compile the project and prepare it for deployment.

* **Deploy the project** 🚀
  - The deployment process is defined in the GitHub Actions workflow file `.github/workflows/deploy.yaml`. This workflow is triggered on a push to the `main` branch.
  - Ensure you have the necessary secrets set up in your GitHub repository settings, such as `RPC_URL` and `TENDERLY_ACCESS_KEY`.
  - Push your changes to the `main` branch to trigger the deployment workflow.

* **Verify the deployment** ✅
  - Check the GitHub Actions tab in your repository to monitor the deployment process.
  - Once the deployment is complete, verify that your project website is live and functioning as expected.
