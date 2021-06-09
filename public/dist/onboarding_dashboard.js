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

var OnboardingPortal = function (_React$Component) {
    _inherits(OnboardingPortal, _React$Component);

    function OnboardingPortal(props) {
        _classCallCheck(this, OnboardingPortal);

        var _this = _possibleConstructorReturn(this, (OnboardingPortal.__proto__ || Object.getPrototypeOf(OnboardingPortal)).call(this, props));

        _this.state = {

            tutor: {}

        };

        return _this;
    }

    _createClass(OnboardingPortal, [{
        key: 'render',
        value: function render() {

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
                                'div',
                                { 'class': 'active' },
                                React.createElement(HomeOutlined, null),
                                ' Dashboard'
                            ),
                            React.createElement(
                                'div',
                                null,
                                React.createElement(CommentOutlined, null),
                                'Chat Signup'
                            ),
                            React.createElement(
                                'div',
                                null,
                                React.createElement(SolutionOutlined, null),
                                'Waiver'
                            ),
                            React.createElement(
                                'div',
                                null,
                                React.createElement(BookOutlined, null),
                                'Workbook'
                            ),
                            React.createElement(
                                'div',
                                { 'class': 'disabled' },
                                React.createElement(SecurityScanOutlined, null),
                                'Background Check'
                            ),
                            React.createElement(
                                'div',
                                { 'class': 'disabled' },
                                React.createElement(RocketOutlined, null),
                                'Live Training'
                            )
                        ),
                        React.createElement('div', { 'class': 'sidebar-spacer', style: { flex: 1 } }),
                        React.createElement(
                            'div',
                            { 'class': 'sidebar-footer', style: { marginBottom: 50 } },
                            React.createElement(
                                'span',
                                { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                                React.createElement(Avatar, { size: 'large', icon: React.createElement(UserOutlined, null) }),
                                this.state.tutor.firstName + ' ' + this.state.tutor.lastName
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
                        React.createElement(Content, { className: 'main-content' })
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