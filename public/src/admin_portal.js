//The node to mount on
const mountNode = document.getElementById('content')

const { Form, Input, Button, Typography, Layout, Menu, Skeleton, Table, Tag, Card, Select, message, Spin, Divider } = antd
const { Option } = Select
const { Title, Link } = Typography
const { SolutionOutlined, BookOutlined, CalendarFilled, UserOutlined, MessageOutlined, NotificationOutlined } = icons

const { Sider, Content, Header } = Layout
const { TextArea } = Input

const EMULATOR = window.location.href.includes('localhost')

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001)

class ManageUsersScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            privilegedUsers: [],
            loadingSearch: false,
            searchResult: null
        }

        this.onSearch = this.onSearch.bind(this)
        this.handleRoleUpdate = this.handleRoleUpdate.bind(this)
    }

    componentDidMount() {
        firebase.functions().httpsCallable('listPrivilegedUsers')().then(result => {
            this.setState({
                privilegedUsers: result.data['users'].map(item => { return {...item, key: item.uid}})
            })
        }) 
    }

    onSearch(value, event) {

        if (value == '') return

        this.setState({
            loadingSearch: true
        })

        firebase.functions().httpsCallable('getUserByEmail')({
            email: value
        }).then(result => {

            this.setState({
                loadingSearch: false,
                searchResult: result.data
            })

        }).catch(error => {

            this.setState({
                loadingSearch: false
            })

            message.error(`We Couldn't Find That User`)
        })
        
    }

    handleRoleUpdate(values, option) {
        

        const roles = this.state.searchResult.roles

        let itemsToDo = []

        if (values.includes('admin') && !roles.includes('admin')) {
            itemsToDo.push(firebase.functions().httpsCallable('grantAdminAccess')({ uid: this.state.searchResult.uid }))
        }

        if (values.includes('announcer') && !roles.includes('announcer')) {
            itemsToDo.push(firebase.functions().httpsCallable('grantAnnouncerAccess')({ uid: this.state.searchResult.uid }))
        }

        if (roles.includes('admin') && !values.includes('admin')) {
            itemsToDo.push(firebase.functions().httpsCallable('revokeAdminAccess')({ uid: this.state.searchResult.uid }))
        }

        if (roles.includes('announcer') && !values.includes('announcer')) {
            itemsToDo.push(firebase.functions().httpsCallable('revokeAnnouncerAccess')({ uid: this.state.searchResult.uid }))
        }

        Promise.all(itemsToDo).then( result => {

            this.setState({
                loadingSearch: true
            })
    
            firebase.functions().httpsCallable('getUserByEmail')({
                email: this.state.searchResult.email
            }).then(result => {
    
                this.setState({
                    loadingSearch: false,
                    searchResult: result.data
                })

                message.success('Updated Roles Successfully!')
    
            })

            firebase.functions().httpsCallable('listPrivilegedUsers')().then(result => {
                this.setState({
                    privilegedUsers: result.data['users'].map(item => { return {...item, key: item.uid}})
                })
            }) 

        })

    }

    render() {

        return <div style={{background: '#f0f2f5'}}>
            <Title>Manage Users</Title>
            <div>
                <Title level={3}>Add a New Admin or Announcer</Title>
                <Input.Search allowClear placeholder='Enter an email...' onSearch={this.onSearch} loading={this.state.loadingSearch}/>

                {this.state.searchResult && <div>
                    <Card title={this.state.searchResult.email} style={{margin: 20}}>
                        <Select mode='multiple' placeholder='Add roles...' defaultValue={this.state.searchResult.roles.filter(item => ['admin', 'announcer'].includes(item))} style={{width: 300}} onChange={this.handleRoleUpdate}>

                            <Option key='announcer' value='announcer'>Announcer</Option>
                            <Option key='admin' value='admin'>Admin</Option>

                        </Select>
                    </Card>
                </div>}
            </div>
            <div>
                <Title level={3}>Current Admins and Announcers</Title>
                <Table dataSource={this.state.privilegedUsers} columns={[
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        key: 'email',
                        render: email => {
                            return <Link onClick={event => this.onSearch(email, event)}>{email}</Link>
                        }
                    },
                    {
                        title: 'Roles',
                        dataIndex: 'roles',
                        key: 'roles',
                        render: roles => (
                            <span>
                                { roles.map(role => {
                                    let color = (role == 'admin') ? 'red': 'orange'
                                    return <Tag color={color} key={role}>
                                        {role}
                                    </Tag>
                                }) }
                            </span>)
                    }
                ]}/>
            </div>
        </div>
    }
}

