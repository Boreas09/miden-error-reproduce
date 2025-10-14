import { AccountId, Address } from "@demox-labs/miden-sdk";

export async function createFaucet(
  senderAccountId: AccountId = Address.fromBech32("mtst1qq2jywv88azv2yp6ynyc7m6nj9cqqedpxzq").accountId(),
  tokenSymbol: string = "REG"
): Promise<{ faucetId: string; txId: string | undefined }> {
  if (typeof window === "undefined") {
    throw new Error("createFaucet() can only run in the browser");
  }

  // Dynamic import → only in the browser, so WASM is loaded client-side
  const {
    AccountStorageMode,
    NoteType,
    WebClient,
  } = await import("@demox-labs/miden-sdk");

  try {
    console.log("🚀 Starting faucet creation and token distribution...");

    // Create a new WebClient instance
    const nodeEndpoint = "https://rpc.testnet.miden.io";
    const client = await WebClient.createClient(nodeEndpoint);
    console.log("✅ Client created, current block:", (await client.syncState()).blockNum());


    // Step 1: Create intermediate wallet
    console.log("Step 1: Creating intermediate wallet...");
    const alice = await client.newWallet(
      AccountStorageMode.public(),
      true
    );
    const aliceId = alice.id();
    console.log("✅ Intermediate wallet ID:", aliceId.toString());

    // Small delay to let WASM state settle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 2: Create faucet
    // console.log("Step 2: Creating faucet...");
    // const faucet = await client.newFaucet(
    //   AccountStorageMode.public(),
    //   false,
    //   tokenSymbol,
    //   8,
    //   BigInt(1000000000000000),
    // );

    const faucetId =
      AccountId.fromHex("0x300d81593c4e7e2054c497c114b9e5");

    console.log("✅ Faucet ID:", faucetId.toString());

    // Let state settle before transactions
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Mint transaction (direct to target account)
    console.log("Step 3: Minting tokens directly to your account...");
    const mintTxRequest = client.newMintTransactionRequest(
      Address.fromBech32("mtst1qq2jywv88azv2yp6ynyc7m6nj9cqqedpxzq").accountId(),      // Mint directly to target account
      faucetId,             // Faucet account
      NoteType.Public,
      BigInt(50000000000),
    );

    const mintTx = await client.newTransaction(faucetId, mintTxRequest);
    await client.submitTransaction(mintTx);
    console.log("✅ Mint transaction submitted");

    console.log("⏳ Waiting for mint transaction confirmation (30s)...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Step 4: Try to get consumable notes
    console.log("Step 4: Looking for consumable notes in your account...");

    let consumableNotes;
    try {
      consumableNotes = await client.getConsumableNotes(senderAccountId);
      console.log(`Found ${consumableNotes.length} consumable note(s)`);
    } catch (error) {
      console.error("Error getting consumable notes:", error);
      throw new Error("Failed to retrieve consumable notes - WASM state conflict");
    }

    // Retry logic
    let retries = 0;
    while (consumableNotes.length === 0 && retries < 3) {
      retries++;
      console.log(`⏳ No notes found, retry ${retries}/3 (waiting 15s)...`);
      await new Promise((resolve) => setTimeout(resolve, 15000));

      try {
        consumableNotes = await client.getConsumableNotes(senderAccountId);
        console.log(`Found ${consumableNotes.length} consumable note(s)`);
      } catch (error) {
        console.error(`Retry ${retries} failed:`, error);
        if (retries === 3) throw error;
      }
    }

    if (consumableNotes.length === 0) {
      console.log("⚠️ No notes found, but faucet was created successfully");
      console.log("You may need to manually consume the notes later");
      return {
        faucetId: faucetId.toString(),
        txId: undefined,
      };
    }

    // Step 5: Consume notes if found
    const noteIds = consumableNotes.map((note) =>
      note.inputNoteRecord().id().toString()
    );
    console.log("Step 5: Consuming note IDs:", noteIds);

    const consumeTxRequest = client.newConsumeTransactionRequest(noteIds);
    const consumeTx = await client.newTransaction(senderAccountId, consumeTxRequest);
    await client.submitTransaction(consumeTx);
    console.log("✅ Consume transaction submitted");

    console.log("🎉 Faucet created and tokens minted successfully!");
    console.log("Faucet ID:", faucetId.toString());

    return { faucetId: faucetId.toString(), txId: undefined };
  } catch (error) {
    console.error("❌ Error in createFaucet:", error);
    throw error;
  }
}
