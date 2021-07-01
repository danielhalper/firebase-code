var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _antd = antd,
    Row = _antd.Row,
    Col = _antd.Col;

var ChatSignup = function (_React$Component) {
  _inherits(ChatSignup, _React$Component);

  function ChatSignup() {
    _classCallCheck(this, ChatSignup);

    return _possibleConstructorReturn(this, (ChatSignup.__proto__ || Object.getPrototypeOf(ChatSignup)).apply(this, arguments));
  }

  _createClass(ChatSignup, [{
    key: "render",
    value: function render() {
      // no scroll
      //class="select-item-box select-item " use display:none to hide duplicate info
      //center form
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "hi there"
        ),
        React.createElement(
          "p",
          null,
          "We want to keep it casual, ask a few questions, and get to know you better!"
        ),
        React.createElement(
          "p",
          null,
          "All meetings with us are via Zoom, be on the lookout for the link in your confirmation email."
        ),
        React.createElement(
          "p",
          null,
          "If you need assistance, please reach out to our Onboarding Specialist at laura@stepuptutoring.org or (205) 953-1894. If you have already signed up or completed session, please disregard."
        ),
        React.createElement(
          Row,
          null,
          React.createElement(
            Col,
            { xs: 24 },
            React.createElement("iframe", { src: "https://app.acuityscheduling.com/schedule.php?owner=21394641&appointmentType=19663042", title: "Schedule Appointment", width: "90%", height: "800", frameBorder: "0" }),
            React.createElement("script", { src: "https://embed.acuityscheduling.com/js/embed.js", type: "text/javascript" })
          )
        )
      );
    }
  }]);

  return ChatSignup;
}(React.Component);