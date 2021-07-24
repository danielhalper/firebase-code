

class TutorHome extends React.Component {
    constructor(props) {
        super(props)
        this.students = {}
        this.state = {student:this.props.tutor.students[0]}
        for(let i = 0;i < this.props.tutor.students.length;i++){
            this.students[this.props.tutor.students[i].id] = this.props.tutor.students[i]
        }
    }
    render() {
        return <div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent: "center", alignItems:"center"}}>
            <h1 className="title">Tutor Dashboard</h1>
            <div style={{marginBottom:20}}>
            <StudentWidget students = {this.props.tutor.students} onTabChange={(activeKey) => {
                this.setState({student:this.students[activeKey]})
            }}/>
            </div>
            <div style={{display:"flex", flexDirection:"row", flex:1, marginBottom:20}}>
                <div style={{flex:1}}></div>
                <InformationBar info={
                    [
                        {
                            label:"Total Sessions",
                            id:"total_sessions",
                            type: "number",
                            value:7,
                        },
                        {
                            label:"Minutes Tutored",
                            id:"minutes_tutored",
                            type: "number",
                            value:323,
                        },
                        {
                            label:"Last Session",
                            id:"last_session",
                            type: "string",
                            value:"7/1/21",
                        },
                    ]}/>
                    <div style={{flex:1}}></div>
            </div>
            <div style={{display:"flex", flexDirection:"row", flex:1, marginBottom:20}}>
                <RequiredItem link={"undefined"} icon={<SolutionOutlined/>} title='Message Students'>
                    Communicate with your student through texting with our online messaging application.
                </RequiredItem>
                <RequiredItem link={"undefined"} icon={<SolutionOutlined/>} title='Start Zoom Meeting'>
                    Meet with your student face-to-face over Zoom.
                </RequiredItem>
                <RequiredItem link={"undefined"} icon={<SolutionOutlined/>} title='Weekly Resources'>
                </RequiredItem>
            </div>
            <div style={{float:"left",color:"#5A5A5A",borderBottom: "solid #5A5A5A 3px", width: "800px", textAlign:"center", fontSize:"36px", marginBottom:20}}><strong>Weekly Action Items</strong></div>
            <div style={{display:"flex", flexDirection:"row", flex:1}}>
                <RequiredItem link={"undefined"} icon={<SolutionOutlined/>} title='Weekly Form'>
                    Fill this out each week... so the student's teacher and parent are up-to-date.
                </RequiredItem>
                <RequiredItem link={"undefined"} icon={<SolutionOutlined/>} title='Weekly Announcements'>
                </RequiredItem>
                <RequiredItem link={"undefined"} icon={<SolutionOutlined/>} title='Events & Gamification'>
                    You should check this page at least once a week to update your student!
                </RequiredItem>
            </div>
        </div>
    }
}