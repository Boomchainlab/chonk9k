
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, MINT_SIZE, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, createAccount, getAssociatedTokenAddress } from "@solana/spl-token";

export interface CHONK9KSolana {
  version: "0.1.0";
  name: "chonk9k_solana";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
}

const IDL: CHONK9KSolana = {
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

export { IDL };
