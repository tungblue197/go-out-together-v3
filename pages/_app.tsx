import "../styles/globals.css";
import 'react-notifications-component/dist/theme.css'
import ReactNotification from 'react-notifications-component'
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "react-query";
import Loading from "components/loading/Loading";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <>
      <Loading />
      <ReactNotification />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
export default MyApp;
