// Solana Token Program IDL
const IDL = {
  version: "0.1.0",
  name: "chonk9k_solana",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
};

module.exports = { IDL };
