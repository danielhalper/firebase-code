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
            student: this.props.tutor.students[0],
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

    retrieveZoomLinks() {
        /*currentStudentZoomLinks = this.props.getZoom(this.state.student['id'])
        if (currentStudentZoomLinks) {
            this.setState({
                zoomLinks: currentStudentZoomLinks,
                modals: this.props.modals
            })
        }*/
        console.log("****************8")
        console.log(this.props)
        this.props.getZoom(this.state.student['id'])
        /*this.setState({
            modals: this.props.modals
        })*/
    }

    displayModal(id) {
        console.log("displaymodal")
        let modalsCopy = this.state.modals

        modalsCopy[id] = true

        this.setState({
            modals: modalsCopy
        })
        this.retrieveZoomLinks()
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
        console.log("in tutor home")
        console.log(this.props)
        console.log(this.props.modals.zoom)
        let infoBarItems = [
            {
                label:"Total Sessions",
                id:"total_sessions",
                type: "number",
                value: this.state.student.totalSessions || 0,
            },
            {
                label:"Minutes Tutored",
                id:"minutes_tutored",
                type: "number",
                value: this.state.student.minutesTutored || 0,
            }
        ]

        if (this.state.student.lastSession) infoBarItems.push({
            label:"Last Session",
            id:"last_session",
            type: "string",
            value: new Date(this.state.student.lastSession.replace(/-/g, '\/')).toLocaleDateString(),
        })

        return <div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent: "center", alignItems:"center"}}>
            <h1 className="title">Tutor Dashboard</h1>
            <div style={{ marginBottom: 0 }}>
            <StudentWidget students = {this.props.tutor.students} onTabChange={(activeKey) => {
                this.setState( { student:this.students[activeKey], zoomLinks: undefined } )
            }}/>
            </div>
            { this.state.student &&
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
                    this.displayModal('zoom')
                }} icon={<VideoCameraOutlined/>} title='Start Zoom Meeting'>
                    Meet with your student face-to-face over Zoom.
                </RequiredItem>
                <RequiredItem link={"https://stepuptutoring.softr.app/"} newTab icon={<UnorderedListOutlined/>} title='Weekly Resources'>
                    Your weekly session guide, customized to your student's needs
                </RequiredItem>
            </div>
            <div style={{float:"left",color:"#5A5A5A",borderBottom: "solid #5A5A5A 3px", width: "800px", textAlign:"center", fontSize:"20px", marginBottom:10}}><strong>Weekly Action Items</strong></div>
            <div style={{display:"flex", flexDirection:"row", flex:1}}>
                <RequiredItem onClick={() => this.displayModal('weekly-form')} icon={<FormOutlined/>} title='Weekly Form'>
                    Fill this out each week... so the student's teacher and parent are up-to-date.
                </RequiredItem>

                <RequiredItem id='weekly-announcements' onClick={() => this.displayModal('announcements')} icon={<SoundOutlined/>} title='Weekly Announcements'>
                </RequiredItem>
                <RequiredItem link='https://www.stepuptutoring.org/tutor-events' newTab icon={<CalendarOutlined/>} title='Events & Gamification' onClick={() => {
                    /*firebase.analytics().logEvent('check_events')*/
                    this.props.log_event('check_events')
                }}>
                    You should check this page at least once a week to update your student!
                </RequiredItem>
            </div>
            <div className="modal-container">

                <Modal title='Weekly Form' display={this.state.modals['weekly-form']} options={{ submit: false }} onClose={() => this.onModalClose('weekly-form')}>
                    <iframe class="airtable-embed" src="https://airtable.com/embed/shrNNQzXOJOP7WtEm?backgroundColor=yellow" frameBorder="0" onmousewheel="" width="100%" height="533" style={{ background: 'transparent', border: '0px' }}></iframe>
                </Modal>
                <Modal title="Weekly Announcements" display = {this.state.modals.announcements} options={{submit:false}} onClose = {() => this.onModalClose('announcements')}>
                    { !this.state.announcements && <LoadingScreen /> }
                    { this.state.announcements && <AnnouncementView data={this.state.announcements} /> }
                </Modal>
            </div>
        </div>
    }
}
