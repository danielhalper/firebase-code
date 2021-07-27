var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TutorHome = function (_React$Component) {
    _inherits(TutorHome, _React$Component);

    function TutorHome(props) {
        _classCallCheck(this, TutorHome);

        var _this = _possibleConstructorReturn(this, (TutorHome.__proto__ || Object.getPrototypeOf(TutorHome)).call(this, props));

        _this.students = {};
        _this.state = { student: _this.props.tutor.students[0] };
        for (var i = 0; i < _this.props.tutor.students.length; i++) {
            _this.students[_this.props.tutor.students[i].id] = _this.props.tutor.students[i];
        }
        return _this;
    }

    _createClass(TutorHome, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { style: { display: "flex", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" } },
                React.createElement(
                    "h1",
                    { className: "title" },
                    "Tutor Dashboard"
                ),
                React.createElement(
                    "div",
                    { style: { marginBottom: 20 } },
                    React.createElement(StudentWidget, { students: this.props.tutor.students, onTabChange: function onTabChange(activeKey) {
                            _this2.setState({ student: _this2.students[activeKey] });
                        } })
                ),
                React.createElement(
                    "div",
                    { style: { display: "flex", flexDirection: "row", flex: 1, marginBottom: 20 } },
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
                    "div",
                    { style: { display: "flex", flexDirection: "row", flex: 1, marginBottom: 20 } },
                    React.createElement(
                        RequiredItem,
                        { link: "undefined", icon: React.createElement(SolutionOutlined, null), title: "Message Students" },
                        "Communicate with your student through texting with our online messaging application."
                    ),
                    React.createElement(
                        RequiredItem,
                        { link: "undefined", icon: React.createElement(SolutionOutlined, null), title: "Start Zoom Meeting" },
                        "Meet with your student face-to-face over Zoom."
                    ),
                    React.createElement(RequiredItem, { link: "undefined", icon: React.createElement(SolutionOutlined, null), title: "Weekly Resources" })
                ),
                React.createElement(
                    "div",
                    { style: { float: "left", color: "#5A5A5A", borderBottom: "solid #5A5A5A 3px", width: "800px", textAlign: "center", fontSize: "36px", marginBottom: 20 } },
                    React.createElement(
                        "strong",
                        null,
                        "Weekly Action Items"
                    )
                ),
                React.createElement(
                    "div",
                    { style: { display: "flex", flexDirection: "row", flex: 1 } },
                    React.createElement(
                        RequiredItem,
                        { link: "undefined", icon: React.createElement(SolutionOutlined, null), title: "Weekly Form" },
                        "Fill this out each week... so the student's teacher and parent are up-to-date."
                    ),
                    React.createElement(RequiredItem, { link: "undefined", icon: React.createElement(SolutionOutlined, null), title: "Weekly Announcements" }),
                    React.createElement(
                        RequiredItem,
                        { link: "undefined", icon: React.createElement(SolutionOutlined, null), title: "Events & Gamification" },
                        "You should check this page at least once a week to update your student!"
                    )
                )
            );
        }
    }]);

    return TutorHome;
}(React.Component);