class MessagesDisplay extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        if (this.props.loading) return <Spin style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center' }}/>

        return <div style={{display: 'flex', flexDirection: 'column'}}>
            {this.props.messages.map(item => {

                const toStyle = {
                    background: '#238d95',
                    color: 'white',
                    float: 'right',
                    display: 'flex',
                    alignSelf: 'flex-end',
                    maxWidth: '70%', 
                    padding: 5,
                    paddingLeft: 13,
                    paddingRight: 13,
                    borderRadius: 20,
                    margin: 5
                }

                const fromStyle = {
                    background: '#fff',
                    color: '#000',
                    float: 'left',
                    display: 'flex',
                    alignSlef: 'flex-start',
                    maxWidth: '70%',
                    padding: 5,
                    paddingLeft: 13,
                    paddingRight: 13,
                    borderRadius: 20,
                    margin: 5
                }

                const theStyle = (item.type == 'to') ? toStyle:fromStyle

                return <div className='message-bubble' >
                    <div style={theStyle}>{item.body}</div>
                </div>

            })}
        </div>

    }
}

class ListMessagesScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loadingSearch: false,
            searchResult: null,
            loadingMessages: false,
            messages: []
        }

        this.onSearch = this.onSearch.bind(this)
        this.onStudentSelected = this.onStudentSelected.bind(this)
    }

    onSearch(value, e) {

        if (value == '') return

        this.setState({
            loadingSearch: true
        })

        firebase.functions().httpsCallable('getTutorByEmail')({
            email: value
        }).then(result => {

            this.setState({
                loadingSearch: false,
                searchResult: result.data
            })

        }).catch(error => {
            this.setState({
                loadingSearch: false
            })

            message.error(`We Couldn't Find That User`)
        })

    }

    onStudentSelected(e) {

        const index = e.key

        //Get the student
        const student = this.state.searchResult.students[index]

        this.setState({
            loadingMessages: true
        })

                firebase.functions().httpsCallable('listMessages')({
                    tutorId: this.state.searchResult.id,
                    studentId: student.id
                }).then(result => {

                    this.setState({
                        loadingMessages: false,
                        messages: result.data.messages.map(message => {
                            return {...message, type: (message.to == this.state.searchResult.students[index].phone) ? 'to' : 'from'}
                        })
                    })


                })

    }

    render() {

        return <div>
            <Title>Find a Tutor</Title>
            <div>
                <Input.Search allowClear placeholder='Enter an email...' onSearch={this.onSearch} loading={this.state.loadingSearch}/>
            </div>
            {this.state.searchResult && <div style={{background: '#fff', padding: 20, margin: 10, borderRadius: 10, marginTop: 20}}>
                <Title level={3} style={{marginTop: 10}}>{`${this.state.searchResult.firstname} ${this.state.searchResult.lastname}`}</Title>
                <Divider />
                {this.state.searchResult.students
                    ? <Layout style={{background: '#fff'}}><Sider style={{height: '100%', background: '#fff'}}>
                        <Menu theme='light' onClick={this.onStudentSelected}>
                            {
                                this.state.searchResult.students.map((student, index) => {
                                    return <Menu.Item key={index}>{`${student.firstname} ${student.lastname}`}</Menu.Item>
                                })
                            }
                        </Menu>
                    </Sider>

                    <Layout style={{borderRadius: 10, margin: 5, padding: 10}}>

                        <Content>

                            <MessagesDisplay messages={this.state.messages} loading={this.state.loadingMessages}/>

                        </Content>

                    </Layout></Layout>

                    : 'This tutor has no students'}
            </div>}
        </div>
    }
}

class AnnouncementsScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loadingFormSubmit: false
        }

        //Bind form submit
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onFormSubmit(values) {

        //Start loading
        this.setState({
            loadingFormSubmit: true
        })
        
        //Send those values to firebase
        firebase.functions().httpsCallable('sendAnnouncement')(values).then(result => {

            message.success('Announcement Sent!')

            this.setState({
                loadingFormSubmit: false
            })

        }).catch(error => {
            console.log(error)
            message.error('Announcement Failed to Send')
            this.setState({
                loadingFormSubmit: false
            })
        })

    }

    render() {

        return <div>
            <Title>Announcements</Title>

            <div>
                <Title level={3}>Send an Announcement</Title>
                <Form name='announcement-form' onFinish={this.onFormSubmit} layout='vertical'>
                    <Form.Item name='message' label='Message' rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name='segments' label='Receiving Groups'>
                        <Select mode='multiple' placeholder='Select Groups'>
                            <Option key='spanish'>Spanish-speaking Families</Option>
                            <Option key='english'>English-speaking Families</Option>
                            <Option key='tutors'>Tutors</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={this.state.loadingFormSubmit}>
                            Send Announcement
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>

    }

}


const tabs = {
    'manage-users': <ManageUsersScreen/>,
    'list-messages': <ListMessagesScreen/>,
    'announcements': <AnnouncementsScreen/>
}

class AdminPortal extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            currentTab: 'manage-users',
            loading: true,
            currentUser: undefined
        }

        this.handleMenuOptionSelected = this.handleMenuOptionSelected.bind(this)
    }

    handleMenuOptionSelected(e) {

        this.setState({
            currentTab: e.key
        })

    }

    componentDidMount() {

        FIREBASE_RUN_ON_READY.push((user) => {

            firebase.functions().httpsCallable('getUserRoles')().then(userRecord => {

                this.state.currentUser = userRecord.data

                this.setState({
                    loading: false
                })
            
            }).catch(error => {
                console.error(error)

                this.setState({
                    loading: false
                })

            })

        })

    }

    render() {
        if (this.state.loading) return <Skeleton active />
        return <Layout>
            <Header style={{ background: '#fff', padding: 10, height: 100, boxShadow: '0px 3px 3px #ddd', zIndex: 10, position: 'fixed', width: '100%' }}><img src='https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng' width='180px' style={{ margin: 10 }}/></Header>
            <Layout>
                <Sider theme='light' style={{
                    overflow: 'auto',
                    height: '100vh',
                    left: 0,
                    marginTop: 100
                }} collapsible>
                    {this.state.currentUser &&
                    <Menu mode='inline' onClick={this.handleMenuOptionSelected} defaultSelectedKeys={[this.state.currentTab]}>
                        { this.state.currentUser.roles.includes('admin') && <Menu.Item icon={<UserOutlined/>} key='manage-users'>Manage Users</Menu.Item>}
                        { this.state.currentUser.roles.includes('admin') && <Menu.Item icon={<MessageOutlined/>} key='list-messages'>View Messages</Menu.Item>}
                        {(this.state.currentUser.roles.includes('announcer') || this.state.currentUser.roles.includes('admin')) && <Menu.Item icon={<NotificationOutlined/>} key='announcements'>Announcements</Menu.Item>}
                    </Menu>}
                    
                </Sider>

                <Layout style={{marginTop: 100, background: '#f0f2f5', minHeight: '100vh'}}>

                    <Content style={{margin: 20, background: '#f0f2f5'}}>
                        { tabs[this.state.currentTab] }
                    </Content>

                </Layout>
            </Layout>
        </Layout>
    }
}


ReactDOM.render(<AdminPortal />, mountNode)