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

//Required item component

var RequiredItem = function (_React$Component) {
    _inherits(RequiredItem, _React$Component);

    function RequiredItem(props) {
        _classCallCheck(this, RequiredItem);

        return _possibleConstructorReturn(this, (RequiredItem.__proto__ || Object.getPrototypeOf(RequiredItem)).call(this, props));
    }

    _createClass(RequiredItem, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                Link,
                { className: 'requirement', href: this.props.link, target: '_blank' },
                React.createElement(
                    'div',
                    null,
                    this.props.icon && this.props.icon,
                    ' ',
                    this.props.title,
                    React.createElement(
                        'p',
                        { className: 'description' },
                        this.props.children
                    )
                )
            );
        }
    }]);

    return RequiredItem;
}(React.Component);

//Step 1 Component


var FirstSteps = function (_React$Component2) {
    _inherits(FirstSteps, _React$Component2);

    function FirstSteps(props) {
        _classCallCheck(this, FirstSteps);

        //State
        var _this2 = _possibleConstructorReturn(this, (FirstSteps.__proto__ || Object.getPrototypeOf(FirstSteps)).call(this, props));

        _this2.state = {
            hasScheduledChat: false,
            hasCompletedWaiver: false,
            hasCompletedWorkbook: false,
            isLoading: false

            //Set the tracked items
            // if ('Waiver?' in this.props.userData['user']) this.state.hasCompletedWaiver = notNull(this.props.userData['user']['Waiver?'])
            // if ('Section 2' in this.props.userData['user']) this.state.hasCompletedWorkbook = notNull(this.props.userData['user']['Section 2'])
            // if ('Interview Date' in this.props.userData['user']) this.state.hasScheduledChat = notNull(this.props.userData['user']['Interview Date'])

        };return _this2;
    }

    _createClass(FirstSteps, [{
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
                { className: 'step' },
                !this.state.hasScheduledChat && React.createElement(
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
                this.state.hasScheduledChat && React.createElement(
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
                    )
                ),
                this.state.hasScheduledChat && (!this.state.hasCompletedWaiver || !this.state.hasCompletedWorkbook) && React.createElement(
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
                        !this.state.hasCompletedWaiver && React.createElement(
                            RequiredItem,
                            { link: links['waiver'], icon: React.createElement(SolutionOutlined, null), title: 'Tutor Waiver' },
                            'The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring.'
                        ),
                        !this.state.hasCompletedWorkbook && React.createElement(
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


var SecondSteps = function (_React$Component3) {
    _inherits(SecondSteps, _React$Component3);

    function SecondSteps(props) {
        _classCallCheck(this, SecondSteps);

        //State
        var _this3 = _possibleConstructorReturn(this, (SecondSteps.__proto__ || Object.getPrototypeOf(SecondSteps)).call(this, props));

        _this3.state = {
            hasCompletedWaiver: false,
            hasCompletedWorkbook: false,
            hasCompletedLiveScan: false,
            hasCompletedLiveTraining: false,
            isLoading: false

            //Set the tracked items
            // if ('Waiver?' in this.props.userData['user']) this.state.hasCompletedWaiver = notNull(this.props.userData['user']['Waiver?'])
            // if ('Section 2' in this.props.userData['user']) this.state.hasCompletedWorkbook = notNull(this.props.userData['user']['Section 2'])
            // if ('Live Scan?' in this.props.userData['user']) this.state.hasCompletedLiveScan = notNull(this.props.userData['user']['Live Scan?'])
            // if ('Live Training?' in this.props.userData['user']) this.state.hasCompletedLiveTraining = notNull(this.props.userData['user']['Live Training?'])

        };return _this3;
    }

    _createClass(SecondSteps, [{
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
                    !this.state.hasCompletedWaiver && React.createElement(
                        RequiredItem,
                        { link: links['waiver'], icon: React.createElement(SolutionOutlined, null), title: 'Tutor Waiver' },
                        'The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring.'
                    ),
                    !this.state.hasCompletedWorkbook && React.createElement(
                        RequiredItem,
                        { link: links['workbook'], icon: React.createElement(BookOutlined, null), title: 'The Workbook' },
                        'The workbook is our training course for new tutors. It will set you up for success with your student.'
                    ),
                    !this.state.hasCompletedLiveScan && React.createElement(
                        RequiredItem,
                        { link: links['livescan'], icon: React.createElement(SecurityScanOutlined, null), title: 'LiveScan' },
                        'LiveScan is a government requirement for working with children. This is completed outside of StepUp.'
                    ),
                    !this.state.hasCompletedLiveTraining && React.createElement(
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


var FinalSteps = function (_React$Component4) {
    _inherits(FinalSteps, _React$Component4);

    function FinalSteps(props) {
        _classCallCheck(this, FinalSteps);

        //State
        var _this4 = _possibleConstructorReturn(this, (FinalSteps.__proto__ || Object.getPrototypeOf(FinalSteps)).call(this, props));

        _this4.state = {
            isLoading: false
        };

        return _this4;
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
                    { type: 'primary', size: 'large' },
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

var Home = function (_React$Component5) {
    _inherits(Home, _React$Component5);

    function Home(props) {
        _classCallCheck(this, Home);

        var _this5 = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

        _this5.state = {
            loading: true,
            currentStep: 0,
            error: false
        };

        _this5.onError = _this5.onError.bind(_this5);
        return _this5;
    }

    _createClass(Home, [{
        key: 'receiveUser',
        value: function receiveUser(user) {
            console.log({ user: user });
            var currentStep = 1; //changed from 0 to 1 for testing

            // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Application Accepted') currentStep = 1
            // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Ready to Tutor') currentStep = 2
            // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Matched') currentStep = 4

            //Update the state with the received data
            this.setState({
                loading: false,
                userData: user.data,
                currentStep: currentStep
            });
        }
    }, {
        key: 'setUserLocalStorage',
        value: function setUserLocalStorage(user) {
            var firstname = user.data.user['First Name'];
            var lastname = user.data.user['Last Name'];
            var email = user.data.user['Email'];
            window.localStorage.setItem('userEmail', email);
            window.localStorage.setItem('userFirstName', firstname);
            window.localStorage.setItem('userLastName', lastname);
        }
    }, {
        key: 'onError',
        value: function onError(error) {
            this.setState({ error: true, loading: false });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this6 = this;

            firebase.functions().httpsCallable('getTutorData')().then(function (result) {
                _this6.receiveUser(result);
                _this6.setUserLocalStorage(result);
            }).catch(function (error) {
                _this6.onError(error);
            });
        }
    }, {
        key: 'render',
        value: function render() {

            //Get the current "step" screen
            var StepItem = steps[this.state.currentStep];

            //If it's still loading, show a skeleton
            if (this.state.loading) return React.createElement(
                'div',
                null,
                React.createElement(Skeleton, { active: true })
            );

            //If there was an error (i.e. the record didn't exist) display "Applicant Record Not Found"
            if (this.state.error) return React.createElement(
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

            if (this.state.currentStep == 4) return React.createElement(
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
                    { type: 'primary', size: 'large' },
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
                        { current: this.state.currentStep, className: 'steps', responsive: true },
                        React.createElement(Step, { title: 'First Steps' }),
                        React.createElement(Step, { title: 'LiveScan & Info Session' }),
                        React.createElement(Step, { title: 'Student Match' })
                    )
                ),
                React.createElement(StepItem, { userData: this.state.userData })
            );
        }
    }]);

    return Home;
}(React.Component);