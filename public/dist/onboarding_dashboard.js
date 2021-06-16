var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//The node to mount on
var mountNode = document.getElementById('content');

var _antd = antd,
    Layout = _antd.Layout,
    Avatar = _antd.Avatar,
    Typography = _antd.Typography,
    Tabs = _antd.Tabs,
    Steps = _antd.Steps,
    Popover = _antd.Popover;
var Step = Steps.Step;
var Title = Typography.Title,
    Link = Typography.Link;
var TabPane = Tabs.TabPane;
var _icons = icons,
    HomeOutlined = _icons.HomeOutlined,
    SolutionOutlined = _icons.SolutionOutlined,
    BookOutlined = _icons.BookOutlined,
    CalendarFilled = _icons.CalendarFilled,
    SecurityScanOutlined = _icons.SecurityScanOutlined,
    RocketOutlined = _icons.RocketOutlined,
    CommentOutlined = _icons.CommentOutlined,
    UserOutlined = _icons.UserOutlined,
    QuestionCircleOutlined = _icons.QuestionCircleOutlined;
var Sider = Layout.Sider,
    Content = Layout.Content,
    Footer = Layout.Footer;


var EMULATOR = window.location.href.includes('localhost');

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001);

var SidebarItem = function (_React$Component) {
    _inherits(SidebarItem, _React$Component);

    function SidebarItem(props) {
        _classCallCheck(this, SidebarItem);

        var _this = _possibleConstructorReturn(this, (SidebarItem.__proto__ || Object.getPrototypeOf(SidebarItem)).call(this, props));

        _this.handleOnClick = _this.handleOnClick.bind(_this);
        return _this;
    }

    _createClass(SidebarItem, [{
        key: 'handleOnClick',
        value: function handleOnClick() {

            if (!this.props.disabled && !this.props.complete) {
                this.props.onClick(this.props.keyId);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { onClick: this.handleOnClick, className: '' + (this.props.active ? 'active ' : '') + (this.props.disabled || this.props.complete ? 'disabled ' : '') + (this.props.isStep ? 'step ' : '') + (this.props.isSubItem ? 'subitem ' : '') + (this.props.isMainItem ? 'main-item ' : '') + (this.props.complete ? 'complete ' : '') },
                this.props.icon && this.props.icon,
                ' ',
                this.props.children
            );
        }
    }]);

    return SidebarItem;
}(React.Component);

var Empty = function (_React$Component2) {
    _inherits(Empty, _React$Component2);

    function Empty(props) {
        _classCallCheck(this, Empty);

        return _possibleConstructorReturn(this, (Empty.__proto__ || Object.getPrototypeOf(Empty)).call(this, props));
    }

    _createClass(Empty, [{
        key: 'render',
        value: function render() {
            return React.createElement('div', null);
        }
    }]);

    return Empty;
}(React.Component);

var UserItem = function (_React$Component3) {
    _inherits(UserItem, _React$Component3);

    function UserItem(props) {
        _classCallCheck(this, UserItem);

        var _this3 = _possibleConstructorReturn(this, (UserItem.__proto__ || Object.getPrototypeOf(UserItem)).call(this, props));

        _this3.onSignOut = _this3.onSignOut.bind(_this3);
        return _this3;
    }

    _createClass(UserItem, [{
        key: 'onSignOut',
        value: function onSignOut() {

            SIGN_OUT_FIREBASE();
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        Link,
                        null,
                        'Change Email'
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        Link,
                        { onClick: this.onSignOut },
                        'Log Out'
                    )
                )
            );
        }
    }]);

    return UserItem;
}(React.Component);

