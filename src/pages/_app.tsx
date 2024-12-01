import type { AppProps } from "next/app";
import StyledComponentsRegistry from "../lib/registry";
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <StyledComponentsRegistry>
        {/* <Footer/> */}
        <Component {...pageProps} />
      </StyledComponentsRegistry>
  )
}
