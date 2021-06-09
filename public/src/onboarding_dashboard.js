//The node to mount on
const mountNode = document.getElementById('content')

const { Layout, Avatar, Typography, Tabs } = antd
const { Title } = Typography
const { TabPane } = Tabs
const { HomeOutlined, SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined, CommentOutlined, UserOutlined } = icons;
const { Sider, Content, Footer } = Layout

const EMULATOR = window.location.href.includes('localhost')

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001)

class OnboardingPortal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            tutor: {}

        }

    }

    render() {

        return <Layout style={{ height: '100%' }} className='desktop-dashboard'>

            <Sider theme='light' class='dashboard-sidebar' breakpoint='sm' collapsedWidth='0' collapsible>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    
                    <div class='sidebar-header'>
                        <img width={180} src='https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng'/>
                    </div>

                    <div class='sidebar-options'>
                        
                        <div class='active'><HomeOutlined /> Dashboard</div>
                        <div><CommentOutlined />Chat Signup</div>
                        <div><SolutionOutlined />Waiver</div>
                        <div><BookOutlined />Workbook</div>
                        <div class='disabled'><SecurityScanOutlined />Background Check</div>
                        <div class='disabled'><RocketOutlined />Live Training</div>

                    </div>

                    <div class='sidebar-spacer' style={{ flex: 1 }}></div>

                    <div class='sidebar-footer' style={{ marginBottom: 50 }}>
                        
                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}><Avatar size='large' icon={<UserOutlined />}/>{this.state.tutor.firstName + ' ' + this.state.tutor.lastName}</span>

                    </div>

                </div>

            </Sider>
            <Layout>
                
                <Layout style={{backgroundColor: 'white'}}>
                    <Content className='main-content'>



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

ReactDOM.render(<OnboardingPortal />, mountNode)