import { useEffect } from "react";
import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import Wallet from "@/components/Wallet";

const HomePage = () => {
    const listen = useListen();
    const { dispatch } = useMetamask();

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected =
                typeof window.ethereum !== "undefined";

            const isMetamaskInstalled =
                ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

            const local = window.localStorage.getItem("metamaskState");

            if (local) {
                listen();
            }

            const { wallet, balance } = local
                ? JSON.parse(local)
                : { wallet: null, balance: null };

            dispatch({
                type: "pageLoaded",
                isMetamaskInstalled,
                wallet,
                balance,
            });
        }
    }, []);
    return (
        <div className="py-10">
            <Wallet>
                <div></div>
            </Wallet>
        </div>
    );
};

export default HomePage;
