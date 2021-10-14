//The node to mount on
const mountNode = document.getElementById('portal');

const { Form, Input, Button, Typography, message } = antd;
const { HomeOutlined, SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined, CommentOutlined, UserOutlined, QuestionCircleOutlined } = icons;
const { Title } = Typography;
const ErrorBoundary = window.Bugsnag ? Bugsnag.use( bugsnag__react(React) ) : ErrorBoundaryDefault

const EMULATOR = window.location.href.includes('localhost')

function OPEN_HEYMARKET() {
    try { HeymarketWidget.Modal.handleFabButtonClicked() } catch(e) {}
}

class TutorApp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            pages: {
                'home': TutorHome,
                'messaging': TutorMessaging,
                'support': SupportPage
            },
            modals: {
                'zoom': {
                    'open': false,
                    'loading': true,
                    'links': undefined
                }
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
                        {
                            keyId: 'start-zoom-sidebar',
                            title: 'Zoom link',
                            icon: <VideoCameraOutlined/>,
                            active: false,
                            disabled: false,
                            onClick: () => {
                                this.retrieveZoomLinks('recM4eCC4BAzx983j')
                                /*const el = document.getElementById('start-zoom')
                                el.click()*/
                            },
                            button: true
                        },
                        {
                            keyId: 'weekly-resources',
                            title: 'Weekly Resources',
                            icon: <UnorderedListOutlined/>,
                            active: false,
                            disabled: false,
                            link: 'https://stepuptutoring.softr.app/'
                        },
                        {
                            keyId: 'weekly-form-sidebar',
                            title: 'Weekly Form',
                            icon: <FormOutlined/>,
                            active: false,
                            disabled: false,
                            link: 'https://airtable.com/shrNNQzXOJOP7WtEm'
                        },
                        {
                            keyId: 'weekly-announcements-sidebar',
                            title: 'Weekly Announcements',
                            icon: <SoundOutlined/>,
                            active: false,
                            disabled: false,
                            onClick: () => {
                                const el = document.getElementById('weekly-announcements')
                                el.click()
                            },
                            button: true
                        },
                        {
                            keyId: 'events-sidebar',
                            title: 'Events and Gamification',
                            icon: <CalendarOutlined/>,
                            active: false,
                            disabled: false,
                            link: 'https://www.stepuptutoring.org/tutor-events'
                        }
                    ]
                },
                {
                    keyId: 'support',
                    icon: <QuestionCircleOutlined />,
                    title: 'Support',
                    active: false,
                    disabled: false,
                    isSupport: true,
                    subItems: [
                        {
                            keyId: 'faq',
                            title: 'FAQ',
                            active: false,
                            disabled: false,
                            link: 'https://docs.google.com/document/d/1Wc2ztcXHTxDC2uZar6RkoayDRr5itrcv05thvoSs1cs/',
                            icon: <QuestionOutlined/>
                          },
                          {
                            keyId: 'tutor-resources',
                            title: 'Tutor Resources',
                            active: false,
                            disabled: false,
                            link: 'https://docs.google.com/document/d/18wWsqnV59P6a47u4i0IeXQIt2POdjAiPHol3r4i-054/edit#heading=h.6esndmj9ohuf',
                            icon: <SnippetsOutlined/>
                          },
                          {
                            keyId: 'office-hours',
                            title: 'Sign Up for Office Hours',
                            active: false,
                            disabled: false,
                            link: 'https://stepuptutoring.as.me/officehours',
                            icon: <ScheduleOutlined/>
                          },
                          {
                            keyId: 'contact',
                            title: 'Contact Us',
                            active: false,
                            disabled: false,
                            onClick: OPEN_HEYMARKET,
                            icon: <MailOutlined/>
                          },
                          {
                              keyId: 'bug',
                              title: 'Report a bug',
                              active: false,
                              disabled: false,
                              link: 'https://docs.google.com/forms/d/1wa1_CNBfNhdFjJt-16b0udO0iOuqLWxPYLHE16004kk/viewform'
                          }
                    ]
                }
            ],
            loading: true,
            current_page: 'home'
        }

        this.retrieveZoomLinks = this.retrieveZoomLinks.bind(this);
        this.update_cp = this.update_cp.bind(this);
        this.on_log_event = this.on_log_event.bind(this);
    }

    retrieveZoomLinks(stu_id) {
        let modalsCopy = this.state.modals
        console.log("in retrieve")
        console.log(modalsCopy)
        modalsCopy.zoom = {
            'open': true,
            'loading': true,
            'links': undefined
        }
        this.setState({current_page: 'home', modals: modalsCopy})
        firebase.functions().httpsCallable('getZoomLinks')().then((result) => {

            const currentStudentZoomLinks = result.data[stu_id] /* this.state.student['id'] */
            /*this.setState({
                zoomLinks: currentStudentZoomLinks
            })*/
            let modalsCopy = this.state.modals
            modalsCopy.zoom = {
                'open': true,
                'loading': false,
                'links': currentStudentZoomLinks
            }
            this.setState({modals: modalsCopy})
            /*this.state.zoom_links = currentStudentZoomLinks*/

        }).catch(error => {

            message.error('Something went wrong. Please try again.')
            firebase.analytics().logEvent('error', {
                type: 'tutorPortal',
                message: `Couldn't fetch zoom links`,
                rawError: error.message
            })
            if (window.Bugsnag) Bugsnag.notify(error)
        })
    }

    update_cp(p) {
        this.setState({current_page: p})
        console.log(p)
        console.log("in update")
        console.log(this.state)
    }

    on_log_event(w) {
        firebase.analytics().logEvent(w)
    }

    copyLink(link, flag){
        var el = document.createElement('textarea');
        el.value = link;
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        if (flag == 1) {message.success('Link Copied!');}
        else {message.success('Meeting ID Copied!');}
    }

    loadUser() {

        firebase.functions().httpsCallable('getTutor')().then(result => {

            const user = result.data

            this.setState({
                user: user,
                loading: false
            })

        }).catch(error => {
            firebase.analytics().logEvent('error', {
                type: 'tutorPortal',
                message: `Could not get tutor`,
                rawError: error.message
            })
            if (window.Bugsnag) Bugsnag.notify(error)
        })

    }

    componentDidMount() {

        FIREBASE_RUN_ON_READY.push((user) => {
            this.loadUser()
        })

    }

    render() {
        /*console.log(this.state.current_page)*/
        return (<div>
            <SidebarLayout pages={this.state.pages}
                           sidebarItems={this.state.sidebarItems}
                           getZoom={this.retrieveZoomLinks}/*{this.retrieveZoomLinks}*/
                           currentTab={this.state.current_page}
                           userData={this.state.user}
                           up_cp={this.update_cp}
                           log_event={this.on_log_event}
                           loading={this.state.loading}
                           modals={this.state.modals}/>

           <Modal title="Start Zoom Meeting" display = {this.state.modals.zoom.open} options={{submit:false}} onClose = {() => this.onModalClose('zoom')}>
               { this.state.modals.zoom.loading && <LoadingScreen /> }

               { !this.state.modals.zoom.loading && <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                   <div style={{width: '70%', margin: '0px 0px 20px 0px' }}>
                       This is your dedicated zoom link with student
                       {' ' + this.state.student['firstname'] + ' ' + this.state.student['lastname']}.
                       It is important that all your sessions with your student take place on this
                       link or we will not be able to accurately track your session attendance.
                       Be sure to copy it below and send it to them via messages!
                   </div>
                   <a href={ this.state.modals.zoom.links['start_url'] } target='_blank' className="modal-submit" style={{marginBottom:10}}>Start Meeting</a>
                   <div style={{ position: 'relative', width: '70%', height: 40 }}>
                       <div className="zoom-invite-link" style={{position: 'absolute', width: '100%'}}>
                           Meeting Link: { this.state.modals.zoom.links['join_url'] }
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', width: '100%'  }} className='copy-link-gradient'>
                           <div style={{flex: 1}}></div>
                           <button className="copy-link" onClick={()=>this.copyLink(this.state.modals.zoom.links['join_url'], 1)}>Copy</button>
                       </div>
                   </div>
                   <div style={{marginBottom: 10}}></div>
                   <div style={{ position: 'relative', width: '70%', height: 40, marginBottom: 30 }}>
                       <div className="zoom-invite-link" style={{position: 'absolute', width: '100%'}}>
                           Meeting ID: {this.props.tutor['zoomLinks'][this.state.student['id']]}
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', width: '100%'  }} className='copy-link-gradient'>
                           <div style={{flex: 1}}></div>
                           <button className="copy-link" onClick={()=>this.copyLink(this.props.tutor['zoomLinks'][this.state.student['id']], 0)}>Copy</button>
                       </div>
                   </div>
               </div> }

           </Modal></div>)

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
