const { Layout, Avatar, Typography, Tabs, Steps, Popover, Skeleton } = antd
const { Step } = Steps
const { Title, Link } = Typography
const { TabPane } = Tabs
const { HomeOutlined, SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined, CommentOutlined, UserOutlined, QuestionCircleOutlined } = icons;
const { Sider, Content, Footer } = Layout

class SidebarItem extends React.Component {
    constructor(props) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick() {

        if (!this.props.disabled && !this.props.complete) {
            this.props.onClick(this.props.keyId)
        }

    }

    render() {
        return <div onClick={this.handleOnClick} className={`${this.props.active ? 'active ':''}${this.props.disabled || this.props.complete ? 'disabled ':''}${this.props.isStep ? 'step ':''}${this.props.isSubItem ? 'subitem ':''}${this.props.isMainItem ? 'main-item ':''}${this.props.complete ? 'complete ':''}`}>{this.props.icon && this.props.icon} {this.props.children}</div>
    }
}

class Empty extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div></div>
    }
}

class UserItem extends React.Component {

    constructor(props) {
        super(props)

        this.onSignOut = this.onSignOut.bind(this)
    }

    onSignOut() {

        SIGN_OUT_FIREBASE()

    }

    render() {

        return <div>

            <p><Link>Change Email</Link></p>
            <p><Link onClick={this.onSignOut}>Log Out</Link></p>

        </div>

    }

}

