var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Workbook = function (_React$Component) {
  _inherits(Workbook, _React$Component);

  function Workbook() {
    _classCallCheck(this, Workbook);

    return _possibleConstructorReturn(this, (Workbook.__proto__ || Object.getPrototypeOf(Workbook)).apply(this, arguments));
  }

  _createClass(Workbook, [{
    key: "render",
    value: function render() {
      var userLocalEmail = getEmailFromLocalStorage();
      var userLocalFirstName = getFirstNameFromLocalStorage();
      var userLocalLastName = getLastNameFromLocalStorage();

      return React.createElement(
        "div",
        { className: "section-content", id: "workbook-section-content" },
        React.createElement(
          "h1",
          { className: "section-header-h1" },
          "Training Modules"
        ),
        React.createElement(
          "h3",
          { className: "section-approx-time" },
          "Approximate time: 1-2 hours"
        ),
        React.createElement(
          "p",
          { className: "section-p" },
          "Please take your time when completing the Step Up workbook. It is essential for...."
        ),
        React.createElement(
          "div",
          { className: "workbook-tab-style" },
          React.createElement(
            Tabs,
            { defaultActiveKey: "1", centered: true, className: "tab-content-style" },
            React.createElement(
              TabPane,
              { tab: "General Expectations", key: "1", forceRender: "true" },
              React.createElement(
                "iframe",
                { src: "https://docs.google.com/forms/d/e/1FAIpQLScN2qPXuWx7PcG4rAPzFUx06M-V5Ahtx0o-ge1L3ifc-9VVFQ/viewform?embedded=true&usp=pp_url&entry.1506871634=" + userLocalFirstName + "%20" + userLocalLastName + "&entry.147453066=" + userLocalEmail, width: "640", height: "3200", frameBorder: "0", marginHeight: "0", marginWidth: "0" },
                "Loading\u2026"
              )
            ),
            React.createElement(
              TabPane,
              { tab: "Sexual Harassment and Boundaries", key: "2", forceRender: "true" },
              React.createElement(
                "iframe",
                { src: "https://docs.google.com/forms/d/e/1FAIpQLSdx3uxtfVJEf8jSs4bXwKUFZp0a5teFBxxs-vwod3koxJ1gbA/viewform?embedded=true&usp=pp_url&entry.1506871634=" + userLocalFirstName + "%20" + userLocalLastName + "&entry.147453066=" + userLocalEmail, width: "640", height: "2100", frameBorder: "0", marginHeight: "0", marginWidth: "0" },
                "Loading\u2026"
              )
            ),
            React.createElement(
              TabPane,
              { tab: "Teaching Math", key: "3", forceRender: "true" },
              React.createElement(
                "iframe",
                { src: "https://docs.google.com/forms/d/e/1FAIpQLSeG5hnnpsDSCjelPD31tm3q8jIxd_AqiphhUpicC_DPvJSZCA/viewform?embedded=true&usp=pp_url&entry.1506871634=" + userLocalFirstName + "%20" + userLocalLastName + "&entry.144716208=" + userLocalEmail, width: "640", height: "2400", frameBorder: "0", marginHeight: "0", marginWidth: "0" },
                "Loading\u2026"
              )
            ),
            React.createElement(
              TabPane,
              { tab: "Teaching Reading", key: "4", forceRender: "true" },
              React.createElement(
                "iframe",
                { src: "https://docs.google.com/forms/d/e/1FAIpQLScewxx296TOYqKFJEPDKKzPi56A-bvKdBoZG3OtDhzAnkMNZQ/viewform?embedded=true&usp=pp_url&entry.1506871634=" + userLocalFirstName + "%20" + userLocalLastName + "&entry.689630015=" + userLocalEmail, width: "640", height: "1550", frameBorder: "0", marginHeight: "0", marginWidth: "0" },
                "Loading\u2026"
              )
            )
          )
        )
      );
    }
  }]);

  return Workbook;
}(React.Component);