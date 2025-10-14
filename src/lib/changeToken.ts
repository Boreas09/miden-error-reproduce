import REGISTER_LIB from "./notes/miden_id/registry.masm?raw"

export async function changeToken(): Promise<void> {
    if (typeof window === "undefined") {
        console.warn("changeToken() can only run in the browser");
        return;
    }

    // dynamic import → only in the browser, so WASM is loaded client‑side
    const {
        AccountId,
        AssemblerUtils,
        TransactionKernel,
        TransactionRequestBuilder,
        TransactionScript,
        WebClient,
    } = await import("@demox-labs/miden-sdk");

    const nodeEndpoint = "https://rpc.testnet.miden.io";
    const client = await WebClient.createClient(nodeEndpoint);
    console.log("Current block number: ", (await client.syncState()).blockNum());


    // Building the registry contract assembler
    let assembler = TransactionKernel.assembler();

    // Registry contract account id on testnet
    const contractId = AccountId.fromHex("0x3973b471f2101b005c5327803da9aa")

    // Payment token (faucet) account id that will be set
    const paymentTokenId = AccountId.fromHex("0x508ade02b85a6220218f85140adf52")
    const tokenPrefix = paymentTokenId.prefix()
    const tokenSuffix = paymentTokenId.suffix()
    console.log("Payment Token ID:", paymentTokenId.toString())
    console.log("Token Prefix:", tokenPrefix.toString())
    console.log("Token Suffix:", tokenSuffix.toString())

    // Reading the public state of the registry contract from testnet,
    // and importing it into the WebClient
    let registryContractAccount = await client.getAccount(contractId);
    if (!registryContractAccount) {
        await client.importAccountById(contractId);
        await client.syncState();
        registryContractAccount = await client.getAccount(contractId);
        if (!registryContractAccount) {
            throw new Error(`Account not found after import: ${contractId}`);
        }
    }

    // Building the transaction script which will call set_payment_token
    // The MASM procedure expects: [token_prefix, token_suffix] on the stack
    let txScriptCode = `
    use.external_contract::registry_contract
    begin
        # Push token_suffix and token_prefix to the stack
        push.${tokenSuffix.toString()}
        push.${tokenPrefix.toString()}
        # Call the set_payment_token procedure (exported)
        call.registry_contract::set_payment_token
    end
  `;

    // Creating the library to call the registry contract
    let registryComponentLib = AssemblerUtils.createAccountComponentLibrary(
        assembler, // assembler
        "external_contract::registry_contract", // library path to call the contract
        REGISTER_LIB, // account code of the registry contract
    );

    // Creating the transaction script
    let txScript = TransactionScript.compile(
        txScriptCode,
        assembler.withLibrary(registryComponentLib),
    );

    // Creating a transaction request with the transaction script
    let txSetTokenRequest = new TransactionRequestBuilder()
        .withCustomScript(txScript)
        .build();

    // Executing the transaction script against the registry contract
    let txResult = await client.newTransaction(
        registryContractAccount.id(),
        txSetTokenRequest,
    );

    // Submitting the transaction result to the node
    const txId = await client.submitTransaction(txResult);

    // Sync state
    await client.syncState();
    console.log("✅ Payment token set successfully!");
    console.log("Transaction ID:", txId);
    console.log("Token ID:", paymentTokenId.toString());
}
