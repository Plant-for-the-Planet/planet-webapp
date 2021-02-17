import { Modal } from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import DonationsPopup from '../../../features/donations'
import { ThemeContext } from '../../../theme/themeContext'
import { getRequest } from '../../../utils/apiRequests/api'
import getStoredCurrency from '../../../utils/countryCurrency/getStoredCurrency'
import FeaturesSection from './components/FeaturesSection'
import LandingSection from './components/LandingSection'
import Objective from './components/Objective'
import styles from './styles/sateins.module.scss'

interface Props {
    tenantScore: any
}

function Home({ tenantScore }: Props): ReactElement {
    const router = useRouter()
    const projectID = 'yucatan-reforestation';

    const LandingSectionData = {
        mainTitleSubText: 'EIN EURO = EIN BAUM',
        para: <span>Gemeinsam mit den Zuschauer*innen möchte der Sender SAT.1 rekordverdächtig viele Bäume pflanzen. Schon ein Euro genügt, um den neuen Wald auf der mexikanischen Halbinsel Yucatán wachsen zu lassen.</span>,
        imagePath: '/tenants/sateins/images/alhambra.jpg'
    }

    const FeaturesSectionData = {
        featureText: <div>
            <h2>Das Projekt: Jeder Euro ist ein Baum mehr</h2>
            <p>Für jeden gespendeten Euro im Rahmen der "SAT.1 Waldrekord-Woche" wird ein Baum gepflanzt. Aktionspartner Plant-for-the-Planet sorgt dafür, dass auf einer festgelegten Fläche auf der mexikanischen HalbinselYucatán im Bundesland Campeche der "SAT.1-Wald" gepflanzt wird und pflegt die gespendeten Bäume, bis sie groß genug sind, um selbst weiterzuwachsen. Die Spender*innen können das Wachstum ihrer Bäume auf der "Plant-for-the-Planet App" verfolgen – oder die Pflanzung persönlich zu besuchen. Außerdem haben sie die Chance, einen XXX in unserer Verlosung zu gewinnen.</p>
        </div>
    }

    const [project, setProject] = React.useState(null)
    React.useEffect(() => {
        async function loadProject() {
            let currencyCode = getStoredCurrency();
            const project = await getRequest(`/app/projects/${projectID}?_scope=extended&currency=${currencyCode}`);
            setProject(project);
        }
        if (projectID) {
            loadProject();
        }
    }, [projectID]);

    const { theme } = React.useContext(ThemeContext);

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleViewProject = () => {
        if (window !== undefined) {
            router.push('/[p]', `/${project.slug}`, {
                shallow: true,
            });
        }
    }

    return project ? (
        <div className={styles.pageContainer}>
            <Modal
                className={`modal ${theme} modalContainer`}
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableBackdropClick
                hideBackdrop
            >
                <DonationsPopup project={project} onClose={handleClose} />
            </Modal>
            <LandingSection tenantScore={tenantScore} handleViewProject={handleViewProject} handleOpen={handleOpen} LandingSectionData={LandingSectionData} />

            <Objective />
            <FeaturesSection FeaturesSectionData={FeaturesSectionData} />
        </div>
    ) : <></>
}


export default Home
