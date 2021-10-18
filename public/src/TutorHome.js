const { CloseOutlined, CommentOutlined, VideoCameraOutlined, UnorderedListOutlined, FormOutlined, SoundOutlined, CalendarOutlined } = icons
const { Timeline, Typography, message } = antd
const { Title } = Typography

class TutorHome extends React.Component {
    constructor(props) {
        super(props)
        /*console.log("anothr")
        console.log(props)*/
        this.students = {}
        this.state = {
            zoomLinks: undefined,
            modals: {
                'zoom': false,
                'weekly-form': false,
                'announcements': false
            },
            announcements: this.props.tutor.weeklyAnnouncements
        }

        for (let i = 0;i < this.props.tutor.students.length;i++) {

            this.students[ this.props.tutor.students[i].id ] = this.props.tutor.students[i]

        }

    }

    displayModal(id) {
        let modalsCopy = this.state.modals

        modalsCopy[id] = true

        this.setState({
            modals: modalsCopy
        })
    }

    onModalClose(id){
        let modalsCopy = this.state.modals

        modalsCopy[id] = false

        let stateObject = {
            modals: modalsCopy
        }

        if (id == 'zoom') stateObject['zoomLinks'] = undefined

        this.setState(stateObject)
    }

    render() {
        let infoBarItems = [
            {
                label:"Total Sessions",
                id:"total_sessions",
                type: "number",
                value: this.props.currentStudent.totalSessions || 0,
            },
            {
                label:"Minutes Tutored",
                id:"minutes_tutored",
                type: "number",
                value: this.props.currentStudent.minutesTutored || 0,
            }
        ]

        if (this.props.currentStudent.lastSession) infoBarItems.push({
            label:"Last Session",
            id:"last_session",
            type: "string",
            value: new Date(this.props.currentStudent.lastSession.replace(/-/g, '\/')).toLocaleDateString(),
        })

        return <div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent: "center", alignItems:"center"}}>
            <h1 className="title">Tutor Dashboard</h1>
            <div style={{ marginBottom: 0 }}>
            <StudentWidget students = {this.props.tutor.students} onTabChange={(activeKey) => {
                this.props.onCurrentStudentChanged(this.students[activeKey])
            }}/>
            </div>
            { this.props.currentStudent &&
            <div style={{display:"flex", flexDirection:"row", flex:1, marginBottom:10}}>
                <div style={{flex:1}}></div>
                <InformationBar info={infoBarItems}/>
                    <div style={{flex:1}}></div>
            </div> }
            <div style={{display:"flex", flexDirection:"row", flex:1, marginBottom:10}}>
                <RequiredItem link={"#messaging"} icon={<CommentOutlined/>} title='Message Family'>
                    Communicate with your student's guardian through our online messaging application.
                </RequiredItem>
                <RequiredItem id='start-zoom' onClick={() => {
                    /*firebase.analytics().logEvent('started_zoom_call')
                    this.displayModal('zoom')*/
                    this.props.log_event('started_zoom_call')
                    this.props.openModal('zoom')
                }} icon={<VideoCameraOutlined/>} title='Start Zoom Meeting'>
                    Meet with your student face-to-face over Zoom.
                </RequiredItem>
                <RequiredItem link={"https://stepuptutoring.softr.app/"} newTab icon={<UnorderedListOutlined/>} title='Weekly Resources'>
                    Your weekly session guide, customized to your student's needs
                </RequiredItem>
            </div>
            <div style={{float:"left",color:"#5A5A5A",borderBottom: "solid #5A5A5A 3px", width: "800px", textAlign:"center", fontSize:"20px", marginBottom:10}}><strong>Weekly Action Items</strong></div>
            <div style={{display:"flex", flexDirection:"row", flex:1}}>
                <RequiredItem onClick={() => this.props.openModal('weeklyForm')} icon={<FormOutlined/>} title='Weekly Form'>
                    Fill this out each week... so the student's teacher and parent are up-to-date.
                </RequiredItem>

                <RequiredItem id='weekly-announcements' onClick={() => this.props.openModal('announcements')} icon={<SoundOutlined/>} title='Weekly Announcements'>
                </RequiredItem>
                <RequiredItem link='https://www.stepuptutoring.org/tutor-events' newTab icon={<CalendarOutlined/>} title='Events & Gamification' onClick={() => {
                    /*firebase.analytics().logEvent('check_events')*/
                    this.props.log_event('check_events')
                }}>
                    You should check this page at least once a week to update your student!
                </RequiredItem>
            </div>
            
        </div>
    }
}
