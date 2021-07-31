//Importing Ant components
const { Typography, Steps, Card, Row, Col, Button, Skeleton } = antd;
const { SolutionOutlined, BookOutlined, CalendarFilled, SecurityScanOutlined, RocketOutlined } = icons;
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
        return <Link className='requirement' onClick={() => this.props.linkTo(this.props.pageKey)}>
            <div style={{ float: "left", width: "200px", height: "150px" }}>
                {this.props.icon && this.props.icon} {this.props.title}
                <p className='description'>
                    {this.props.children}
                </p>
            </div>
        </Link>;
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
        if ('Interview Date' in tutorDetails && tutorDetails['Interview Date']) {
            interviewDate = tutorDetails['Interview Date']
        }

        //Show a skeleton when loading
        if (this.state.isLoading) return <Skeleton active />

        //Otherwise show the dashboard items
        return <div className='step'>

            {/* Show when interview has not been scheduled */}
            { !progress.hasScheduledChat && (<div>

                <Title level={3} color='primary'>Chat with Talent Coordinator</Title>

                <p>As soon as you can, we'd like you to schedule a chat with one of our talent coordinators so we can get to know you a little better.</p>

                <Button className='btn' icon={<CalendarFilled />} type='primary' size='large' onClick={() => this.props.onSideBarItemClicked('chat-signup')} >
                    Schedule a chat
                </Button>

                {/* onClick={() => this.props.onSideBarItemClicked('chat-signup')} */}

            </div>) }

            {/* Show when interview has been scheduled but not yet passed */}
            {progress.hasScheduledChat && <div>

                <Title level={3} color='primary'>Thanks for scheduling a chat with us!</Title>
                <p>Once you've had your interview, you'll move on to the next steps!</p>
                <strong><p>Your interview date: {interviewDate}</p></strong>

                <div>

                    <Title level={3}>Other Steps</Title>

                    <p>While you're waiting, you can work on these items:</p>

                    <div className='dashboard-required-items'>
                        {/* Fix to direct to sidebar page */}
                        {<RequiredOBItem linkTo={this.props.onSideBarItemClicked} pageKey={'waiver'} icon={<SolutionOutlined />} title='Tutor Waiver'>
                            The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring.
                        </RequiredOBItem>}

                        {<RequiredOBItem linkTo={this.props.onSideBarItemClicked} pageKey={'workbook'} icon={<BookOutlined />} title='The Workbook'>
                            The workbook is our training course for new tutors. It will set you up for success with your student.
                        </RequiredOBItem>}
                    </div>
                </div>



            </div>}


            {/* Show when interview scheduled but waiver or workbook not completed */}

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

        //Show a skeleton when loading
        if (this.state.isLoading) return <Skeleton active />

        //Otherwise show the dashboard items --> Shows when interview has been passed but other items need to be completed
        return <div className='step'>

            <Title level={3}>Thanks for chatting with us!</Title>

            <p>You’re almost there! Just make sure to complete these items as soon as you are able so you can move on to your student match!</p>
            <div className='dashboard-required-items'>
                {<RequiredOBItem linkTo={this.props.onSideBarItemClicked} pageKey={'waiver'} icon={<SolutionOutlined/>} title='Tutor Waiver'>
                The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring.
            </RequiredOBItem> }

                {<RequiredOBItem linkTo={this.props.onSideBarItemClicked} pageKey={'workbook'} icon={<BookOutlined/>} title='The Workbook'>
                The workbook is our training course for new tutors. It will set you up for success with your student.
            </RequiredOBItem> }

                {<RequiredOBItem linkTo={this.props.onSideBarItemClicked} pageKey={'livescan'} icon={<SecurityScanOutlined/>} title='LiveScan'>
                LiveScan is a government requirement for working with children. This is completed outside of StepUp.
            </RequiredOBItem> }

                {<RequiredOBItem linkTo={this.props.onSideBarItemClicked} pageKey={'training'} icon={<RocketOutlined/>} title='Live Training'>
                You will need to complete a live training session with one of our leaders before you can be matched with a student.
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

            <p>While you're waiting for us to match you with a student, try going to your new tutor portal:</p>

            <Button type='primary' size='large'>Sign In to Tutor Portal</Button>


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
        if (this.props.error) return <div>
            <Title>Applicant Record Not Found </Title>
            <p>We can't find your record in the database - if this doesn't seem right, please contact <Link href='mailto:laura@stepuptutoring.org'>laura@stepuptutoring.org</Link>.</p>
        </div>

        if (this.props.currentStep == 4) return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>

            <Title level={1}>🎉 You've Been Matched! 🎉</Title>
            <p>From now on, you'll be using your tutor portal. We'll see you there!</p>
            <Button type='primary' size='large'>Go To Tutor Portal</Button>

        </div>

        //Otherwise, show the regular dashboard
        return <div>
            <Title>Your Onboarding Dashboard</Title>
            <p>There's just a few things we'll need you to complete before proceeding.</p>
            <div class='steps-container'>
                <Steps current={this.props.currentStep}  className='steps' responsive={true}>
                    <Step title='First Steps'/>
                    <Step title='LiveScan & Info Session'/>
                    <Step title='Student Match'/>
                </Steps>
            </div>

            <StepItem tutorDetails={this.props.tutorDetails} progress={this.props.progress} onSideBarItemClicked={this.props.onSideBarItemClicked} />

        </div>;

    }
}
