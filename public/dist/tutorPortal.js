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
var Title = Typography.Title;


var EMULATOR = window.location.href.includes('localhost');

var TutorPortal = function (_React$Component) {
    _inherits(TutorPortal, _React$Component);

    function TutorPortal(props) {
        _classCallCheck(this, TutorPortal);

        return _possibleConstructorReturn(this, (TutorPortal.__proto__ || Object.getPrototypeOf(TutorPortal)).call(this, props));
    }

    _createClass(TutorPortal, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                'Hi'
            );
        }
    }]);

    return TutorPortal;
}(React.Component);

ReactDOM.render(React.createElement(TutorPortal, null), mountNode);