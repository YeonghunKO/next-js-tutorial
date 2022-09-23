import '../styles/globals.css';
import LayOut from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <LayOut>
      <Component {...pageProps} />
    </LayOut>
  );
}

export default MyApp;
