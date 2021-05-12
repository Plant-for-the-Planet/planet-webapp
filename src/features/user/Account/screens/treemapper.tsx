import React, { ReactElement } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/TreeMapper.module.scss';
import {
  getAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import TopProgressBar from '../../../common/ContentLoaders/TopProgressBar';
import i18next from '../../../../../i18n';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import PlantLocation from '../components/TreeMapper/PlantLocation';
import dynamic from 'next/dynamic';

const PlantLocationMap = dynamic(() => import('../components/TreeMapper/Map'), {
  loading: () => <p>loading</p>,
});

const { useTranslation } = i18next;

interface Props { }

function TreeMapper({ }: Props): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { t } = useTranslation(['me']);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [plantLocations, setPlantLocations] = React.useState(null);

  React.useEffect(() => {
    async function fetchPaymentHistory() {
      setIsDataLoading(true);
      setProgress(70);
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
        const plantLocations = await getAuthenticatedRequest(
          '/treemapper/plantLocations',
          token
        );
        setPlantLocations(plantLocations);
        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
      } else {
        localStorage.setItem('redirectLink', '/account/treemapper');
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
    if (!isLoading)
      fetchPaymentHistory();
  }, [isLoading, isAuthenticated]);

  return (
    <>
      {progress > 0 && (
        <div className={styles.topLoader}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <div className={styles.accountsPageContainer}>

        <div className={styles.contentContainer}>
          <div className={styles.accountsContainer}>
            {isDataLoading ? (
              <>
                <TransactionListLoader />
                <TransactionListLoader />
                <TransactionListLoader />
              </>
            ) : plantLocations && plantLocations.length === 0 ? (
              <div className={styles.notFound}>
                <TransactionsNotFound />
              </div>
            ) :
              plantLocations && plantLocations.map((location: any, index: number) => {
                console.log(location);

                return (
                  <PlantLocation key={index} location={location} index={index} />
                );
              })
            }
          </div>
          <PlantLocationMap locations={plantLocations} />
        </div>
      </div>

    </>
  );
}

export default TreeMapper;
