//The node to mount on
var mountNode = document.getElementById('content');

var EMULATOR = window.location.href.includes('localhost');

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001);

ReactDOM.render(React.createElement(SidebarLayout, { pages: {
        'home': Home,
        'waiver': Waiver,
        'chat-signup': ChatSignup,
        'workbook': Workbook,
        'livescan': BackgroundCheck,
        'live-training': LiveTraining
    }, sidebarItems: [{
        keyId: 'home',
        icon: React.createElement(HomeOutlined, null),
        title: 'Dashboard',
        active: true,
        disabled: false,
        isSteps: true,
        subItems: [{
            keyId: 'chat-signup',
            icon: React.createElement(CommentOutlined, null),
            title: 'Chat Signup',
            active: false,
            disabled: false,
            complete: false
        }, {
            keyId: 'waiver',
            icon: React.createElement(SolutionOutlined, null),
            title: 'Waiver',
            active: false,
            disabled: true, // changed to true
            complete: false
        }, {
            keyId: 'workbook',
            icon: React.createElement(BookOutlined, null),
            title: 'Workbook',
            active: false,
            disabled: true, // chagned to true
            complete: false
        }, {
            keyId: 'livescan',
            icon: React.createElement(SecurityScanOutlined, null),
            title: 'Background Check',
            active: false,
            disabled: true, // make 'false' for testing
            complete: false
        }, {
            keyId: 'live-training',
            icon: React.createElement(RocketOutlined, null),
            title: 'Live Training',
            active: false,
            disabled: true, // make 'false' for testing
            complete: false
        }]
    }, {
        keyId: 'support',
        icon: React.createElement(QuestionCircleOutlined, null),
        title: 'Support',
        active: false,
        disabled: false,
        subItems: [{
            keyId: 'faq',
            title: 'FAQ',
            active: false,
            disabled: false
        }, {
            keyId: 'tutor-resources',
            title: 'Tutor Resources',
            active: false,
            disabled: false
        }, {
            keyId: 'office-hours',
            title: 'Sign up for office hours',
            active: false,
            disabled: false
        }, {
            keyId: 'contact',
            title: 'Contact Laura',
            active: false,
            disabled: false
        }]
    }], currentTab: 'home' }), mountNode);