const { Layout, Avatar, Typography, Tabs, Steps, Popover, Skeleton, Timeline } = antd
const { Step } = Steps
const { Title, Link } = Typography
const { TabPane } = Tabs
const { HomeOutlined, SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined, CommentOutlined, UserOutlined, QuestionCircleOutlined, CheckCircleFilled, LoadingOutlined } = icons;
const { Sider, Content, Footer } = Layout

class SidebarItem extends React.Component {
    constructor(props) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick() {
        if (this.props.link) {
            window.open(this.props.link, '_blank')
            return
        }

        if (this.props.button) {
            this.props.onClick()
            return
        }

        if (!this.props.disabled) {

            if (!this.props.active) {
                // window.location.hash = '#' + this.props.keyId
            }

            this.props.onClick(this.props.keyId)

        }

    }

    render() {
        return ( <div id={this.props.keyId} onFocus={this.handleOnClick} onClick={this.handleOnClick}
        className={`${this.props.active ? 'active ':''}${this.props.disabled ? 'disabled ':''}
        ${this.props.isStep ? 'step ':''}${this.props.isSubItem ? 'subitem ':''}${this.props.isMainItem ? 'main-item ':''}
        ${this.props.complete ? 'complete ' : ''}`}>{this.props.icon && this.props.icon} {this.props.children}{this.props.active ? <span className="active-item-marker">&#8226;</span> : null}</div>)
    }
}

class SidebarSupportItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.onClick) {
            return <div onClick={this.props.onClick} className={`${this.props.isStep ? 'step ' : ''}${this.props.isSubItem ? 'subitem ' : ''}${this.props.isMainItem ? 'main-item ' : ''}`} >
                {this.props.children}
            </div>
        }

        return (<Link href={this.props.link} target='_blank'>
            <div className={`${this.props.isStep ? 'step ' : ''}${this.props.isSubItem ? 'subitem ' : ''}
                ${this.props.isMainItem ? 'main-item ' : ''}`} >
                {this.props.children}</div> </Link> )
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

            <p><Link onClick={this.onSignOut}>Log Out</Link></p>

        </div>

    }

}

