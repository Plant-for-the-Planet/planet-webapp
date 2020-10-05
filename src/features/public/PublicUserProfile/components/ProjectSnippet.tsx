import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import getImageUrl from '../../../../utils/getImageURL';
import styles from '../../Donations/styles/Projects.module.scss';
import i18next from '../../../../../i18n';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import getStripe from '../../../../utils/getStripe';
import { ThemeContext } from '../../../../utils/themeContext';
import DonationsPopup from '../../Donations/screens/DonationsPopup';
import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;
interface Props {
  project: any;
  key: number;
}

export default function ProjectSnippet({ project, key }: Props): ReactElement {
  const router = useRouter();
  const { t, i18n } = useTranslation(['donate', 'common', 'country']);
  const { theme } = React.useContext(ThemeContext);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const progressPercentage =
    (project.countPlanted / project.countTarget) * 100 + '%';

  const [
    taxDeductionCountriesArray,
    setTaxDeductionCountriesArray,
  ] = React.useState([]);

  React.useEffect(() => {
    let taxarray = [];
    for (let i = 0; i < project.paymentSetup.taxDeduction.length; i++) {
      const countryCode = getCountryDataBy(
        'countryName',
        project.paymentSetup.taxDeduction[i]
      ).countryCode;
      taxarray.push(countryCode);
    }
    setTaxDeductionCountriesArray(taxarray);
  }, []);
  const projectDetails = {
    id: project.id,
    name: project.name,
    currency: project.currency,
    country: project.country,
    treeCost: project.treeCost,
    taxDeductionCountries: taxDeductionCountriesArray,
    tpo: project.tpoData,
  };

  return (
    <>
      <Modal
        className={styles.modal + ' ' + theme}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <Elements stripe={getStripe()}>
          <DonationsPopup project={projectDetails} onClose={handleClose} />
        </Elements>
      </Modal>
      <div
        // onClick={() => {
        //   router.push(`/?p=${project.slug}`, undefined, {
        //     shallow: true,
        //   });
        // }}
        style={{ marginBottom: '40px' }}
        key={key}
      >
        <div className={styles.projectImage}>
          {project.image && typeof project.image !== 'undefined' ? (
            <div
              className={styles.projectImageFile}
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
                backgroundPosition: 'center',
              }}
            ></div>
          ) : null}

          <div className={styles.projectImageBlock}>
            {/* <div className={styles.projectType}>
                {GetProjectClassification(project.properties.classification)}
              </div> */}

            <div className={styles.projectName}>
              {Sugar.String.truncate(project.name, 54)}
            </div>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressBarHighlight}
            style={{ width: progressPercentage }}
          />
        </div>
        <div className={styles.projectInfo}>
          <div className={styles.projectData}>
            <div className={styles.targetLocation}>
              <div className={styles.target}>
                {Sugar.Number.abbr(Number(project.countPlanted), 1)}{' '}
                {t('common:planted')} •{' '}
                <span style={{ fontWeight: 400 }}>
                  {t('country:' + project.country.toLowerCase())}
                </span>
              </div>
            </div>
            <div className={styles.projectTPOName}>
              {t('common:by')} {project.tpoData.name}
            </div>
          </div>

          {project.allowDonations && (
            <div className={styles.projectCost}>
              {project.treeCost ? (
                <>
                  <div onClick={handleOpen} className={styles.donateButton}>
                    {t('common:donate')}
                  </div>
                  <div className={styles.perTreeCost}>
                    {getFormatedCurrency(
                      i18n.language,
                      project.currency,
                      project.treeCost
                    )}{' '}
                    <span>{t('donate:perTree')}</span>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}