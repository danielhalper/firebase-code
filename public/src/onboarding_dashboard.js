//The node to mount on
const mountNode = document.getElementById('content')

const EMULATOR = window.location.href.includes('localhost')

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001)

ReactDOM.render(<SidebarLayout pages={{
    'home': Home,
    'waiver': Waiver,
    'chat-signup': ChatSignup,
    'workbook': Workbook,
    'livescan': BackgroundCheck
}} sidebarItems={[
    {
        keyId: 'home',
        icon: <HomeOutlined />,
        title: 'Dashboard',
        active: true,
        disabled: false,
        isSteps: true,
        subItems: [
            {
                keyId: 'chat-signup',
                icon: <CommentOutlined />,
                title: 'Chat Signup',
                active: false,
                disabled: false,
                complete: false
            },
            {
                keyId: 'waiver',
                icon: <SolutionOutlined />,
                title: 'Waiver',
                active: false,
                disabled: false,
                complete: false
            },
            {
                keyId: 'workbook',
                icon: <BookOutlined />,
                title: 'Workbook',
                active: false,
                disabled: false,
                complete: false
            },
            {
                keyId: 'livescan',
                icon: <SecurityScanOutlined />,
                title: 'Background Check',
                active: false,
                disabled: false,  // make active for testing
                complete: false
            },
            {
                keyId: 'live-training',
                icon: <RocketOutlined />,
                title: 'Live Training',
                active: false,
                disabled: true,
                complete: false
            }
        ]
    },
    {
        keyId: 'support',
        icon: <QuestionCircleOutlined />,
        title: 'Support',
        active: false,
        disabled: false,
        subItems: [

            {
                keyId: 'faq',
                title: 'FAQ',
                active: false,
                disabled: false
            },
            {
                keyId: 'tutor-resources',
                title: 'Tutor Resources',
                active: false,
                disabled: false
            },
            {
                keyId: 'office-hours',
                title: 'Sign up for office hours',
                active: false,
                disabled: false
            },
            {
                keyId: 'contact',
                title: 'Contact Laura',
                active: false,
                disabled: false
            },

        ]
    }
]} currentTab='livescan'/>, mountNode) // changed to livescan for testing