class SidebarLayout extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            tutor: {}
        }

        this.state.sidebarItems = this.props.sidebarItems
        this.state.pages = this.props.pages
        this.state.currentTab = this.props.currentTab
        this.state.error = this.props.error

        this.onSideBarItemClicked = this.onSideBarItemClicked.bind(this)

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

            if (sidebarItems[0].subItems && sidebarItems[0]['active'] === false) {
                for (let x = 0; x < sidebarItems[0].subItems.length; x++) {
                    if (sidebarItems[0].subItems[x]['keyId'] == key) {
                        sidebarItems[0].subItems[x]['active'] = true
                        sidebarItems[0]['active'] = false
                    } else sidebarItems[0].subItems[x]['active'] = false
                }
            }
        }

        this.setState({ currentTab: key, sidebarItems: sidebarItems })

    }

    componentDidMount() {

        try {
            const element = document.querySelector(window.location.hash)
            if (element) element.click()
        } catch(err) {

        }

        this.listenForAnchorChanges()

    }

    listenForAnchorChanges() {
        window.onhashchange = (e) => {
            try {
                const element = document.querySelector(window.location.hash)
                if (element) element.click()
            } catch(err) {

            }
        }
    }

    findFirstOpenPage() {
        for (let item in this.state.sidebarItems) {
            if (this.state.sidebarItems[item].disabled) continue
            return this.state.sidebarItems[item].keyId
        }

        return this.state.sidebarItems[0]
    }

    getCurrentSidebarItem() {
        for (let item in this.state.sidebarItems) {
            if (this.state.sidebarItems[item].keyId == this.state.currentTab) return this.state.sidebarItems[item]
            if (!this.state.sidebarItems[item].subItems) continue
            for (let j in this.state.sidebarItems[item].subItems) {
                if (this.state.sidebarItems[item].subItems[j].keyId == this.state.currentTab) return this.state.sidebarItems[item].subItems[j]
            }
        }
        return {}
    }



    render() {

        let CurrentPage = this.state.pages[this.state.currentTab] || Empty

        if (this.getCurrentSidebarItem().disabled) CurrentPage = this.state.pages[ this.findFirstOpenPage() ] || Empty

        return <Layout style={{ height: '100%' }} className='desktop-dashboard'>

            <Sider theme='light' className='dashboard-sidebar' breakpoint='sm' collapsedWidth="0" width='240' zeroWidthTriggerStyle={{ top: 0 }}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>

                    <div className='sidebar-header hoverable' onClick={() => this.onSideBarItemClicked('home')} >
                        <img width={180} src='https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng'/>
                    </div>

                    <div className='sidebar-options'>

                        { this.state.sidebarItems.map(item => {

                            return <div>

                            <SidebarItem isMainItem keyId={item.keyId} icon={item.icon} active={item.active} disabled={item.disabled} onClick={this.onSideBarItemClicked}>{item.title}</SidebarItem>

                                {/* Will render this on sidebar when user info loading */}
                                {this.props.loading && <LoadingOutlined style={{ display: 'flex', justifyContent: 'center', margin: '20% 0'}} />}

                                {/* Sidebar For Onboarding Portal (checklist pages) */}
                                {!this.props.loading && item.isSteps && <Timeline className='subitem'>
                                    {item.subItems && item.subItems.map(subItem => {
                                        if (this.props.error) subItem.disabled = true
                                        return <Timeline.Item className="step" color={subItem.disabled ? 'gray' : '#1BCBD9'} dot={subItem.complete ? <CheckCircleFilled /> : ''}> <SidebarItem complete={subItem.complete} isStep keyId={subItem.keyId} icon={subItem.icon} active={subItem.active} disabled={subItem.disabled} onClick={this.onSideBarItemClicked}>{subItem.title}</SidebarItem> </Timeline.Item>
                                    })}
                                </Timeline>}

                                {/* Sidebar For Tutor Portal */}
                                {!this.props.loading && !item.isSteps && !item.isSupport && <div>
                                    {item.subItems && item.subItems.map(subItem => {
                                        return <SidebarItem isSubItem keyId={subItem.keyId} link={subItem.link} icon={subItem.icon} active={subItem.active} disabled={subItem.disabled} onClick={subItem.onClick || this.onSideBarItemClicked} button={subItem.button}>{subItem.title}</SidebarItem>
                                })}
                                </div>}

                                {/* Sidebar for Support Items */}
                                {!this.props.loading && item.isSupport && <div>
                                    {item.subItems && item.subItems.map(subItem => {
                                        return <SidebarSupportItem isSubItem link={subItem.link} onClick={subItem.onClick} >{subItem.title}</SidebarSupportItem>
                                    })}
                                </div>}

                            </div>

                        })}



                    </div>

                    <div className='sidebar-spacer' style={{ flex: 1 }}></div>

                    <div className='sidebar-footer' style={{ marginBottom: 50 }}>

                        { this.props.error && <Button type='primary' onClick={SIGN_OUT_FIREBASE}>Log Out</Button>}
                        {(!this.props.loading && !this.props.error) && <Popover content={<UserItem />} title='User Options' trigger='click'><span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} className='hoverable'><Avatar size='large' icon={<UserOutlined />}/>{this.props.userData.firstname + ' ' + this.props.userData.lastname}</span></Popover>}

                    </div>

                </div>

            </Sider>
            <Layout>

                <Layout style={{backgroundColor: 'white', height: '100%'}}>
                    <Content className={this.state.currentTab === 'support' ? 'support-content-container' : 'content-container'}>
                        <div className={this.state.currentTab === 'support' ? 'support-main-content' : 'main-content'}>

                            {/* Will render this view when page is loading */}
                            {this.props.loading && <LoadingScreen/>}

                            {/* Will render this view for Tutor Portal */}
                            {!this.props.loading && !this.props.progress && <CurrentPage tutor={this.props.userData} sidebarItems={this.props.sidebarItems} />}

                            {/* Will render this view for Onboarding Portal */}
                            {!this.props.loading && this.props.progress && <CurrentPage tutor={this.state.tutor} tutorDetails={this.props.userData}
                                currentStep={this.props.currentStep} isLoadingUser={this.props.loading} error={this.props.error}
                                progress={this.props.progress} onSideBarItemClicked={this.onSideBarItemClicked} workbookForms={this.props.workbookForms}
                                sidebarItems={this.props.sidebarItems} />}
                        </div>
                    </Content>
                </Layout>

            </Layout>

        </Layout>

    }

}
