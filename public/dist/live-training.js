var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LiveTraining = function (_React$Component) {
  _inherits(LiveTraining, _React$Component);

  function LiveTraining() {
    _classCallCheck(this, LiveTraining);

    return _possibleConstructorReturn(this, (LiveTraining.__proto__ || Object.getPrototypeOf(LiveTraining)).apply(this, arguments));
  }

  _createClass(LiveTraining, [{
    key: "loadDeferredIframe",
    value: function loadDeferredIframe() {
      var userLocalEmail = getEmailFromLocalStorage();
      var userLocalFirstName = getFirstNameFromLocalStorage();
      var userLocalLastName = getLastNameFromLocalStorage();
      var iframe = document.getElementById("deferred-iframe");
      iframe.src = "https://calendly.com/stepup-tut/training?name=" + userLocalFirstName + "%20" + userLocalLastName + "&email=" + userLocalEmail;
      iframe.title = "Schedule Live Training";
      iframe.width = "100%";
      iframe.height = "800";
      iframe.frameBorder = "0";
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadDeferredIframe();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          { className: "section-header-h1" },
          "Live Training"
        ),
        React.createElement(
          "p",
          null,
          "Attend an hour long, live virtual session with one of our coaches where you will find out more about how being a tutor with Step Up works, learn about some fun educational resources to use with your student, and ask any questions you may have. Please sign up for a session with Laura through the calendar below."
        ),
        React.createElement(
          "div",
          { id: "live-training-calendly" },
          React.createElement("iframe", { id: "deferred-iframe", src: "about:blank" }),
          React.createElement("script", { src: "https://assets.calendly.com/assets/external/widget.js", type: "text/javascript" })
        )
      );
    }
  }]);

  return LiveTraining;
}(React.Component);