const { CloseOutlined, CommentOutlined, VideoCameraOutlined, UnorderedListOutlined, FormOutlined, SoundOutlined, CalendarOutlined } = icons
const { Timeline, Typography, message } = antd
const { Title } = Typography


class Modal extends React.Component {
    constructor(props) {
        super(props)
        /*console.log("he")
        console.log(props)*/
    }
    render() {
        if(this.props.display){
            return <div className = "overlay">
                <div className = "modal">

                    <div className="modal-header" style={{display:"flex", flexDirection:"row", marginBottom:10}}>
                        <div style={{width:40}}></div>

                        <div style={{flex:1}}></div>

                        <h1 className = "modal-title">{this.props.title}</h1>

                        <div style={{flex:1}}></div>

                        <button className="modal-exit" onClick={this.props.onClose}><CloseOutlined></CloseOutlined></button>
                    </div>

                    <div className="modal-content" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                        {this.props.children}
                    </div>
                    <div className="modal-footer" style={{display:"flex", flexDirection:"row"}}>
                        {this.props.options.submit && <button className="modal-submit">{this.props.options.submit||"Submit"}</button>}
                    </div>

                </div>
            </div>
        }
        return <div></div>
    }
}

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
        currentStudentZoomLinks = this.props.getZoom(this.state.student['id'])
        if (currentStudentZoomLinks) {
            this.setState({
                zoomLinks: currentStudentZoomLinks
            })
        }
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

    render() {
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
                <Modal title="Start Zoom Meeting" display = {this.state.modals.zoom} options={{submit:false}} onClose = {() => this.onModalClose('zoom')}>
                    { !this.state.zoomLinks && <LoadingScreen /> }

                    { this.state.zoomLinks && <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{width: '70%', margin: '0px 0px 20px 0px' }}>
                            This is your dedicated zoom link with student
                            {' ' + this.state.student['firstname'] + ' ' + this.state.student['lastname']}.
                            It is important that all your sessions with your student take place on this
                            link or we will not be able to accurately track your session attendance.
                            Be sure to copy it below and send it to them via messages!
                        </div>
                        <a href={ this.state.zoomLinks['start_url'] } target='_blank' className="modal-submit" style={{marginBottom:10}}>Start Meeting</a>
                        <div style={{ position: 'relative', width: '70%', height: 40 }}>
                            <div className="zoom-invite-link" style={{position: 'absolute', width: '100%'}}>
                                Meeting Link: { this.state.zoomLinks['join_url'] }
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', width: '100%'  }} className='copy-link-gradient'>
                                <div style={{flex: 1}}></div>
                                <button className="copy-link" onClick={()=>this.copyLink(this.state.zoomLinks['join_url'], 1)}>Copy</button>
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

                </Modal>

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
