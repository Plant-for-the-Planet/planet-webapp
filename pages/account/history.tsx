import React, { ReactElement } from 'react';
import Footer from '../../src/features/common/Layout/Footer';
import History from '../../src/features/user/Account/screens/history';
import AccountHeader from '../../src/features/common/Layout/Header/accountHeader';
import i18next from '../../i18n';
import styles from '../../src/features/user/Account/styles/AccountNavbar.module.scss';

const { useTranslation } = i18next;

interface Props { }

function AccountHistory({ }: Props): ReactElement {
  const { t } = useTranslation(['me']);
  return (
    <>
      <div className={styles.accountsPage}>
        <AccountHeader page={'history'} pageTitle={t('me:myAccount')} />
        <History />
      </div>

      <Footer />
    </>
  );
}

export default AccountHistory;
