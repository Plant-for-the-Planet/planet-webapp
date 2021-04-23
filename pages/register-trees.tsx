import React, { ReactElement } from 'react';
import RegisterTrees from '../src/features/user/UserProfile/components/RegisterTrees';
import { getLocalUserInfo } from '../src/utils/auth0/localStorageUtils';
import { useAuth0 } from '@auth0/auth0-react';
import AccountHeader from '../src/features/common/Layout/Header/accountHeader';
import BackButton from '../public/assets/images/icons/BackButton';
import { useRouter } from 'next/router';
import i18next from '../i18n';
interface Props {}
const { useTranslation } = i18next;
export default function Register({}: Props): ReactElement {
  const [currentUserSlug, setCurrentUserSlug] = React.useState();
  const [registerTreesModalOpen, setRegisterTreesModalOpen] = React.useState(
    true
  );

  const [token, setToken] = React.useState('')
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
      getLocalUserInfo() && getLocalUserInfo().slug
        ? setCurrentUserSlug(getLocalUserInfo().slug)
        : null;
    }
    if (isAuthenticated && !isLoading) {
      loadFunction()
    }
  }, [isAuthenticated, isLoading])
  const { t, ready } = useTranslation(['me']);
const router = useRouter();
  return (
   <AccountHeader>
     <button
        id={'backButtonRegTree'}
        style={{
          cursor: 'pointer',
          marginTop: 150,
          marginLeft: 420,
        }}
        onClick={() => {
          router.push(`/t/${currentUserSlug}`, undefined, { shallow: true });
        }}
      >
        <BackButton />
    </button>
    <div style={{display: "flex", justifyContent: "center"}}>
    <h2 style={{
      fontSize: 22,
      color: "#fff",
      zIndex: 1,
      position: 'absolute',
      top: 200,
      left:430,
    }}>
                <b> {t('me:registerTrees')} </b>
              </h2>
      {!isLoading && currentUserSlug ? (
        <RegisterTrees
          registerTreesModalOpen={registerTreesModalOpen}
          slug={currentUserSlug}
          token={token}
        />
      ) : null}
      </div>
      </AccountHeader>
  );
}
