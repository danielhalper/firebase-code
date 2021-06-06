var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//The node to mount on
var mountNode = document.getElementById('content');

var _antd = antd,
    Form = _antd.Form,
    Input = _antd.Input,
    Button = _antd.Button,
    Typography = _antd.Typography,
    Layout = _antd.Layout,
    Menu = _antd.Menu,
    Skeleton = _antd.Skeleton,
    Table = _antd.Table,
    Tag = _antd.Tag,
    Card = _antd.Card,
    Select = _antd.Select,
    message = _antd.message,
    Spin = _antd.Spin,
    Divider = _antd.Divider;
var Option = Select.Option;
var Title = Typography.Title,
    Link = Typography.Link;
var _icons = icons,
    SolutionOutlined = _icons.SolutionOutlined,
    BookOutlined = _icons.BookOutlined,
    CalendarFilled = _icons.CalendarFilled,
    UserOutlined = _icons.UserOutlined,
    MessageOutlined = _icons.MessageOutlined,
    NotificationOutlined = _icons.NotificationOutlined;
var Sider = Layout.Sider,
    Content = Layout.Content,
    Header = Layout.Header;
var TextArea = Input.TextArea;


var EMULATOR = window.location.href.includes('localhost');

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001);

var ManageUsersScreen = function (_React$Component) {
    _inherits(ManageUsersScreen, _React$Component);

    function ManageUsersScreen(props) {
        _classCallCheck(this, ManageUsersScreen);

        var _this = _possibleConstructorReturn(this, (ManageUsersScreen.__proto__ || Object.getPrototypeOf(ManageUsersScreen)).call(this, props));

        _this.state = {
            privilegedUsers: [],
            loadingSearch: false,
            searchResult: null
        };

        _this.onSearch = _this.onSearch.bind(_this);
        _this.handleRoleUpdate = _this.handleRoleUpdate.bind(_this);
        return _this;
    }

    _createClass(ManageUsersScreen, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            firebase.functions().httpsCallable('listPrivilegedUsers')().then(function (result) {
                _this2.setState({
                    privilegedUsers: result.data['users'].map(function (item) {
                        return Object.assign({}, item, { key: item.uid });
                    })
                });
            });
        }
    }, {
        key: 'onSearch',
        value: function onSearch(value, event) {
            var _this3 = this;

            if (value == '') return;

            this.setState({
                loadingSearch: true
            });

            firebase.functions().httpsCallable('getUserByEmail')({
                email: value
            }).then(function (result) {

                _this3.setState({
                    loadingSearch: false,
                    searchResult: result.data
                });
            }).catch(function (error) {

                _this3.setState({
                    loadingSearch: false
                });

                message.error('We Couldn\'t Find That User');
            });
        }
    }, {
        key: 'handleRoleUpdate',
        value: function handleRoleUpdate(values, option) {
            var _this4 = this;

            var roles = this.state.searchResult.roles || [];

            var itemsToDo = [];

            if (values.includes('admin') && !roles.includes('admin')) {
                itemsToDo.push(firebase.functions().httpsCallable('grantAdminAccess')({ uid: this.state.searchResult.uid }));
            }

            if (values.includes('announcer') && !roles.includes('announcer')) {
                itemsToDo.push(firebase.functions().httpsCallable('grantAnnouncerAccess')({ uid: this.state.searchResult.uid }));
            }

            if (roles.includes('admin') && !values.includes('admin')) {
                itemsToDo.push(firebase.functions().httpsCallable('revokeAdminAccess')({ uid: this.state.searchResult.uid }));
            }

            if (roles.includes('announcer') && !values.includes('announcer')) {
                itemsToDo.push(firebase.functions().httpsCallable('revokeAnnouncerAccess')({ uid: this.state.searchResult.uid }));
            }

            Promise.all(itemsToDo).then(function (result) {

                _this4.setState({
                    loadingSearch: true
                });

                firebase.functions().httpsCallable('getUserByEmail')({
                    email: _this4.state.searchResult.email
                }).then(function (result) {

                    _this4.setState({
                        loadingSearch: false,
                        searchResult: result.data
                    });

                    message.success('Updated Roles Successfully!');
                });

                firebase.functions().httpsCallable('listPrivilegedUsers')().then(function (result) {
                    _this4.setState({
                        privilegedUsers: result.data['users'].map(function (item) {
                            return Object.assign({}, item, { key: item.uid });
                        })
                    });
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            return React.createElement(
                'div',
                { style: { background: '#f0f2f5' } },
                React.createElement(
                    Title,
                    null,
                    'Manage Users'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Title,
                        { level: 3 },
                        'Add a New Admin or Announcer'
                    ),
                    React.createElement(Input.Search, { allowClear: true, placeholder: 'Enter an email...', onSearch: this.onSearch, loading: this.state.loadingSearch }),
                    this.state.searchResult && React.createElement(
                        'div',
                        null,
                        React.createElement(
                            Card,
                            { title: this.state.searchResult.email, style: { margin: 20 } },
                            React.createElement(
                                Select,
                                { mode: 'multiple', placeholder: 'Add roles...', defaultValue: (this.state.searchResult.roles || []).filter(function (item) {
                                        return ['admin', 'announcer'].includes(item);
                                    }), style: { width: 300 }, onChange: this.handleRoleUpdate },
                                React.createElement(
                                    Option,
                                    { key: 'announcer', value: 'announcer' },
                                    'Announcer'
                                ),
                                React.createElement(
                                    Option,
                                    { key: 'admin', value: 'admin' },
                                    'Admin'
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Title,
                        { level: 3 },
                        'Current Admins and Announcers'
                    ),
                    React.createElement(Table, { dataSource: this.state.privilegedUsers, columns: [{
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email',
                            render: function render(email) {
                                return React.createElement(
                                    Link,
                                    { onClick: function onClick(event) {
                                            return _this5.onSearch(email, event);
                                        } },
                                    email
                                );
                            }
                        }, {
                            title: 'Roles',
                            dataIndex: 'roles',
                            key: 'roles',
                            render: function render(roles) {
                                return React.createElement(
                                    'span',
                                    null,
                                    roles.map(function (role) {
                                        var color = role == 'admin' ? 'red' : 'orange';
                                        return React.createElement(
                                            Tag,
                                            { color: color, key: role },
                                            role
                                        );
                                    })
                                );
                            }
                        }] })
                )
            );
        }
    }]);

    return ManageUsersScreen;
}(React.Component);

var MessagesDisplay = function (_React$Component2) {
    _inherits(MessagesDisplay, _React$Component2);

    function MessagesDisplay(props) {
        _classCallCheck(this, MessagesDisplay);

        return _possibleConstructorReturn(this, (MessagesDisplay.__proto__ || Object.getPrototypeOf(MessagesDisplay)).call(this, props));
    }

    _createClass(MessagesDisplay, [{
        key: 'render',
        value: function render() {

            if (this.props.loading) return React.createElement(Spin, { style: { display: 'flex', alignSelf: 'center', justifyContent: 'center' } });

            return React.createElement(
                'div',
                { style: { display: 'flex', flexDirection: 'column' } },
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
                        alignSlef: 'flex-start',
                        maxWidth: '70%',
                        padding: 5,
                        paddingLeft: 13,
                        paddingRight: 13,
                        borderRadius: 20,
                        margin: 5
                    };

                    var theStyle = item.type == 'to' ? toStyle : fromStyle;

                    return React.createElement(
                        'div',
                        { className: 'message-bubble' },
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

var ListMessagesScreen = function (_React$Component3) {
    _inherits(ListMessagesScreen, _React$Component3);

    function ListMessagesScreen(props) {
        _classCallCheck(this, ListMessagesScreen);

        var _this7 = _possibleConstructorReturn(this, (ListMessagesScreen.__proto__ || Object.getPrototypeOf(ListMessagesScreen)).call(this, props));

        _this7.state = {
            loadingSearch: false,
            searchResult: null,
            loadingMessages: false,
            messages: []
        };

        _this7.onSearch = _this7.onSearch.bind(_this7);
        _this7.onStudentSelected = _this7.onStudentSelected.bind(_this7);
        return _this7;
    }

    _createClass(ListMessagesScreen, [{
        key: 'onSearch',
        value: function onSearch(value, e) {
            var _this8 = this;

            if (value == '') return;

            this.setState({
                loadingSearch: true
            });

            firebase.functions().httpsCallable('getTutorByEmail')({
                email: value
            }).then(function (result) {

                _this8.setState({
                    loadingSearch: false,
                    searchResult: result.data
                });
            }).catch(function (error) {
                _this8.setState({
                    loadingSearch: false
                });

                message.error('We Couldn\'t Find That User');
            });
        }
    }, {
        key: 'onStudentSelected',
        value: function onStudentSelected(e) {
            var _this9 = this;

            var index = e.key;

            //Get the student
            var student = this.state.searchResult.students[index];

            this.setState({
                loadingMessages: true
            });

            firebase.functions().httpsCallable('listMessages')({
                tutorId: this.state.searchResult.id,
                studentId: student.id
            }).then(function (result) {

                _this9.setState({
                    loadingMessages: false,
                    messages: result.data.messages.map(function (message) {
                        return Object.assign({}, message, { type: message.to == _this9.state.searchResult.students[index].phone ? 'to' : 'from' });
                    })
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                null,
                React.createElement(
                    Title,
                    null,
                    'Find a Tutor'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(Input.Search, { allowClear: true, placeholder: 'Enter an email...', onSearch: this.onSearch, loading: this.state.loadingSearch })
                ),
                this.state.searchResult && React.createElement(
                    'div',
                    { style: { background: '#fff', padding: 20, margin: 10, borderRadius: 10, marginTop: 20 } },
                    React.createElement(
                        Title,
                        { level: 3, style: { marginTop: 10 } },
                        this.state.searchResult.firstname + ' ' + this.state.searchResult.lastname
                    ),
                    React.createElement(Divider, null),
                    this.state.searchResult.students ? React.createElement(
                        Layout,
                        { style: { background: '#fff' } },
                        React.createElement(
                            Sider,
                            { style: { height: '100%', background: '#fff' } },
                            React.createElement(
                                Menu,
                                { theme: 'light', onClick: this.onStudentSelected },
                                this.state.searchResult.students.map(function (student, index) {
                                    return React.createElement(
                                        Menu.Item,
                                        { key: index },
                                        student.firstname + ' ' + student.lastname
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            Layout,
                            { style: { borderRadius: 10, margin: 5, padding: 10 } },
                            React.createElement(
                                Content,
                                null,
                                React.createElement(MessagesDisplay, { messages: this.state.messages, loading: this.state.loadingMessages })
                            )
                        )
                    ) : 'This tutor has no students'
                )
            );
        }
    }]);

    return ListMessagesScreen;
}(React.Component);

var AnnouncementsScreen = function (_React$Component4) {
    _inherits(AnnouncementsScreen, _React$Component4);

    function AnnouncementsScreen(props) {
        _classCallCheck(this, AnnouncementsScreen);

        var _this10 = _possibleConstructorReturn(this, (AnnouncementsScreen.__proto__ || Object.getPrototypeOf(AnnouncementsScreen)).call(this, props));

        _this10.state = {
            loadingFormSubmit: false

            //Bind form submit
        };_this10.onFormSubmit = _this10.onFormSubmit.bind(_this10);
        return _this10;
    }

    _createClass(AnnouncementsScreen, [{
        key: 'onFormSubmit',
        value: function onFormSubmit(values) {
            var _this11 = this;

            //Start loading
            this.setState({
                loadingFormSubmit: true
            });

            //Send those values to firebase
            firebase.functions().httpsCallable('sendAnnouncement')(values).then(function (result) {

                message.success('Announcement Sent!');

                _this11.setState({
                    loadingFormSubmit: false
                });
            }).catch(function (error) {
                console.log(error);
                message.error('Announcement Failed to Send');
                _this11.setState({
                    loadingFormSubmit: false
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                null,
                React.createElement(
                    Title,
                    null,
                    'Announcements'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Title,
                        { level: 3 },
                        'Send an Announcement'
                    ),
                    React.createElement(
                        Form,
                        { name: 'announcement-form', onFinish: this.onFormSubmit, layout: 'vertical' },
                        React.createElement(
                            Form.Item,
                            { name: 'message', label: 'Message', rules: [{ required: true }] },
                            React.createElement(TextArea, { rows: 4 })
                        ),
                        React.createElement(
                            Form.Item,
                            { name: 'segments', label: 'Receiving Groups' },
                            React.createElement(
                                Select,
                                { mode: 'multiple', placeholder: 'Select Groups' },
                                React.createElement(
                                    Option,
                                    { key: 'spanish' },
                                    'Spanish-speaking Families'
                                ),
                                React.createElement(
                                    Option,
                                    { key: 'english' },
                                    'English-speaking Families'
                                ),
                                React.createElement(
                                    Option,
                                    { key: 'tutors' },
                                    'Tutors'
                                )
                            )
                        ),
                        React.createElement(
                            Form.Item,
                            null,
                            React.createElement(
                                Button,
                                { type: 'primary', htmlType: 'submit', loading: this.state.loadingFormSubmit },
                                'Send Announcement'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return AnnouncementsScreen;
}(React.Component);

var tabs = {
    'manage-users': React.createElement(ManageUsersScreen, null),
    'list-messages': React.createElement(ListMessagesScreen, null),
    'announcements': React.createElement(AnnouncementsScreen, null)
};

var AdminPortal = function (_React$Component5) {
    _inherits(AdminPortal, _React$Component5);

    function AdminPortal(props) {
        _classCallCheck(this, AdminPortal);

        var _this12 = _possibleConstructorReturn(this, (AdminPortal.__proto__ || Object.getPrototypeOf(AdminPortal)).call(this, props));

        _this12.state = {
            currentTab: 'manage-users',
            loading: true,
            currentUser: undefined
        };

        _this12.handleMenuOptionSelected = _this12.handleMenuOptionSelected.bind(_this12);
        return _this12;
    }

    _createClass(AdminPortal, [{
        key: 'handleMenuOptionSelected',
        value: function handleMenuOptionSelected(e) {

            this.setState({
                currentTab: e.key
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this13 = this;

            FIREBASE_RUN_ON_READY.push(function (user) {

                firebase.functions().httpsCallable('getUserRoles')().then(function (userRecord) {

                    _this13.state.currentUser = userRecord.data;

                    _this13.setState({
                        loading: false
                    });
                }).catch(function (error) {
                    console.error(error);

                    _this13.setState({
                        loading: false
                    });
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.loading) return React.createElement(Skeleton, { active: true });
            return React.createElement(
                Layout,
                null,
                React.createElement(
                    Header,
                    { style: { background: '#fff', padding: 10, height: 100, boxShadow: '0px 3px 3px #ddd', zIndex: 10, position: 'fixed', width: '100%' } },
                    React.createElement('img', { src: 'https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng', width: '180px', style: { margin: 10 } })
                ),
                React.createElement(
                    Layout,
                    null,
                    React.createElement(
                        Sider,
                        { theme: 'light', style: {
                                overflow: 'auto',
                                height: '100vh',
                                left: 0,
                                marginTop: 100
                            }, collapsible: true },
                        this.state.currentUser && React.createElement(
                            Menu,
                            { mode: 'inline', onClick: this.handleMenuOptionSelected, defaultSelectedKeys: [this.state.currentTab] },
                            this.state.currentUser.roles.includes('admin') && React.createElement(
                                Menu.Item,
                                { icon: React.createElement(UserOutlined, null), key: 'manage-users' },
                                'Manage Users'
                            ),
                            this.state.currentUser.roles.includes('admin') && React.createElement(
                                Menu.Item,
                                { icon: React.createElement(MessageOutlined, null), key: 'list-messages' },
                                'View Messages'
                            ),
                            (this.state.currentUser.roles.includes('announcer') || this.state.currentUser.roles.includes('admin')) && React.createElement(
                                Menu.Item,
                                { icon: React.createElement(NotificationOutlined, null), key: 'announcements' },
                                'Announcements'
                            )
                        )
                    ),
                    React.createElement(
                        Layout,
                        { style: { marginTop: 100, background: '#f0f2f5', minHeight: '100vh' } },
                        React.createElement(
                            Content,
                            { style: { margin: 20, background: '#f0f2f5' } },
                            tabs[this.state.currentTab]
                        )
                    )
                )
            );
        }
    }]);

    return AdminPortal;
}(React.Component);

ReactDOM.render(React.createElement(AdminPortal, null), mountNode);