var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Importing Ant components
var _antd = antd,
    Typography = _antd.Typography,
    Steps = _antd.Steps,
    Card = _antd.Card,
    Row = _antd.Row,
    Col = _antd.Col,
    Button = _antd.Button,
    Skeleton = _antd.Skeleton;
var _icons = icons,
    SolutionOutlined = _icons.SolutionOutlined,
    BookOutlined = _icons.BookOutlined,
    CalendarFilled = _icons.CalendarFilled,
    SecurityScanOutlined = _icons.SecurityScanOutlined,
    RocketOutlined = _icons.RocketOutlined;
var Title = Typography.Title,
    Link = Typography.Link;
var Step = Steps.Step;

//Item links

var links = {
    'waiver': 'https://stepuptutoring.org/waiver',
    'workbook': 'https://docs.google.com/document/d/11FkYrhdTmi4GHODKcb91HOqVd8og5EfPdRQYesDSDlI',
    'chat': 'https://stepuptutoring.org/tutor-application-2',
    'livescan': 'https://oag.ca.gov/fingerprints/locations/live-scan-salinas?county=Los+Angeles',
    'training': ''

    //Util function
};function notNull(value) {
    return value != undefined && value != null && value != NaN;
}

//Step 1 Component

var FirstSteps = function (_React$Component) {
    _inherits(FirstSteps, _React$Component);

    function FirstSteps(props) {
        _classCallCheck(this, FirstSteps);

        //State
        var _this = _possibleConstructorReturn(this, (FirstSteps.__proto__ || Object.getPrototypeOf(FirstSteps)).call(this, props));

        _this.state = {
            isLoading: false
        };
        return _this;
    }

    _createClass(FirstSteps, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            var progress = this.props.progress;
            var tutorDetails = this.props.tutorDetails;
            var interviewDate = '';
            if ('Interview Date' in tutorDetails && tutorDetails['Interview Date']) {
                interviewDate = tutorDetails['Interview Date'];
            }

            //Show a skeleton when loading
            if (this.state.isLoading) return React.createElement(Skeleton, { active: true });

            //Otherwise show the dashboard items
            return React.createElement(
                'div',
                { className: 'step' },
                !progress.hasScheduledChat && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Title,
                        { level: 3, color: 'primary' },
                        'Chat with Talent Coordinator'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'As soon as you can, we\'d like you to schedule a chat with one of our talent coordinators so we can get to know you a little better.'
                    ),
                    React.createElement(
                        Button,
                        { className: 'btn', icon: React.createElement(CalendarFilled, null), type: 'primary', size: 'large', href: links['chat'], target: '_blank' },
                        'Schedule a chat'
                    )
                ),
                progress.hasScheduledChat && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Title,
                        { level: 3, color: 'primary' },
                        'Thanks for scheduling a chat with us!'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Once you\'ve had your interview, you\'ll move on to the next steps!'
                    ),
                    React.createElement(
                        'strong',
                        null,
                        React.createElement(
                            'p',
                            null,
                            'Your interview date: ',
                            interviewDate
                        )
                    )
                ),
                progress.hasScheduledChat && (!progress.hasCompletedWaiver || !progress.hasCompletedWorkbook) && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Title,
                        { level: 3 },
                        'Other Steps'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'While you\'re waiting, you can work on these items:'
                    ),
                    React.createElement(
                        'div',
                        { className: 'dashboard-required-items' },
                        !progress.hasCompletedWaiver && React.createElement(
                            RequiredItem,
                            { link: links['waiver'], icon: React.createElement(SolutionOutlined, null), title: 'Tutor Waiver' },
                            'The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring.'
                        ),
                        !progress.hasCompletedWorkbook && React.createElement(
                            RequiredItem,
                            { link: links['workbook'], icon: React.createElement(BookOutlined, null), title: 'The Workbook' },
                            'The workbook is our training course for new tutors. It will set you up for success with your student.'
                        )
                    )
                )
            );
        }
    }]);

    return FirstSteps;
}(React.Component);

//Step 2 Component


