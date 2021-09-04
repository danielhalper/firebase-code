const { Tabs, Spin, Typography, Timeline } = antd
const { LoadingOutlined } = icons
const { TabPane } = Tabs
const { Title } = Typography

//Required item component
class RequiredItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Link id={this.props.id} className='requirement' href={this.props.link} onClick={this.props.onClick} target={this.props.newTab ? '_blank': '_self'}>
            <div style={{float:"left",width:"200px", height:"150px"}}>
            {this.props.icon && this.props.icon} {this.props.title}
                <p className='description'>
                    {this.props.children}
                </p>
            </div>
        </Link>
    }
}
// Information Bar Component
class InformationBar extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const info = this.props.info.map((info) =>
                <div className = "info-item" key={info.id}>
                    <p className="info-label">{info.label}</p>
                    <h1 className="info-value">{info.value}</h1>
                </div>
        )
        return <div className="info-bar">
            {info}
        </div>
    }
}
// Student Widget Component
class StudentWidget extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const students = this.props.students.map((student) =>
            <TabPane key={student.id} tab={student.firstname+" "+student.lastname}></TabPane>
        )

        return <Tabs className='student-tabs' onChange={this.props.onTabChange}>
            {students}
        </Tabs>
    }
}

//Loading Screen
class LoadingScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return <div className='loading-screen'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }}/>}/>
            <p>Loading, please wait</p>
        </div>

    }
}

class AnnouncementView extends React.Component {
    constructor(props){
        super(props)
    }

    render() {

        const elements = this.props.data.map(item => {

            //Get the date
            const dateParts = item['Date'].split('-')
            const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2] - 1)
            const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

            return <Timeline.Item key={item['Title']}>
                <div style={{display:"flex"}}>
                    <Title level={4} style = {{margin:0}}>{item['Title']}</Title>
                    <div style={{flex:1}}></div>
                    <p style={{color:'rgb(150, 150, 150)'}}>{dateString}</p>
                </div>
                <p style={{textAlign:"left"}}>{item['Content']}</p>
            </Timeline.Item>
        })

        return <Timeline style={{width: '100%', height:533, overflowY:'auto', paddingTop: 10}}>
            {elements}
        </Timeline>
    }
}