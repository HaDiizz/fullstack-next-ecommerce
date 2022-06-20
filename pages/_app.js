import "../styles/globals.css";
import Layouts from "../components/Layouts";
import { DataProvider } from "../store/GlobalState";
import { SSRProvider } from "@react-aria/ssr";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SSRProvider>
        <DataProvider>
            <Layouts >
              <Component {...pageProps} />
            </Layouts>
        </DataProvider>
      </SSRProvider>
    </>
  );
}

export default MyApp;
