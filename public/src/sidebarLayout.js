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

        // highlights sidebar item that is the current tab
        for (let i = 0; i < sidebarItems.length; i++) {
            if (sidebarItems[i]['keyId'] == key) {
                sidebarItems[i]['active'] = true
            } else if (sidebarItems[i].subItems) {
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

    loadUser() {

        firebase.functions().httpsCallable('getTutor')().then(result => {

            this.onUserFinishedLoading(result.data)

        }).catch(error => {

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
                            {!this.state.loadingUser && <CurrentPage tutor={this.state.tutor} />}
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
