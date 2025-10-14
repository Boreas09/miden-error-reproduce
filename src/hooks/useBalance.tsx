import { type AccountId, WebClient } from '@demox-labs/miden-sdk';
import { useEffect, useState } from 'react';

interface BalanceParams {
    readonly accountId?: AccountId;
    readonly faucetId?: AccountId;
    client?: WebClient;
}

const getBalanceFromClient = async (
    client: WebClient,
    accountId: AccountId,
    faucetId: AccountId,
) => {
    const acc = await client.getAccount(accountId);
    const balance = acc?.vault().getBalance(faucetId);
    return balance;
};

export const useBalance = (
    { accountId, faucetId, client }: BalanceParams,
) => {
    const [balance, setBalance] = useState<bigint | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const refreshBalance = async () => {
            if (!accountId || !faucetId || !client || isRefreshing) return;

            setIsRefreshing(true);
            try {
                // await client.syncState();
                const newBalance = await getBalanceFromClient(client, accountId, faucetId);
                setBalance(BigInt(newBalance ?? 0));
            } finally {
                setIsRefreshing(false);
            }
        };

        refreshBalance();
        const clear = setInterval(refreshBalance, 10000);
        return () => clearInterval(clear);
    }, [client, faucetId, accountId, isRefreshing]);

    return balance;
};