var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _antd = antd,
    Row = _antd.Row,
    Col = _antd.Col;

var Waiver = function (_React$Component) {
  _inherits(Waiver, _React$Component);

  function Waiver() {
    _classCallCheck(this, Waiver);

    return _possibleConstructorReturn(this, (Waiver.__proto__ || Object.getPrototypeOf(Waiver)).apply(this, arguments));
  }

  _createClass(Waiver, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var script = document.createElement("script");
      script.src = "https://paperform.co/__embed.min.js";
      document.body.appendChild(script);
    }
  }, {
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
          "The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring. It outlines the tutor code of conduct, and responsibilities & expectations for our volunteer tutors. "
        ),
        React.createElement(
          Row,
          null,
          React.createElement(
            Col,
            { xs: 24 },
            React.createElement("div", { "data-paperform-id": "tqp1uzj8" })
          )
        )
      );
    }
  }]);

  return Waiver;
}(React.Component);