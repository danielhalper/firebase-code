var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _antd = antd,
    Tabs = _antd.Tabs;
var TabPane = Tabs.TabPane;

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
                    { style: { float: "left", width: "200px", height: "150px" } },
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
// Information Bar Component


var InformationBar = function (_React$Component2) {
    _inherits(InformationBar, _React$Component2);

    function InformationBar(props) {
        _classCallCheck(this, InformationBar);

        return _possibleConstructorReturn(this, (InformationBar.__proto__ || Object.getPrototypeOf(InformationBar)).call(this, props));
    }

    _createClass(InformationBar, [{
        key: 'render',
        value: function render() {
            var info = this.props.info.map(function (info) {
                return React.createElement(
                    'div',
                    { className: 'info-item', key: info.id },
                    React.createElement(
                        'p',
                        { className: 'info-label' },
                        info.label
                    ),
                    React.createElement(
                        'h1',
                        { className: 'info-value' },
                        info.value
                    )
                );
            });
            return React.createElement(
                'div',
                { className: 'info-bar' },
                info
            );
        }
    }]);

    return InformationBar;
}(React.Component);
// Student Widget Component


var StudentWidget = function (_React$Component3) {
    _inherits(StudentWidget, _React$Component3);

    function StudentWidget(props) {
        _classCallCheck(this, StudentWidget);

        return _possibleConstructorReturn(this, (StudentWidget.__proto__ || Object.getPrototypeOf(StudentWidget)).call(this, props));
    }

    _createClass(StudentWidget, [{
        key: 'render',
        value: function render() {
            var students = this.props.students.map(function (student) {
                return React.createElement(TabPane, { key: student.id, tab: student.firstname + " " + student.lastname });
            });

            return React.createElement(
                Tabs,
                { onChange: this.props.onTabChange },
                students
            );
        }
    }]);

    return StudentWidget;
}(React.Component);