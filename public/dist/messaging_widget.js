var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _antd = antd,
    Select = _antd.Select,
    Layout = _antd.Layout,
    Input = _antd.Input,
    Spin = _antd.Spin,
    Form = _antd.Form;
var Option = Select.Option;
var Sider = Layout.Sider,
    Content = Layout.Content,
    Header = Layout.Header;
var Search = Input.Search;

//Alter the server host name depending on if we're using the emulator or not

var serverHostname = EMULATOR ? 'http://localhost:5001' : 'https://us-central1-stepup-dashboard.cloudfunctions.net';
if (EMULATOR) firebase.functions().useEmulator("localhost", 5001);

var MessagesDisplay = function (_React$Component) {
    _inherits(MessagesDisplay, _React$Component);

    function MessagesDisplay(props) {
        _classCallCheck(this, MessagesDisplay);

        var _this = _possibleConstructorReturn(this, (MessagesDisplay.__proto__ || Object.getPrototypeOf(MessagesDisplay)).call(this, props));

        _this.scrollView = React.createRef();
        _this.lastScrollPos = 0;
        return _this;
    }

    _createClass(MessagesDisplay, [{
        key: 'scrollToBottom',
        value: function scrollToBottom() {

            //Scroll it to bottom
            this.scrollView.current.scrollTop = this.scrollView.current.scrollHeight;
        }
    }, {
        key: 'getScrollPos',
        value: function getScrollPos() {

            if (!this.scrollView.current) return undefined;
            return this.scrollView.current.scrollTop;
        }
    }, {
        key: 'setScrollPos',
        value: function setScrollPos(pos) {

            if (!this.scrollView.current) return;
            this.scrollView.current.scrollTop = pos;
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {

            if (this.scrollView.current) this.scrollView.current.scrollTop = this.lastScrollPos;
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.scrollView.current) this.lastScrollPos = this.scrollView.current.scrollTop;

            if (this.props.loading) return React.createElement(Spin, { style: { display: 'flex', alignSelf: 'center', justifyContent: 'center', margin: 10 } });

            return React.createElement(
                'div',
                { key: Math.random(), style: { display: 'flex', flexDirection: 'column', height: this.props.height, overflowY: 'auto' }, ref: this.scrollView },
                this.props.messages.map(function (item) {

                    var toStyle = {
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
                    };

                    var fromStyle = {
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
                    };

                    var theStyle = item.type == 'to' ? toStyle : fromStyle;

                    var labelStyle = {
                        fontSize: 10,
                        color: item.type == 'to' ? '#238d95' : 'gray',
                        float: item.type == 'to' ? 'right' : 'left',
                        display: 'flex',
                        alignSelf: item.type == 'to' ? 'flex-end' : 'flex-start',
                        margin: 5
                    };

                    return React.createElement(
                        'div',
                        { className: 'message-bubble', style: { display: 'flex', flexDirection: 'column' } },
                        React.createElement(
                            'div',
                            { style: theStyle },
                            item.body
                        )
                    );
                })
            );
        }
    }]);

    return MessagesDisplay;
}(React.Component);