var OnboardingPortal = function (_React$Component4) {
    _inherits(OnboardingPortal, _React$Component4);

    function OnboardingPortal(props) {
        _classCallCheck(this, OnboardingPortal);

        var _this4 = _possibleConstructorReturn(this, (OnboardingPortal.__proto__ || Object.getPrototypeOf(OnboardingPortal)).call(this, props));

        _this4.state = {

            tutor: {},
            pages: {
                'home': Home
            },
            sidebarItems: [{
                keyId: 'home',
                icon: React.createElement(HomeOutlined, null),
                title: 'Dashboard',
                active: true,
                disabled: false,
                isSteps: true,
                subItems: [{
                    keyId: 'chat-signup',
                    icon: React.createElement(CommentOutlined, null),
                    title: 'Chat Signup',
                    active: false,
                    disabled: false,
                    complete: true
                }, {
                    keyId: 'waiver',
                    icon: React.createElement(SolutionOutlined, null),
                    title: 'Waiver',
                    active: false,
                    disabled: false,
                    complete: false
                }, {
                    keyId: 'workbook',
                    icon: React.createElement(BookOutlined, null),
                    title: 'Workbook',
                    active: false,
                    disabled: false,
                    complete: false
                }, {
                    keyId: 'livescan',
                    icon: React.createElement(SecurityScanOutlined, null),
                    title: 'Background Check',
                    active: false,
                    disabled: true,
                    complete: false
                }, {
                    keyId: 'live-training',
                    icon: React.createElement(RocketOutlined, null),
                    title: 'Live Training',
                    active: false,
                    disabled: true,
                    complete: false
                }]
            }, {
                keyId: 'support',
                icon: React.createElement(QuestionCircleOutlined, null),
                title: 'Support',
                active: false,
                disabled: false,
                subItems: [{
                    keyId: 'faq',
                    title: 'FAQ',
                    active: false,
                    disabled: false
                }, {
                    keyId: 'tutor-resources',
                    title: 'Tutor Resources',
                    active: false,
                    disabled: false
                }, {
                    keyId: 'office-hours',
                    title: 'Sign up for office hours',
                    active: false,
                    disabled: false
                }, {
                    keyId: 'contact',
                    title: 'Contact Laura',
                    active: false,
                    disabled: false
                }]
            }],
            currentTab: 'home',
            loadingUser: true

        };

        _this4.onSideBarItemClicked = _this4.onSideBarItemClicked.bind(_this4);
        _this4.onUserFinishedLoading = _this4.onUserFinishedLoading.bind(_this4);
        _this4.loadUser = _this4.loadUser.bind(_this4);

        return _this4;
    }

    _createClass(OnboardingPortal, [{
        key: 'onSideBarItemClicked',
        value: function onSideBarItemClicked(key) {

            var sidebarItems = this.state.sidebarItems;

            for (var i = 0; i < sidebarItems.length; i++) {
                if (sidebarItems[i]['keyId'] == key) sidebarItems[i]['active'] = true;else sidebarItems[i]['active'] = false;
            }

            console.log(sidebarItems);

            this.setState({ currentTab: key, sidebarItems: sidebarItems });
        }
    }, {
        key: 'onUserFinishedLoading',
        value: function onUserFinishedLoading(user) {

            this.setState({
                loadingUser: false,
                tutor: user
            });
        }
    }, {
        key: 'loadUser',
        value: function loadUser() {
            var _this5 = this;

            firebase.functions().httpsCallable('getTutor')().then(function (result) {

                _this5.onUserFinishedLoading(result.data);
            }).catch(function (error) {

                //TODO

            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this6 = this;

            FIREBASE_RUN_ON_READY.push(function (user) {

                _this6.loadUser();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

            var CurrentPage = this.state.pages[this.state.currentTab] || Empty;

            return React.createElement(
                Layout,
                { style: { height: '100%' }, className: 'desktop-dashboard' },
                React.createElement(
                    Sider,
                    { theme: 'light', 'class': 'dashboard-sidebar', breakpoint: 'sm', collapsedWidth: '0', collapsible: true },
                    React.createElement(
                        'div',
                        { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
                        React.createElement(
                            'div',
                            { 'class': 'sidebar-header' },
                            React.createElement('img', { width: 180, src: 'https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng' })
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'sidebar-options' },
                            this.state.sidebarItems.map(function (item) {

                                return React.createElement(
                                    'div',
                                    null,
                                    React.createElement(
                                        SidebarItem,
                                        { isMainItem: true, keyId: item.keyId, icon: item.icon, active: item.active, disabled: item.disabled, onClick: _this7.onSideBarItemClicked },
                                        item.title
                                    ),
                                    item.isSteps && React.createElement(
                                        Steps,
                                        { direction: 'vertical', size: 'small', className: 'subitem' },
                                        item.subItems && item.subItems.map(function (subItem) {

                                            return React.createElement(Step, { status: subItem.complete ? 'finish' : undefined, title: React.createElement(
                                                    SidebarItem,
                                                    { complete: subItem.complete, isStep: true, keyId: subItem.keyId, icon: subItem.icon, active: subItem.active, disabled: subItem.disabled, onClick: _this7.onSideBarItemClicked },
                                                    subItem.title
                                                ) });
                                        })
                                    ),
                                    !item.isSteps && React.createElement(
                                        'div',
                                        null,
                                        item.subItems && item.subItems.map(function (subItem) {
                                            return React.createElement(
                                                SidebarItem,
                                                { isSubItem: true, keyId: subItem.keyId, icon: subItem.icon, active: subItem.active, disabled: subItem.disabled, onClick: _this7.onSideBarItemClicked },
                                                subItem.title
                                            );
                                        })
                                    )
                                );
                            })
                        ),
                        React.createElement('div', { 'class': 'sidebar-spacer', style: { flex: 1 } }),
                        React.createElement(
                            'div',
                            { 'class': 'sidebar-footer', style: { marginBottom: 50 } },
                            !this.state.loadingUser && React.createElement(
                                Popover,
                                { content: React.createElement(UserItem, null), title: 'User Options', trigger: 'click' },
                                React.createElement(
                                    'span',
                                    { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, className: 'hoverable' },
                                    React.createElement(Avatar, { size: 'large', icon: React.createElement(UserOutlined, null) }),
                                    this.state.tutor.firstname + ' ' + this.state.tutor.lastname
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    Layout,
                    null,
                    React.createElement(
                        Layout,
                        { style: { backgroundColor: 'white' } },
                        React.createElement(
                            Content,
                            { className: 'content-container' },
                            React.createElement(
                                'div',
                                { className: 'main-content' },
                                this.state.loadingUser && React.createElement(Skeleton, { active: true }),
                                !this.state.loadingUser && React.createElement(CurrentPage, { tutor: this.state.tutor })
                            )
                        )
                    ),
                    window.matchMedia('screen and (max-width: 500px)').matches && React.createElement(
                        Footer,
                        { style: { backgroundColor: 'white' } },
                        React.createElement(
                            Tabs,
                            null,
                            React.createElement(TabPane, { tab: 'Dashboard' })
                        )
                    )
                )
            );
        }
    }]);

    return OnboardingPortal;
}(React.Component);

ReactDOM.render(React.createElement(OnboardingPortal, null), mountNode);