var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//The node to mount on
var mountNode = document.getElementById('portal');

var _antd = antd,
    Form = _antd.Form,
    Input = _antd.Input,
    Button = _antd.Button,
    Typography = _antd.Typography,
    message = _antd.message;
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
var Title = Typography.Title;


var EMULATOR = window.location.href.includes('localhost');

var TutorMessaging = function (_React$Component) {
    _inherits(TutorMessaging, _React$Component);

    function TutorMessaging(props) {
        _classCallCheck(this, TutorMessaging);

        return _possibleConstructorReturn(this, (TutorMessaging.__proto__ || Object.getPrototypeOf(TutorMessaging)).call(this, props));
    }

    _createClass(TutorMessaging, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(MessagingWidget, { height: 500, tutor: this.props.tutor })
            );
        }
    }]);

    return TutorMessaging;
}(React.Component);

var pages = {
    'home': TutorHome,
    'messaging': TutorMessaging
};

var sidebarItems = [{
    keyId: 'home',
    icon: React.createElement(HomeOutlined, null),
    title: 'Dashboard',
    active: true,
    disabled: false,
    isSteps: false,
    subItems: [{
        keyId: 'messaging',
        icon: React.createElement(CommentOutlined, null),
        title: 'Message Students',
        active: false,
        disabled: false,
        complete: false
    }]
}];

ReactDOM.render(React.createElement(SidebarLayout, { pages: pages, sidebarItems: sidebarItems, currentTab: 'home' }), mountNode);