var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TutorHome = function (_React$Component) {
    _inherits(TutorHome, _React$Component);

    function TutorHome(props) {
        _classCallCheck(this, TutorHome);

        return _possibleConstructorReturn(this, (TutorHome.__proto__ || Object.getPrototypeOf(TutorHome)).call(this, props));
    }

    _createClass(TutorHome, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { style: { display: "flex", width: "100%" } },
                React.createElement(
                    "div",
                    { style: { display: "flex", flexDirection: "row", flex: 1 } },
                    React.createElement("div", { style: { flex: 1 } }),
                    React.createElement(InformationBar, { info: [{
                            label: "Total Sessions",
                            id: "total_sessions",
                            type: "number",
                            value: 7
                        }, {
                            label: "Minutes Tutored",
                            id: "minutes_tutored",
                            type: "number",
                            value: 323
                        }, {
                            label: "Last Session",
                            id: "last_session",
                            type: "string",
                            value: "7/1/21"
                        }] }),
                    React.createElement("div", { style: { flex: 1 } })
                ),
                React.createElement(
                    "a",
                    { href: "#messaging" },
                    "Messaging"
                )
            );
        }
    }]);

    return TutorHome;
}(React.Component);