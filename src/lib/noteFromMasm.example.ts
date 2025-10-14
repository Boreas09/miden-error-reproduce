import {
    AccountId,
    Felt,
    FeltArray,
    FungibleAsset,
    Note,
    NoteAssets,
    NoteExecutionHint,
    NoteInputs,
    NoteMetadata,
    NoteRecipient,
    NoteTag,
    NoteType,
    OutputNote,
    OutputNotesArray,
    TransactionRequestBuilder,
    WebClient,
    Word,
} from '@demox-labs/miden-sdk';
import {
    CustomTransaction,
    type MidenTransaction,
    TransactionType,
} from '@demox-labs/miden-wallet-adapter';
import { accountIdToBech32 } from './midenClient';

export interface NoteFromMasmParams {
    client: WebClient;
    senderAccountId: AccountId;
    faucedId: AccountId;
    amount: bigint
    requestTransaction: (tx: MidenTransaction) => Promise<string>;
}

function generateRandomSerialNumber(): Word {
    return Word.newFromFelts([
        new Felt(BigInt(Math.floor(Math.random() * 0x1_0000_0000))),
        new Felt(BigInt(Math.floor(Math.random() * 0x1_0000_0000))),
        new Felt(BigInt(Math.floor(Math.random() * 0x1_0000_0000))),
        new Felt(BigInt(Math.floor(Math.random() * 0x1_0000_0000))),
    ]);
}


// THIS IS AN EXAMPLE FUNCTION TO HOW TO USE A MASM NOTE TO CREATE AND SEND A NOTE.
// THIS WONT GOING TO WORK AS INTENTED WITHOUT A PROPER NOTE SCRIPT AND THE RIGHT ASSETS.
// EXAMPLE NOTE SCRIPT IS GETTING INPUT AS ID.SUFFIX AND ID.PREFIX
// IT IS SENDING TX TO SELF
// YOU NEED TO ADJUST IT TO YOUR NEEDS

/**
 * Example function for note transactions using a MASM script
 *
 * @param client - WebClient instance from useMidenClient hook
 * @param senderAccountId - The connected wallet's account ID (from useWallet hook)
 * @param faucetId - The faucet account ID to source tokens from (defaults to Miden testnet faucet)
 * @param amount - Amount of tokens to transfer (in base units, e.g., BigInt(50))
 * @param requestTransaction - Function to request transaction signing from the miden-wallet-adapter
 * @returns Transaction ID and Note ID string that can be used to view on MidenScan
 * @throws {Error} If transfer fails
 */
export async function noteFromMasm({
    client,
    senderAccountId,
    faucedId,
    amount,
    requestTransaction,
}: NoteFromMasmParams): Promise<{ txId: string; noteId: string }> {
    try {
        console.log("Creating note from MASM...");

        // Sync state to get latest blockchain data
        await client.syncState();

        // Create a new serial number for the note
        const serialNumber = generateRandomSerialNumber();

        // Compile note script
        const script = client.compileNoteScript(`insert_note_script`);
        const noteType = NoteType.Public


        // assets will be miden name that our contracts created or will be created
        const assets = new FungibleAsset(faucedId, amount);
        const noteAssets = new NoteAssets([assets]);
        const noteTag = NoteTag.fromAccountId(faucedId);

        const noteMetadata = new NoteMetadata(
            senderAccountId,
            noteType,
            noteTag,
            NoteExecutionHint.always(),
            new Felt(BigInt(0))
        )

        // Set a deadline for the note to be valid until (optional)
        // const deadline = Date.now() + 120_000 // 2 minutes from now

        // Create note Inputs
        const noteInputs = new NoteInputs(
            new FeltArray([
                senderAccountId.prefix(), //felt
                senderAccountId.suffix()  //felt
            ])
        )

        const note = new Note(
            noteAssets,
            noteMetadata,
            new NoteRecipient(serialNumber, script, noteInputs)
        )

        const noteId = note.id().toString()

        let transactionRequest = new TransactionRequestBuilder()
            .withOwnOutputNotes(new OutputNotesArray([OutputNote.full(note)]))
            .build();

        const tx = new CustomTransaction(
            accountIdToBech32(senderAccountId), // from
            accountIdToBech32(senderAccountId), // to
            transactionRequest,
            [],
            [],
        );

        const txId = await requestTransaction({ type: TransactionType.Custom, payload: tx });

        return { txId, noteId };
    } catch (error) {
        console.error("Note transaction failed:", error);
        throw new Error("Note transaction failed");
    }
}