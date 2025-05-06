const web3 = require("@solana/web3.js");
(async () => {
  const solana = new web3.Connection("https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/bda0096f492c87a8be28bacba0f44ccb313e4f12/");
  console.log("QuickNode Solana Connection Test");
  console.log("Current Slot:", await solana.getSlot());
  console.log("Recent Block Hash:", (await solana.getLatestBlockhash()).blockhash);
  console.log("Transaction Count:", await solana.getTransactionCount());
  console.log("Test token account info:", await solana.getParsedTokenAccountsByOwner(
    new web3.PublicKey("2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy"),
    { programId: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
  ));
})();
