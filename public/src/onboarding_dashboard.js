//The node to mount on
const mountNode = document.getElementById('content')

const { Layout } = antd
const { HomeOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined } = icons;
const { Sider, Content } = Layout

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

        return <Layout style={{ height: '100%' }}>

            <Sider theme='light' style={{ display: 'flex', height: '100%', flexDirection: 'column', position: 'fixed', top: 0, left: 0, width: 150 }}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    
                    <div class='sidebar-header'>
                        <img width={180} src='https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng'/>
                    </div>

                    <div class='sidebar-options'>
                        
                        <div><HomeOutlined /> Dashboard</div>
                        <div>Chat Signup</div>
                        <div>Waiver</div>
                        <div>Background Check</div>
                        <div>Workbook</div>
                        <div>Live Training</div>

                    </div>

                    <div class='sidebar-spacer' style={{ flex: 1 }}></div>

                    <div class='sidebar-footer' style={{ marginBottom: 50 }}>
                        
                        <span>{this.state.tutor.firstName + ' ' + this.state.tutor.lastName}</span>

                    </div>

                </div>

            </Sider>

            <Layout style={{backgroundColor: 'white'}}>
                <Content style={{ backgroundColor: 'rgba(207, 245, 248, 0.67)', borderRadius: 15, margin: 30, marginLeft: 200 }}>



                </Content>
            </Layout>

        </Layout>

    }

}

ReactDOM.render(<OnboardingPortal />, mountNode)