import React, { ReactElement } from 'react'
import styles from './styles.module.scss'
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

interface Props {
    setshowVideo: Function;
}

function VideoContainer({ setshowVideo }: Props): ReactElement {
    const { t, ready, i18n } = useTranslation(['common']);
    const [videoURL, setvideoURL] = React.useState(`${process.env.CDN_URL}/landing-vid/planet/en-intro-web-planet.mp4`)
    const [isUploading, setisUploading] = React.useState(false)
    const handleVideoClose = () => {
        setshowVideo(false);
        setisUploading(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('hidePreview', true)
        }
    }

    React.useEffect(() => {
        const screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            switch (localStorage.getItem('language')) {
                case 'de': setvideoURL(`${process.env.CDN_URL}/landing-vid/planet/en-intro-mobile-planet.mp4`); break;
                case 'en': setvideoURL(`${process.env.CDN_URL}/landing-vid/planet/en-intro-mobile-planet.mp4`); break;
                default: setvideoURL(`${process.env.CDN_URL}/landing-vid/planet/en-intro-mobile-planet.mp4`);
            }
        } else {
            switch (localStorage.getItem('language')) {
                case 'de': setvideoURL(`${process.env.CDN_URL}/landing-vid/planet/en-intro-web-planet.mp4`); break;
                case 'en': setvideoURL(`${process.env.CDN_URL}/landing-vid/planet/en-intro-web-planet.mp4`); break;
                default: setvideoURL(`${process.env.CDN_URL}/landing-vid/planet/en-intro-web-planet.mp4`);
            }
        }
    }, [])
    return ready ? (
        <div className={styles.landingVideoSection}>
            <div className={styles.landingVideoWrapper}>
                <video preload={"metadata"} muted autoPlay playsInline onEnded={() => handleVideoClose()}>
                    <source src={videoURL} type="video/mp4" />
                </video>
            </div>
            <button id="skipLandingVideo" className={styles.landingVideoSkipButton} onClick={() => handleVideoClose()}>
                {isUploading ? <div className={styles.spinner}></div> : t('common:skipIntroVideo')}
            </button>
        </div>
    ) : (<></>)
}

export default VideoContainer