class SidebarLayout extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            tutor: {},
            loadingUser: true
            // userData: {}
            // currentStep: 0,
            // loading: true,
            // error: false,
            // hasScheduledChat: false,
            // hasCompletedWaiver: false,
            // hasCompletedWorkbook: false,
            // hasCompletedLiveScan: false,
            // hasCompletedLiveTraining: false

        }

        this.state.sidebarItems = this.props.sidebarItems
        this.state.pages = this.props.pages
        this.state.currentTab = this.props.currentTab

        this.onSideBarItemClicked = this.onSideBarItemClicked.bind(this)
        this.onUserFinishedLoading = this.onUserFinishedLoading.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.onSideBarLogoClicked = this.onSideBarLogoClicked.bind(this)

    }

    onSideBarItemClicked(key) {

        const sidebarItems = this.state.sidebarItems

        // highlights side navigation item that is the current tab
        for (let i = 0; i < sidebarItems.length; i++) {
            if (sidebarItems[i]['keyId'] == key) {
                sidebarItems[i]['active'] = true
                if (sidebarItems[i].subItems) {
                    sidebarItems[i].subItems.map(item => item.active = false)}
            } else sidebarItems[i]['active'] = false

            if (sidebarItems[i].subItems && sidebarItems[i]['active'] === false) {
                for (let x = 0; x < sidebarItems[i].subItems.length; x++) {
                    if (sidebarItems[i].subItems[x]['keyId'] == key) {
                        sidebarItems[i].subItems[x]['active'] = true
                        sidebarItems[i]['active'] = false
                    } else sidebarItems[i].subItems[x]['active'] = false
                }
            }
        }

        this.setState({ currentTab: key, sidebarItems: sidebarItems })

    }

    onUserFinishedLoading(user) {

        this.setState({
            loadingUser: false,
            tutor: user
        })

    }

    // setUserLocalStorage(user) {
    //     let firstname = user.data.user['First Name'];
    //     let lastname = user.data.user['Last Name'];
    //     let email = user.data.user['Email'];
    //     window.localStorage.setItem('userEmail', email);
    //     window.localStorage.setItem('userFirstName', firstname);
    //     window.localStorage.setItem('userLastName', lastname);
    // }

    // receiveUser(user) {
    //     console.log({ user });
    //     let currentStep = 0 //changed from 0 to 1 for testing

    //     // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Application Accepted') currentStep = 1
    //     // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Ready to Tutor') currentStep = 2
    //     // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Matched') currentStep = 4

    //     //Update the state with the received data
    //     this.setState({
    //         loading: false,
    //         userData: user.data.user,
    //         currentStep: currentStep
    //     })

    // }

    // setUserProgress(user) {
    //     let scheduledChat = false;
    //     let completedWaiver = false;
    //     let completedWorkbook = false;
    //     let completedLiveScan = false;
    //     let completedLiveTraining = false;


    //     if ('Interview Date' in user.data['user']) {
    //         scheduledChat = notNull(user.data['user']['Interview Date'])
    //     }
    //     if ('Waiver?' in user.data['user']) {
    //         completedWaiver = notNull(user.data['user']['Waiver?'])
    //     }
    //     if ('Section 2' in user.data['user']) {
    //         completedWorkbook = notNull(user.data['user']['Section 2'])
    //     }
    //     if ('Live Scan?' in user.data['user']) {
    //         completedLiveScan = notNull(user.data['user']['Live Scan?'])
    //     }
    //     if ('Live Training?' in user.data['user']) {
    //         completedLiveTraining = notNull(user.data['user']['Live Training?'])
    //     }

    //     this.setState({
    //         hasScheduledChat: scheduledChat,
    //         hasCompletedWaiver: completedWaiver,
    //         hasCompletedWorkbook: completedWorkbook,
    //         hasCompletedLiveScan: completedLiveScan,
    //         hasCompletedLiveTraining: completedLiveTraining
    //     })

    // }

    loadUser() {

        firebase.functions().httpsCallable('getTutor')().then(tutorResult => {
            console.log('tutorResult here first', tutorResult);
            this.onUserFinishedLoading(tutorResult.data)
            console.log('2nd result', tutorResult);
            // firebase.functions().httpsCallable('getTutorData')()
            //     .then(tutorDetailedResult => {
            //         this.receiveUser(tutorDetailedResult)
            //         this.setUserLocalStorage(tutorDetailedResult)
            //         this.setUserProgress(tutorDetailedResult)
            //     }
            //     )
            //     .catch(error => { console.log(error) }
            //     )



        }).catch(error => {
            console.log(error)
            //TODO

        })

    }

    onSideBarLogoClicked() {
        this.setState({ currentTab: 'home' }) //make active to change font color & add pointer
    }

    componentDidMount() {

        FIREBASE_RUN_ON_READY.push((user) => {
            this.loadUser()
        })

    }

    render() {

        const CurrentPage = this.state.pages[this.state.currentTab] || Empty

        return <Layout style={{ height: '100%' }} className='desktop-dashboard'>

            <Sider theme='light' className='dashboard-sidebar' breakpoint='sm' width='240'>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>

                    <div className='sidebar-header' onClick={this.onSideBarLogoClicked} >
                        <img width={180} src='https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng'/>
                    </div>

                    <div className='sidebar-options'>

                        { this.state.sidebarItems.map(item => {

                            return <div>

                            <SidebarItem isMainItem keyId={item.keyId} icon={item.icon} active={item.active} disabled={item.disabled} onClick={this.onSideBarItemClicked}>{item.title}</SidebarItem>

                            {item.isSteps && <Steps direction='vertical' className='subitem'>

                                {item.subItems && item.subItems.map(subItem => {

                                    return <Step status={subItem.complete ? 'finish':undefined} title={<SidebarItem complete={subItem.complete} isStep keyId={subItem.keyId} icon={subItem.icon} active={subItem.active} disabled={subItem.disabled} onClick={this.onSideBarItemClicked}>{subItem.title}</SidebarItem>}/>

                                })}

                            </Steps>}

                            {!item.isSteps && <div>
                                {item.subItems && item.subItems.map(subItem => {
                                    return <SidebarItem isSubItem keyId={subItem.keyId} icon={subItem.icon} active={subItem.active} disabled={subItem.disabled} onClick={this.onSideBarItemClicked}>{subItem.title}</SidebarItem>
                                })}
                            </div>}

                            </div>

                        })}



                    </div>

                    <div className='sidebar-spacer' style={{ flex: 1 }}></div>

                    <div className='sidebar-footer' style={{ marginBottom: 50 }}>

                        {!this.state.loadingUser && <Popover content={<UserItem />} title='User Options' trigger='click'><span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} className='hoverable'><Avatar size='large' icon={<UserOutlined />}/>{this.state.tutor.firstname + ' ' + this.state.tutor.lastname}</span></Popover>}

                    </div>

                </div>

            </Sider>
            <Layout>

                <Layout style={{backgroundColor: 'white'}}>
                    <Content className='content-container'>
                        <div className='main-content'>
                            {this.state.loadingUser && <Skeleton active/>}
                            {!this.state.loadingUser && <CurrentPage tutor={this.state.tutor} tutorDetails={this.props.userData}
                                currentStep={this.props.currentStep} isLoadingUser={this.state.loadingUser} error={this.props.error} />}
                        </div>
                    </Content>
                </Layout>

                { window.matchMedia('screen and (max-width: 500px)').matches && <Footer style={{backgroundColor: 'white'}}>

                    <Tabs>
                        <TabPane tab='Dashboard'>

                        </TabPane>
                    </Tabs>

                </Footer>}

            </Layout>

        </Layout>

    }

}
