// Contract addresses
export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  BASE: {
    CHONK9K: "0x9c0000b7D00000cH0000nK9000K90000b000se"
  },
  // Solana Mainnet
  SOLANA: {
    CHONK9K: "51ey1T4UCFwb8poVBwyiLwwi1KdNTrZ8rSg7kBRmqray",  // Official mainnet address
    CHONK9K_ALT: [
      "atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ",  // Previous mainnet attempt
      "EkA1RBVFGrHRPxpXB1yfmbX7W3ZB8eF8uipgytLdyBzQ",  // First mainnet attempt
      "GUUFYDkp5KuNieRARo8EoGPhN1yuJFVX3eRfChLMCbav"   // Second mainnet attempt
    ]
  },
  // Ethereum Mainnet
  ETHEREUM: {
    CHONK9K: "0xc9000b7D00C40nK900090009000Ch0nKPu4p"
  }
};

// Token metadata
export const TOKEN_METADATA = {
  CHONK9K: {
    name: "CHONK 9000",
    symbol: "CHONK9K",
    decimals: 9,
    totalSupply: "1000000000",
    website: "https://boomchainlabgravatar.link",
    socials: {
      twitter: "https://twitter.com/chonk9k",
      telegram: "https://t.me/chonk9k",
      discord: "https://discord.gg/chonk9k"
    },
    founder: "David Okeamah",
    launchDate: "May 1, 2023"
  }
};

// Blockchain RPCs
export const RPC_URLS = {
  BASE: "https://mainnet.base.org",
  BASE_TESTNET: "https://sepolia.base.org",
  SOLANA: "https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/bda0096f492c87a8be28bacba0f44ccb313e4f12/", // QuickNode RPC (high performance)
  SOLANA_BACKUP: "https://api.mainnet-beta.solana.com", // Backup RPC
  SOLANA_DEVNET: "https://api.devnet.solana.com"
};
