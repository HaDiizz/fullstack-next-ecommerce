import "../styles/globals.css";
import Layouts from "../components/Layouts";
import { DataProvider } from "../store/GlobalState";
import { SSRProvider } from "@react-aria/ssr";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import Head from "next/head";
import { createTheme, NextUIProvider } from "@nextui-org/react";

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primary: "#FF0095",
      primaryLight: "#582A87",
      secondary: "#2D2D2D",
      secondaryDark: "#8c8c8c",
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/ecmIcon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="Dev Ecommerce Web" />
        <meta name="author" content="Dev Ecommerce Web" />
        <meta name="keywords" content="Dev Ecommerce Web" />
      </Head>
<>
</>
      <SSRProvider>
        <DataProvider>
            <Layouts>
          {/* <NextUIProvider theme={darkTheme}> */}
              <Component {...pageProps} />
          {/* </NextUIProvider> */}
            </Layouts>
        </DataProvider>
      </SSRProvider>
    </>
  );
}

export default MyApp;
