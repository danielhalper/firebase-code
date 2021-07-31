var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _icons = icons,
    CloseOutlined = _icons.CloseOutlined;

var Modal = function (_React$Component) {
    _inherits(Modal, _React$Component);

    function Modal(props) {
        _classCallCheck(this, Modal);

        return _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, props));
    }

    _createClass(Modal, [{
        key: "render",
        value: function render() {
            if (this.props.display) {
                return React.createElement(
                    "div",
                    { className: "overlay" },
                    React.createElement(
                        "div",
                        { className: "modal" },
                        React.createElement(
                            "div",
                            { className: "modal-header", style: { display: "flex", flexDirection: "row", marginBottom: 10 } },
                            React.createElement("div", { style: { width: 40 } }),
                            React.createElement("div", { style: { flex: 1 } }),
                            React.createElement(
                                "h1",
                                { className: "modal-title" },
                                this.props.title
                            ),
                            React.createElement("div", { style: { flex: 1 } }),
                            React.createElement(
                                "button",
                                { className: "modal-exit", onClick: this.props.onClose },
                                React.createElement(CloseOutlined, null)
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "modal-content", style: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" } },
                            this.props.children
                        ),
                        React.createElement(
                            "div",
                            { className: "modal-footer", style: { display: "flex", flexDirection: "row" } },
                            this.props.options.submit && React.createElement(
                                "button",
                                { className: "modal-submit" },
                                this.props.options.submit || "Submit"
                            )
                        )
                    )
                );
            }
            return React.createElement("div", null);
        }
    }]);

    return Modal;
}(React.Component);

var TutorHome = function (_React$Component2) {
    _inherits(TutorHome, _React$Component2);

    function TutorHome(props) {
        _classCallCheck(this, TutorHome);

        var _this2 = _possibleConstructorReturn(this, (TutorHome.__proto__ || Object.getPrototypeOf(TutorHome)).call(this, props));

        _this2.students = {};

        _this2.state = {
            student: _this2.props.tutor.students[0],
            zoomLinks: {},
            modals: {
                'zoom': false
            }
        };

        for (var i = 0; i < _this2.props.tutor.students.length; i++) {

            _this2.students[_this2.props.tutor.students[i].id] = _this2.props.tutor.students[i];
        }
        return _this2;
    }

    _createClass(TutorHome, [{
        key: "retrieveZoomLinks",
        value: function retrieveZoomLinks() {
            var _this3 = this;

            firebase.functions().httpsCallable('getZoomLinks')().then(function (result) {
                _this3.setState({
                    zoomLinks: result.data
                });
            }).catch(console.log);
        }
    }, {
        key: "displayModal",
        value: function displayModal(id) {
            var modalsCopy = this.state.modals;

            modalsCopy[id] = true;

            this.setState({
                modals: modalsCopy
            });
        }
    }, {
        key: "onModalClose",
        value: function onModalClose(id) {
            var modalsCopy = this.state.modals;

            modalsCopy[id] = false;

            this.setState({
                modals: modalsCopy
            });
        }
    }, {
        key: "copyLink",
        value: function copyLink(link) {
            var el = document.createElement('textarea');
            el.value = link;
            el.setAttribute('readonly', '');
            el.style = { position: 'absolute', left: '-9999px' };
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            this.retrieveZoomLinks();
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
                            _this4.setState({ student: _this4.students[activeKey] });
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
                        { link: "#messaging", icon: React.createElement(SolutionOutlined, null), title: "Message Students" },
                        "Communicate with your student through texting with our online messaging application."
                    ),
                    React.createElement(
                        RequiredItem,
                        { onClick: function onClick() {
                                return _this4.displayModal('zoom');
                            }, icon: React.createElement(SolutionOutlined, null), title: "Start Zoom Meeting" },
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
                ),
                React.createElement(
                    "div",
                    { className: "modal-container" },
                    React.createElement(
                        Modal,
                        { title: "Start Zoom Meeting", display: this.state.modals.zoom, options: { submit: false }, onClose: function onClose() {
                                return _this4.onModalClose('zoom');
                            } },
                        React.createElement(
                            "div",
                            { style: { width: '70%' } },
                            "Use the button below to start a video call with your student! They can use the same link to join each time, and if they're having trouble finding it you can copy it below and send it to them!"
                        ),
                        React.createElement(
                            "button",
                            { className: "modal-submit", style: { marginBottom: 20, marginTop: 20 } },
                            "Start Meeting"
                        ),
                        React.createElement(
                            "div",
                            { style: { position: 'relative', width: '70%', height: 40 } },
                            React.createElement(
                                "div",
                                { className: "zoom-invite-link", style: { position: 'absolute', width: '100%' } },
                                "https://www.example.com/example?example_key=1234567890987654321234567890"
                            ),
                            React.createElement(
                                "div",
                                { style: { display: 'flex', flexDirection: 'row', position: 'absolute', width: '100%' }, className: "copy-link-gradient" },
                                React.createElement("div", { style: { flex: 1 } }),
                                React.createElement(
                                    "button",
                                    { className: "copy-link", onClick: function onClick() {
                                            return _this4.copyLink("https://www.example.com/example?example_key=1234567890987654321234567890");
                                        } },
                                    "Copy"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return TutorHome;
}(React.Component);