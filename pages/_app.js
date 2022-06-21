import "../styles/globals.css";
import Layouts from "../components/Layouts";
import { DataProvider } from "../store/GlobalState";
import { SSRProvider } from "@react-aria/ssr";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import Head from "next/head";

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
      <script
        src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossOrigin="anonymous"
        async
      />
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"
        crossOrigin="anonymous"
        async
      />
      <SSRProvider>
        <DataProvider>
          <Layouts>
            <Component {...pageProps} />
          </Layouts>
        </DataProvider>
      </SSRProvider>
    </>
  );
}

export default MyApp;
