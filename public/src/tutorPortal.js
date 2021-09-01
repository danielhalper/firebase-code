//The node to mount on
const mountNode = document.getElementById('portal');

const { Form, Input, Button, Typography, message } = antd;
const { HomeOutlined, SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined, CommentOutlined, UserOutlined, QuestionCircleOutlined } = icons;
const { Title } = Typography;
const ErrorBoundary = Bugsnag.use( bugsnag__react(React) )

const EMULATOR = window.location.href.includes('localhost')

class TutorApp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            pages: {
                'home': TutorHome,
                'messaging': TutorMessaging
            },
            sidebarItems: [
                {
                    keyId: 'home',
                    icon: <HomeOutlined />,
                    title: 'Dashboard',
                    active: true,
                    disabled: false,
                    isSteps: false,
                    subItems: [
                        {
                            keyId: 'messaging',
                            icon: <CommentOutlined />,
                            title: 'Message Family',
                            active: false,
                            disabled: false,
                            complete: false
                        },
                    ]
                }
            ],
            loading: true
        }
    }

    loadUser() {

        firebase.functions().httpsCallable('getTutor')().then(result => {

            const user = result.data

            this.setState({
                user: user,
                loading: false
            })

        }).catch(error => {
            firebase.analytics.logEvent('error', {
                type: 'tutorPortal',
                message: `Could not get tutor`,
                rawError: error.message
            })
            Bugsnag.notify(error)
        })

    }

    componentDidMount() {

        FIREBASE_RUN_ON_READY.push((user) => {
            this.loadUser()
        })

    }

    render() {

        return <SidebarLayout pages={this.state.pages} sidebarItems={this.state.sidebarItems} currentTab='home' userData={this.state.user} loading={this.state.loading}/>

    }

}

class TutorMessaging extends React.Component {
    constructor(props) {
        super(props)


    }

    render() {
        return <div>
            <Title level={1}>Family Messaging</Title>
            <p>You can send SMS messages to your student's guardian on this page or by texting their number from your phone.</p>
            <p>Your messages are automatically translated to the guardian's preferred language (and vice versa), so you don't have to worry about the language barrier.</p>
            <MessagingWidget height={400} tutor={this.props.tutor}/>
        </div>
    }
}

const pages = {
    'home': TutorHome,
    'messaging': TutorMessaging
}

const sidebarItems = [
    {
        keyId: 'home',
        icon: <HomeOutlined />,
        title: 'Dashboard',
        active: true,
        disabled: false,
        isSteps: false,
        subItems: [
            {
                keyId: 'messaging',
                icon: <CommentOutlined />,
                title: 'Message Students',
                active: false,
                disabled: false,
                complete: false
            },
        ]
    },
    {
        keyId: 'support',
        icon: <QuestionCircleOutlined />,
        title: 'Support',
        active: false,
        disabled: false,
        isSteps: false
    }
]

ReactDOM.render(<ErrorBoundary><TutorApp /></ErrorBoundary>, mountNode)