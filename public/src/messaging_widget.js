const { Select, Layout, Input, Spin, Form, message } = antd
const { Option } = Select
const { Sider, Content, Header } = Layout
const { Search } = Input

//Alter the server host name depending on if we're using the emulator or not
const serverHostname = EMULATOR ? 'http://localhost:5001':'https://us-central1-stepup-dashboard.cloudfunctions.net'
if (EMULATOR) firebase.functions().useEmulator("localhost", 5001)

class MessagesDisplay extends React.Component {

    constructor(props) {
        super(props)

        this.scrollView = React.createRef()
        this.lastScrollPos = 0
    }

    scrollToBottom() {

        //Scroll it to bottom
        this.scrollView.current.scrollTop = this.scrollView.current.scrollHeight

    }

    getScrollPos() {

        if (!this.scrollView.current) return undefined
        return this.scrollView.current.scrollTop

    }

    setScrollPos(pos) {

        if (!this.scrollView.current) return
        this.scrollView.current.scrollTop = pos

    }

    componentDidUpdate() {

        if (this.scrollView.current) this.scrollView.current.scrollTop = this.lastScrollPos

    }

    render() {

        if (this.scrollView.current) this.lastScrollPos = this.scrollView.current.scrollTop

        if (this.props.loading) return <Spin style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', margin: 10 }}/>

        return <div key={Math.random()} style={{display: 'flex', flexDirection: 'column', height: this.props.height, overflowY: 'auto'}} ref={this.scrollView}>
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
                    alignSelf: 'flex-start',
                    maxWidth: '70%',
                    padding: 5,
                    paddingLeft: 13,
                    paddingRight: 13,
                    borderRadius: 20,
                    margin: 5
                }

                const theStyle = (item.type == 'to') ? toStyle:fromStyle

                const labelStyle = {
                    fontSize: 10,
                    color: (item.type == 'to') ? '#238d95':'gray',
                    float: (item.type =='to') ? 'right':'left',
                    display: 'flex',
                    alignSelf: (item.type == 'to') ? 'flex-end':'flex-start',
                    margin: 5
                }

                return <div className='message-bubble' style={{ display: 'flex', flexDirection: 'column' }} key={Math.random()*100}>
                    <div style={theStyle}>{item.body}</div>
                </div>

            })}
        </div>

    }
}

class MessagingWidget extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            isLoadingMessages: false,
            isSendingMessage: false,
            student: null,
            messageValue: ''
        }

        this.messagesDisplay = React.createRef()
        this.input = React.createRef()

        this.poll = undefined
        this.pollTimeout = 2000
        this.currentMessageLength = 0

        this.loadStudentMessages = this.loadStudentMessages.bind(this)
        this.sendMessage = this.sendMessage.bind(this)

    }

    loadStudentMessages(student) {

        //Get the student
        let studentObj = null
        for (let i = 0; i < this.props.tutor.students.length; i++) {
            if (this.props.tutor.students[i].id == student) { studentObj = this.props.tutor.students[i]; break }
        }
        
        this.setState({ isLoadingMessages: true, student: studentObj })

        let isFirstPoll = true

        this.poll = () => {

            setTimeout(() => {
    
                firebase.functions().httpsCallable('getMessagesForStudent')({
                    studentId: student
                }).then(result => {

                    //Get the current scroll position
                    const scrollPos = this.messagesDisplay.current.getScrollPos()

                    //Get the current most recent sent time
                    let mostRecentDateSent
                    if (this.state.messages.length > 0) {
                        mostRecentDateSent = this.state.messages[this.state.messages.length - 1].dateSent
                    }

                    //Reset the poll if the number of messages has changed
                    if (this.currentMessageLength != result.data.messages.length) this.pollInterval = 2000

                    //Now update the number of messages
                    this.currentMessageLength = result.data.messages.length

                    this.setState({ messages: result.data.messages.map(message => {
                        return {...message, type: (message.to == studentObj.phone) ? 'to' : 'from'}
                    }), isLoadingMessages: false})

                    //Get the new most recent sent time
                    let newMostRecentDateSent
                    if (result.data.messages.length > 0) {
                        newMostRecentDateSent = this.state.messages[this.state.messages.length - 1].dateSent
                    }

                    if (isFirstPoll || mostRecentDateSent != newMostRecentDateSent) {

                        //Scroll it to the bottom
                        this.messagesDisplay.current.scrollToBottom()

                        isFirstPoll = false
                    
                    } else {

                        this.messagesDisplay.current.setScrollPos(scrollPos)
                        
                    }

                    //Make it a little longer till the next poll
                    this.pollInterval += 500

                    //Poll again
                    this.poll()
                }).catch(err => {
                    this.poll()
                })

            }, this.pollInterval)

        }

        this.poll()

    }

    getStudentOptions() {

        return this.props.tutor.students.map(student => {

            //Create an option
            return <Option key={student.id} value={student.id}>{`${student.firstname} ${student.lastname}`}</Option>

        })

    }

    sendMessage(value, e) {

        if (this.state.student == null) {
            message.error('Please select a student before sending a message')
            this.setState({ isSendingMessage: false })
            return
        }

        this.setState({ isSendingMessage: true })

        this.messagesDisplay.current.scrollToBottom()

        //Make a request to firebase
        firebase.functions().httpsCallable('sendSMSMessage')({
            message: value,
            phone: this.state.student.proxyNumber
        }).then(result => {

            //Add the result to our messages
            let messages = this.state.messages

            //Reset the polling interval
            this.pollInterval = 2000

            //Update number of messages
            this.currentMessageLength = messages.length
            
            this.setState({ messages: messages, isSendingMessage: false })
            

            //Clear the input
            this.input.current.setState({ value: '' })

            //Scroll it to the bottom
            this.messagesDisplay.current.scrollToBottom()

        })

    }

    componentDidMount() {

    }

    render() {

        return <div>

            <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Select placeholder='Choose a student' loading={this.state.isLoadingStudents} style={{width: 200}} onChange={this.loadStudentMessages}>
                {this.getStudentOptions()}
            </Select>

            {this.state.student != null && <h3 style={{ marginLeft: 15 }}>Phone Number: {(() => {
                const number = libphonenumber.parsePhoneNumber(this.state.student.proxyNumber)
                return number.formatNational()
            })()}</h3>}
            </div>

            <Layout style={{borderRadius: 10, marginTop: 5, padding: 20}}>

                <Content>

                    <MessagesDisplay ref={this.messagesDisplay} messages={this.state.messages} loading={this.state.isLoadingMessages} toName='Me' fromName='You' height={this.props.height} tutor={this.props.tutor}/>

                    <Search ref={this.input} style={{ marginTop: 10, borderTop: 'solid 1px #DDD', paddingTop: 10 }} placeholder='Type your message...' enterButton='Send' loading={this.state.isSendingMessage} onSearch={this.sendMessage}/>

                </Content>

            </Layout>

        </div>

    }

}

