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
    Tabs = _antd.Tabs;
var Title = Typography.Title;
var TabPane = Tabs.TabPane;
var _icons = icons,
    HomeOutlined = _icons.HomeOutlined,
    SolutionOutlined = _icons.SolutionOutlined,
    BookOutlined = _icons.BookOutlined,
    CalendarFilled = _icons.CalendarFilled,
    SecurityScanOutlined = _icons.SecurityScanOutlined,
    RocketOutlined = _icons.RocketOutlined,
    CommentOutlined = _icons.CommentOutlined,
    UserOutlined = _icons.UserOutlined;
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

            if (!this.props.disabled) {
                this.props.onClick(this.props.keyId);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { onClick: this.handleOnClick, 'class': (this.props.active ? 'active' : '') + ' ' + (this.props.disabled ? 'disabled' : '') },
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

var OnboardingPortal = function (_React$Component3) {
    _inherits(OnboardingPortal, _React$Component3);

    function OnboardingPortal(props) {
        _classCallCheck(this, OnboardingPortal);

        var _this3 = _possibleConstructorReturn(this, (OnboardingPortal.__proto__ || Object.getPrototypeOf(OnboardingPortal)).call(this, props));

        _this3.state = {

            tutor: {},
            pages: {
                'home': Home
            },
            currentTab: 'home',
            loadingUser: true

        };

        _this3.onSideBarItemClicked = _this3.onSideBarItemClicked.bind(_this3);
        _this3.onUserFinishedLoading = _this3.onUserFinishedLoading.bind(_this3);
        _this3.loadUser = _this3.loadUser.bind(_this3);

        return _this3;
    }

    _createClass(OnboardingPortal, [{
        key: 'onSideBarItemClicked',
        value: function onSideBarItemClicked(key) {

            this.setState({ currentTab: key });
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
            var _this4 = this;

            firebase.functions().httpsCallable('getTutor')().then(function (result) {

                _this4.onUserFinishedLoading(result.data);
            }).catch(function (error) {

                //TODO

            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this5 = this;

            FIREBASE_RUN_ON_READY.push(function (user) {

                _this5.loadUser();
            });
        }
    }, {
        key: 'render',
        value: function render() {

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
                            React.createElement(
                                SidebarItem,
                                { keyId: 'home', icon: React.createElement(HomeOutlined, null), active: true, onClick: this.onSideBarItemClicked },
                                'Dashboard'
                            ),
                            React.createElement(
                                SidebarItem,
                                { keyId: 'chat-signup', icon: React.createElement(CommentOutlined, null), onClick: this.onSideBarItemClicked },
                                'Chat Signup'
                            ),
                            React.createElement(
                                SidebarItem,
                                { keyId: 'waiver', icon: React.createElement(SolutionOutlined, null), onClick: this.onSideBarItemClicked },
                                'Waiver'
                            ),
                            React.createElement(
                                SidebarItem,
                                { keyId: 'workbook', icon: React.createElement(BookOutlined, null), onClick: this.onSideBarItemClicked },
                                'Workbook'
                            ),
                            React.createElement(
                                SidebarItem,
                                { keyId: 'livescan', icon: React.createElement(SecurityScanOutlined, null), disabled: true, onClick: this.onSideBarItemClicked },
                                'Background Check'
                            ),
                            React.createElement(
                                SidebarItem,
                                { keyId: 'live-training', icon: React.createElement(RocketOutlined, null), disabled: true, onClick: this.onSideBarItemClicked },
                                'Live Training'
                            )
                        ),
                        React.createElement('div', { 'class': 'sidebar-spacer', style: { flex: 1 } }),
                        React.createElement(
                            'div',
                            { 'class': 'sidebar-footer', style: { marginBottom: 50 } },
                            !this.state.loadingUser && React.createElement(
                                'span',
                                { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                                React.createElement(Avatar, { size: 'large', icon: React.createElement(UserOutlined, null) }),
                                this.state.tutor.firstname + ' ' + this.state.tutor.lastname
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