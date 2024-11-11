import { MetamaskProvider } from "@/hooks/useMetamask";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MetamaskProvider>
            <Component {...pageProps} />
        </MetamaskProvider>
    );
}
