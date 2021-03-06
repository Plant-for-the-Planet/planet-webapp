import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';
import '../src/features/projects/styles/MapPopup.scss';
import '../src/theme/global.scss';
import './../src/features/projects/styles/Projects.scss';
import './../src/features/common/Layout/Navbar/Navbar.scss';
import ThemeProvider from '../src/theme/themeContext';
import i18next from '../i18n';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import Layout from '../src/features/common/Layout';
import MapLayout from '../src/features/projects/components/ProjectsMap';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import { browserNotCompatible } from '../src/utils/browsercheck';
import BrowserNotSupported from '../src/features/common/ErrorComponents/BrowserNotSupported';
import ProjectPropsProvider, {
  ProjectPropsContext,
} from '../src/features/common/Layout/ProjectPropsContext';
import UserPropsProvider from '../src/features/common/Layout/UserPropsContext';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig();
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename?.replace(distDir, 'app:///_next');
          return frame;
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // from https://gist.github.com/pioug/b006c983538538066ea871d299d8e8bc,
    // also see https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
    ignoreErrors: [
      /^No error$/,
      /__show__deepen/,
      /_avast_submit/,
      /Access is denied/,
      /anonymous function: captureException/,
      /Blocked a frame with origin/,
      /console is not defined/,
      /cordova/,
      /DataCloneError/,
      /Error: AccessDeny/,
      /event is not defined/,
      /feedConf/,
      /ibFindAllVideos/,
      /myGloFrameList/,
      /SecurityError/,
      /MyIPhoneApp/,
      /snapchat.com/,
      /vid_mate_check is not defined/,
      /win\.document\.body/,
      /window\._sharedData\.entry_data/,
      /ztePageScrollModule/,
    ],
    denyUrls: [],
  });
}

const onRedirectCallback = (appState: any) => {
  // Use Next.js's Router.replace method to replace the url
  if (appState) Router.replace(appState?.returnTo || '/');
};

export default function PlanetWeb({ Component, pageProps, err }: any) {
  const router = useRouter();
  const [isMap, setIsMap] = React.useState(false);
  const [currencyCode, setCurrencyCode] = React.useState('');
  const [browserCompatible, setBrowserCompatible] = React.useState(false);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  if (process.env.VERCEL_URL && typeof window !== 'undefined') {
    if (process.env.VERCEL_URL !== window.location.hostname) {
      router.replace(`https://${process.env.VERCEL_URL}`);
    }
  }

  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    storeConfig();
  }, []);
  React.useEffect(() => {
    i18next.initPromise.then(() => setInitialized(true));
  }, []);

  React.useEffect(() => {
    if (router.pathname === '/' || router.pathname === '/[p]') {
      setIsMap(true);
    } else {
      setIsMap(false);
    }
  }, [router]);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  React.useEffect(() => {
    setBrowserCompatible(browserNotCompatible());
  }, []);

  const ProjectProps = {
    pageProps,
    initialized,
    currencyCode,
    setCurrencyCode,
  };

  const { project, projects } = React.useContext(ProjectPropsContext);

  if (browserCompatible) {
    return <BrowserNotSupported />;
  } else {
    return (
      <Auth0Provider
        domain={process.env.AUTH0_CUSTOM_DOMAIN}
        clientId={process.env.AUTH0_CLIENT_ID}
        redirectUri={process.env.NEXTAUTH_URL}
        audience={'urn:plant-for-the-planet'}
        cacheLocation={'localstorage'}
        onRedirectCallback={onRedirectCallback}
      >
        <ThemeProvider>
          <CssBaseline />
          <UserPropsProvider>
          <Layout>
            <ProjectPropsProvider>
              {isMap ? (
                project ? (
                  <MapLayout />
                ) : projects ? (
                  <MapLayout />
                ) : null
              ) : null}
              <Component {...ProjectProps} />
            </ProjectPropsProvider>
          </Layout>
          </UserPropsProvider>
        </ThemeProvider>
      </Auth0Provider>
    );
  }
}