var MessagingWidget = function (_React$Component2) {
    _inherits(MessagingWidget, _React$Component2);

    function MessagingWidget(props) {
        _classCallCheck(this, MessagingWidget);

        var _this2 = _possibleConstructorReturn(this, (MessagingWidget.__proto__ || Object.getPrototypeOf(MessagingWidget)).call(this, props));

        _this2.state = {
            messages: [],
            isLoadingMessages: false,
            isSendingMessage: false,
            student: null,
            messageValue: ''
        };

        _this2.messagesDisplay = React.createRef();
        _this2.input = React.createRef();

        _this2.poll = undefined;

        _this2.loadStudentMessages = _this2.loadStudentMessages.bind(_this2);
        _this2.sendMessage = _this2.sendMessage.bind(_this2);

        return _this2;
    }

    _createClass(MessagingWidget, [{
        key: 'loadStudentMessages',
        value: function loadStudentMessages(student) {
            var _this3 = this;

            //Get the student
            var studentObj = null;
            for (var i = 0; i < this.props.tutor.students.length; i++) {
                if (this.props.tutor.students[i].id == student) {
                    studentObj = this.props.tutor.students[i];break;
                }
            }

            this.setState({ isLoadingMessages: true, student: studentObj });

            var isFirstPoll = true;

            this.poll = function () {

                setTimeout(function () {

                    firebase.functions().httpsCallable('getMessagesForStudent')({
                        studentId: student
                    }).then(function (result) {

                        //Get the current scroll position
                        var scrollPos = _this3.messagesDisplay.current.getScrollPos();

                        //Get the current most recent sent time
                        var mostRecentDateSent = void 0;
                        if (_this3.state.messages.length > 0) {
                            mostRecentDateSent = _this3.state.messages[_this3.state.messages.length - 1].dateSent;
                        }

                        _this3.setState({ messages: result.data.messages.map(function (message) {
                                return Object.assign({}, message, { type: message.to == studentObj.phone ? 'to' : 'from' });
                            }), isLoadingMessages: false });

                        //Get the new most recent sent time
                        var newMostRecentDateSent = void 0;
                        if (result.data.messages.length > 0) {
                            newMostRecentDateSent = _this3.state.messages[_this3.state.messages.length - 1].dateSent;
                        }

                        if (isFirstPoll || mostRecentDateSent != newMostRecentDateSent) {

                            //Scroll it to the bottom
                            _this3.messagesDisplay.current.scrollToBottom();

                            isFirstPoll = false;
                        } else {

                            _this3.messagesDisplay.current.setScrollPos(scrollPos);
                        }

                        //Poll again
                        _this3.poll();
                    }).catch(function (err) {
                        _this3.poll();
                    });
                }, 2000);
            };

            this.poll();
        }
    }, {
        key: 'getStudentOptions',
        value: function getStudentOptions() {

            return this.props.tutor.students.map(function (student) {

                //Create an option
                return React.createElement(
                    Option,
                    { key: student.id, value: student.id },
                    student.firstname + ' ' + student.lastname
                );
            });
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(value, e) {
            var _this4 = this;

            this.setState({ isSendingMessage: true });

            this.messagesDisplay.current.scrollToBottom();

            //Make a request to firebase
            firebase.functions().httpsCallable('sendSMSMessage')({
                message: value,
                phone: this.state.student.proxyNumber
            }).then(function (result) {

                //Add the result to our messages
                var messages = _this4.state.messages;
                messages.push(result.data);
                _this4.setState({ messages: messages, isSendingMessage: false });

                //Clear the input
                _this4.input.current.setState({ value: '' });

                //Scroll it to the bottom
                _this4.messagesDisplay.current.scrollToBottom();
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                null,
                React.createElement(
                    Select,
                    { placeholder: 'Choose a student', loading: this.state.isLoadingStudents, style: { width: 200 }, onChange: this.loadStudentMessages },
                    this.getStudentOptions()
                ),
                React.createElement(
                    Layout,
                    { style: { borderRadius: 10, marginTop: 5, padding: 20 } },
                    React.createElement(
                        Content,
                        null,
                        React.createElement(MessagesDisplay, { ref: this.messagesDisplay, messages: this.state.messages, loading: this.state.isLoadingMessages, toName: 'Me', fromName: 'You', height: this.props.height, tutor: this.props.tutor }),
                        React.createElement(Search, { ref: this.input, style: { marginTop: 10, borderTop: 'solid 1px #DDD', paddingTop: 10 }, placeholder: 'Type your message...', enterButton: 'Send', loading: this.state.isSendingMessage, onSearch: this.sendMessage })
                    )
                )
            );
        }
    }]);

    return MessagingWidget;
}(React.Component);