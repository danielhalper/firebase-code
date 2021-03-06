//Importing Ant components
const { Typography, Steps, Badge, Card, Row, Col, Button, Skeleton } = antd;
const { SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined, CheckOutlined, ReloadOutlined } = icons;
const { Title, Link } = Typography;
const { Step } = Steps;

//Util function
function notNull(value) {
    return value != undefined && value != null && value != NaN
}

//Required item component
class RequiredOBItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        // If item has been completed, show checkmark on requirement box and disable onClick
        if (this.props.requirementCompleted) {
            return (
                <Badge.Ribbon text={<CheckOutlined />} color="#1BCBD9">
                    <div className='requirement inner-req-div completed-requirement' onClick={() => this.props.linkTo(this.props.pageKey)}>
                    <div>
                        {this.props.icon && this.props.icon} {this.props.title}
                        <p className='description'>
                            {this.props.children}
                        </p>
                    </div>
                </div>
                </Badge.Ribbon>
            )
        } else { // If item has not been completed, no checkmark
            return (
                <Link className='requirement inner-req-div' onClick={() => this.props.linkTo(this.props.pageKey)}>
                    <div>
                        {this.props.icon && this.props.icon} {this.props.title}
                        <p className='description'>
                            {this.props.children}
                        </p>
                    </div>
                </Link>
            )
        }
    }
}

//Step 1 Component
class FirstSteps extends React.Component {
    constructor(props) {
        super(props)

        //State
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
    }

    render() {
        let progress = this.props.progress
        let tutorDetails = this.props.tutorDetails
        let interviewDate = '';

        if (notNull(interviewDate)) interviewDate = tutorDetails.interviewDate

        //Show a skeleton when loading
        if (this.state.isLoading) return <Skeleton active />

        //Otherwise show the dashboard items
        return <div className='step'>

            {/* Show when interview has not been scheduled */}
            { !progress.hasScheduledChat && (<div>

                <Title level={3} color='primary'>Chat with Talent Coordinator</Title>

                <p>As soon as you can, we'd like you to schedule an interview with one of our talent coordinators so we can get to know you a little better.</p>

                <Button className='btn' icon={<CalendarFilled />} type='primary' size='large' onClick={() => this.props.onSideBarItemClicked('chat-signup')} >
                    Schedule an Interview
                </Button>

            </div>) }

            {/* Show when interview has been scheduled but not yet passed */}
            {progress.hasScheduledChat && <div>

                <div style={{ marginBottom: 50 }}><Title level={3} color='primary'>We can't wait to see you on <strong><u>{new Date(interviewDate).toLocaleString([], { weekday: 'long', hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric'  })}</u></strong></Title>
                <p>Once you've had your interview, you may complete the disabled steps.</p></div>

                <div>

                    <p>While you're waiting, you can work on these items:</p>

                    <div className='dashboard-required-items'>

                        {<RequiredOBItem requirementCompleted={progress.hasCompletedWaiver} linkTo={this.props.onSideBarItemClicked} pageKey={'waiver'} icon={<SolutionOutlined />} title='Tutor Waiver'>
                            The tutor waiver is the formal, legal agreement between you (volunteer tutor) and Step Up Tutoring.
                        </RequiredOBItem>}

                        {<RequiredOBItem requirementCompleted={progress.hasCompletedAllWorkbook} linkTo={this.props.onSideBarItemClicked} pageKey={'workbook'} icon={<BookOutlined />} title='The Workbook'>
                            The workbook is our self-paced training guide for new tutors. It will provide a foundation for your tutoring sessions.
                        </RequiredOBItem>}

                    </div>
                </div>

            </div>}

        </div>;
    }
}

