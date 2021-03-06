import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import styles from './../../styles/Donations.module.scss';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;
interface Props {
  setGiftDetails: Function;
  isGift: Boolean;
  giftDetails: Object;
  setGiftValidated: Function;
}

export default function GiftForm({
  setGiftDetails,
  giftDetails,
  isGift,
  setGiftValidated
}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate', 'common']);

  const defaultDeails = {
    recipientName: giftDetails.recipientName,
    email: giftDetails.email,
    giftMessage: giftDetails.giftMessage
  }

  const { register, errors, getValues, reset } = useForm({ mode: 'all',defaultValues:defaultDeails });

  const changeGiftDetails = (e: any) => {
    const recipientName = getValues("recipientName");
    const email = getValues("email");

    
    setGiftDetails({ ...giftDetails, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    if (isGift) {
      setGiftDetails({ ...giftDetails, type: 'invitation' })
    } else {
      setGiftDetails({ ...giftDetails, type: null })
    }
  }, [isGift])

  React.useEffect(() => {
    const recipientName = getValues("recipientName");
    const email = getValues("email"); 
    if (errors.recipientName || errors.email || !recipientName || !email) {
      setGiftValidated(false)
    }
    else if (recipientName || email) {
      setGiftValidated(true)
    }
  }, [giftDetails])
  return ready ? (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitle}>
          {t('donate:giftRecipient')}
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              name={'recipientName'}
              onChange={changeGiftDetails}
              label={t('donate:recipientName')}
              variant="outlined"
              inputRef={register({ required: true })}
            />
            {errors.recipientName && (
              <span className={styles.formErrors}>
                {t('donate:recipientNameRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              name={'email'}
              onChange={changeGiftDetails}
              label={t('donate:email')}
              variant="outlined"
              inputRef={register({
                required: true,
                pattern: /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
              })}
            />
            {errors.email && (
              <span className={styles.formErrors}>
                {t('donate:emailRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <MaterialTextField
            multiline
            rowsMax="4"
            label={t('donate:giftMessage')}
            variant="outlined"
            name={'giftMessage'}
            onChange={changeGiftDetails}
          />
        </div>
      </div>
    </div>
  ) : <></>;
}