var SecondSteps = function (_React$Component2) {
    _inherits(SecondSteps, _React$Component2);

    function SecondSteps(props) {
        _classCallCheck(this, SecondSteps);

        //State
        var _this2 = _possibleConstructorReturn(this, (SecondSteps.__proto__ || Object.getPrototypeOf(SecondSteps)).call(this, props));

        _this2.state = {
            isLoading: false
        };
        return _this2;
    }

    _createClass(SecondSteps, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            var progress = this.props.progress;

            //Show a skeleton when loading
            if (this.state.isLoading) return React.createElement(Skeleton, { active: true });

            //Otherwise show the dashboard items --> Shows when interview has been passed but other items need to be completed
            return React.createElement(
                'div',
                { className: 'step' },
                React.createElement(
                    Title,
                    { level: 3 },
                    'Thanks for chatting with us!'
                ),
                React.createElement(
                    'p',
                    null,
                    'You\u2019re almost there! Just make sure to complete these items as soon as you are able so you can move on to your student match!'
                ),
                React.createElement(
                    'div',
                    { className: 'dashboard-required-items' },
                    !progress.hasCompletedWaiver && React.createElement(
                        RequiredItem,
                        { link: links['waiver'], icon: React.createElement(SolutionOutlined, null), title: 'Tutor Waiver' },
                        'The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring.'
                    ),
                    !progress.hasCompletedWorkbook && React.createElement(
                        RequiredItem,
                        { link: links['workbook'], icon: React.createElement(BookOutlined, null), title: 'The Workbook' },
                        'The workbook is our training course for new tutors. It will set you up for success with your student.'
                    ),
                    !progress.hasCompletedLiveScan && React.createElement(
                        RequiredItem,
                        { link: links['livescan'], icon: React.createElement(SecurityScanOutlined, null), title: 'LiveScan' },
                        'LiveScan is a government requirement for working with children. This is completed outside of StepUp.'
                    ),
                    !progress.hasCompletedLiveTraining && React.createElement(
                        RequiredItem,
                        { link: links['training'], icon: React.createElement(RocketOutlined, null), title: 'Live Training' },
                        'You will need to complete a live training session with one of our leaders before you can be matched with a student.'
                    )
                )
            );
        }
    }]);

    return SecondSteps;
}(React.Component);

//Step 3 Component


var FinalSteps = function (_React$Component3) {
    _inherits(FinalSteps, _React$Component3);

    function FinalSteps(props) {
        _classCallCheck(this, FinalSteps);

        //State
        var _this3 = _possibleConstructorReturn(this, (FinalSteps.__proto__ || Object.getPrototypeOf(FinalSteps)).call(this, props));

        _this3.state = {
            isLoading: false
        };

        return _this3;
    }

    _createClass(FinalSteps, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            //Show a skeleton when loading
            if (this.state.isLoading) return React.createElement(Skeleton, { active: true });

            //Otherwise show the dashboard items
            return React.createElement(
                'div',
                { className: 'dashboard-step', style: { marginTop: 50 } },
                React.createElement(
                    Title,
                    { level: 3 },
                    'You\'re Ready to be Matched!'
                ),
                React.createElement(
                    'p',
                    null,
                    'While you\'re waiting for us to match you with a student, try going to your new tutor portal:'
                ),
                React.createElement(
                    Button,
                    { type: 'primary', size: 'large', href: './tutor_portal.html', target: '_blank' },
                    'Sign In to Tutor Portal'
                )
            );
        }
    }]);

    return FinalSteps;
}(React.Component);

//All the steps


var steps = [FirstSteps, SecondSteps, FinalSteps];

//The main dashboard component

var Home = function (_React$Component4) {
    _inherits(Home, _React$Component4);

    function Home(props) {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));
    }

    _createClass(Home, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            //Get the current "step" screen
            var StepItem = steps[this.props.currentStep];

            //If it's still loading, show a skeleton
            if (this.props.loading) return React.createElement(
                'div',
                null,
                React.createElement(Skeleton, { active: true })
            );

            //If there was an error (i.e. the record didn't exist) display "Applicant Record Not Found"
            if (this.props.error) return React.createElement(
                'div',
                null,
                React.createElement(
                    Title,
                    null,
                    'Applicant Record Not Found '
                ),
                React.createElement(
                    'p',
                    null,
                    'We can\'t find your record in the database - if this doesn\'t seem right, please contact ',
                    React.createElement(
                        Link,
                        { href: 'mailto:laura@stepuptutoring.org' },
                        'laura@stepuptutoring.org'
                    ),
                    '.'
                )
            );

            if (this.props.currentStep == 4) return React.createElement(
                'div',
                { style: { display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' } },
                React.createElement(
                    Title,
                    { level: 1 },
                    '\uD83C\uDF89 You\'ve Been Matched! \uD83C\uDF89'
                ),
                React.createElement(
                    'p',
                    null,
                    'From now on, you\'ll be using your tutor portal. We\'ll see you there!'
                ),
                React.createElement(
                    Button,
                    { type: 'primary', size: 'large', href: './tutor_portal.html', target: '_blank' },
                    'Go To Tutor Portal'
                )
            );

            //Otherwise, show the regular dashboard
            return React.createElement(
                'div',
                null,
                React.createElement(
                    Title,
                    null,
                    'Your Onboarding Dashboard'
                ),
                React.createElement(
                    'p',
                    null,
                    'There\'s just a few things we\'ll need you to complete before proceeding.'
                ),
                React.createElement(
                    'div',
                    { 'class': 'steps-container' },
                    React.createElement(
                        Steps,
                        { current: this.props.currentStep, className: 'steps', responsive: true },
                        React.createElement(Step, { title: 'First Steps' }),
                        React.createElement(Step, { title: 'LiveScan & Info Session' }),
                        React.createElement(Step, { title: 'Student Match' })
                    )
                ),
                React.createElement(StepItem, { tutorDetails: this.props.tutorDetails, progress: this.props.progress })
            );
        }
    }]);

    return Home;
}(React.Component);