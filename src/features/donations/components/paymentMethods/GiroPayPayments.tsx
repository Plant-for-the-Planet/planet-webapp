import React, { ReactElement } from 'react'
import GiroPayIcon from '../../../../../public/assets/images/icons/donation/GiroPay';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from '../../styles/PaymentDetails.module.scss';
import i18next from './../../../../../i18n';

const { useTranslation } = i18next;

interface Props {
    contactDetails: any;
    onSubmitPayment:Function;
    paymentSetup:any;
}

function GiroPayPayments({ contactDetails,onSubmitPayment,paymentSetup }: Props): ReactElement {
    const { t, i18n, ready } = useTranslation(['donate']);

    return (
        <div className={styles.paymentModeContainer}>
            <div className={styles.paymentModeHeader}>
                <GiroPayIcon />
                <div className={styles.paymentModeTitle}>Giro Pay</div>
            </div>

           
                <div onClick={()=>onSubmitPayment('stripe_giropay','giropay')} className={styles.actionButtonsContainer}>
                    <AnimatedButton className={styles.continueButton}>
                        {t('common:donate')}
                    </AnimatedButton>
                </div>
        
        </div>
    )
}

export default GiroPayPayments