//Step 2 Component
class SecondSteps extends React.Component {
    constructor(props) {
        super(props)

        //State
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {

    }

    render() {
        let progress = this.props.progress
        let tutorDetails = this.props.tutorDetails
        let liveTrainingDate = '';

        if (notNull(liveTrainingDate)) liveTrainingDate = tutorDetails.liveTrainingDate;

        //Show a skeleton when loading
        if (this.state.isLoading) return <Skeleton active />

        //Otherwise show the dashboard items --> Shows when interview has been passed but other items need to be completed
        return <div className='step'>


            {liveTrainingDate && !tutorDetails.liveTrainingCompleted ?
            <div><Title level={3} color='primary'>Your Live Training Date: <u>{liveTrainingDate}</u></Title> </div>
            : null}


            {progress.hasCompletedWaiver && progress.hasCompletedAllWorkbook && progress.hasCompletedLiveScan && progress.hasCompletedLiveTraining ?
                <div> <Title level={3}>You completed all items!</Title> <p>Our team is hard at work to set you up with a student as soon as possible.</p> </div> :
                <div> <Title level={3}>Thanks for chatting with us!</Title> <p>You???re almost there! Just make sure to complete these items as soon as you are able so you can move on to your student match.</p> </div>}

            <div className='dashboard-required-items'>
                {<RequiredOBItem requirementCompleted={progress.hasCompletedWaiver} linkTo={this.props.onSideBarItemClicked} pageKey={'waiver'} icon={<SolutionOutlined/>} title='Tutor Waiver'>
                    The tutor waiver is the formal, legal agreement between you (volunteer tutor) and Step Up Tutoring.
            </RequiredOBItem> }

                {<RequiredOBItem requirementCompleted={progress.hasCompletedAllWorkbook} linkTo={this.props.onSideBarItemClicked} pageKey={'workbook'} icon={<BookOutlined/>} title='The Workbook'>
                    The workbook is our self-paced training guide for new tutors. It will provide a foundation for your tutoring sessions
            </RequiredOBItem> }

                {<RequiredOBItem requirementCompleted={progress.hasCompletedLiveScan} linkTo={this.props.onSideBarItemClicked} pageKey={'livescan'} icon={<SecurityScanOutlined/>} title='Live Scan'>
                    Live Scan is a mandatory background check completed outside of Step Up, required in order to work with students.
            </RequiredOBItem> }

                {<RequiredOBItem requirementCompleted={progress.hasCompletedLiveTraining} linkTo={this.props.onSideBarItemClicked} pageKey={'live-training'} icon={<RocketOutlined/>} title='Live Training'>
                {/* You will need to complete a live training session with one of our leaders before you can be matched with a student. */}
                    Live training is an hour long Zoom session where you can find out more about Step Up and ask any questions you may have.
            </RequiredOBItem> }
            </div>
        </div>;
    }
}

//Step 3 Component
class FinalSteps extends React.Component {
    constructor(props) {
        super(props)

        //State
        this.state = {
            isLoading: false
        }

    }

    componentDidMount() {

    }

    render() {

        //Show a skeleton when loading
        if (this.state.isLoading) return <Skeleton active />

        //Otherwise show the dashboard items
        return <div className='dashboard-step' style={{ marginTop: 50 }}>

            <Title level={3}>You're Ready to be Matched!</Title>

            <p>While you're waiting for us to match you with a student, check out our Training Resources.</p>

            <Button type='primary' size='large' href='https://docs.google.com/document/d/18wWsqnV59P6a47u4i0IeXQIt2POdjAiPHol3r4i-054/edit#' target='_blank'>Training Resources</Button>

        </div>;
    }
}

//All the steps
const steps = [FirstSteps, SecondSteps, FinalSteps]

//The main dashboard component
class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        //Get the current "step" screen
        const StepItem = steps[this.props.currentStep];

        //If it's still loading, show a skeleton
        if (this.props.loading) return <div><Skeleton active/></div>

        //If there was an error (i.e. the record didn't exist) display "Applicant Record Not Found"
        if (this.props.error && !this.props.offline) return <div>
            <Title>Applicant Record Not Found </Title>
            <p>We can't find your record in the database - if this doesn't seem right, please contact <Link href='mailto:laura@stepuptutoring.org'>laura@stepuptutoring.org</Link>.</p>
        </div>

        //If user went offline (or computer to sleep) and page stayed open
        if (this.props.error && this.props.offline) return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <Title>Oops!</Title>
            <p>Looks like our app took a little nap while you were away.</p>
            <Button onClick={() => window.location.reload()}> <ReloadOutlined /> Refresh Page</Button>
        </div>

        if (this.props.currentStep == 4) return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>

            <Title level={1}>???? You've Been Matched! ????</Title>
            <p>From now on, you'll be using your tutor portal. We'll see you there!</p>
            <Button type='primary' size='large' href='./tutor_portal.html' target='_blank'>Go To Tutor Portal</Button>

        </div>

        if (this.props.currentStep == 5) return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>

            <Title level={1} style={{ color: '#327D83'}}>Thank you for your interest!</Title>
            <p>If you think there's been an error, please <strong><a href="https://www.stepuptutoring.org/contact" target='_blank'>contact us</a></strong>.</p>

        </div>

        //Otherwise, show the regular dashboard
        return <div>
            <Title>Your Onboarding Dashboard</Title>
            {!this.props.progress.hasScheduledChat ? <div><p>{this.props.tutorDetails.firstname} we're so glad you're here!</p>
            <p>Complete the items as soon as you can and don't hesitate to reach out if you have any questions!</p></div> : null}
            <div className='steps-container'>
                <Steps current={this.props.currentStep}  className='steps' responsive={true}>
                    <Step title='First Steps'/>
                    <Step title='Live Scan & Info Session'/>
                    <Step title='Student Match'/>
                </Steps>
            </div>

            <StepItem tutorDetails={this.props.tutorDetails} progress={this.props.progress} onSideBarItemClicked={this.props.onSideBarItemClicked} />

        </div>;

    }
}
