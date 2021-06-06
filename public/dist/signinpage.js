var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//The node to mount on
var mountNode = document.getElementById('signin-form');

var _antd = antd,
    Form = _antd.Form,
    Input = _antd.Input,
    Button = _antd.Button,
    Typography = _antd.Typography,
    message = _antd.message;
var Title = Typography.Title;


var EMULATOR = window.location.href.includes('localhost');

var SignInPage = function (_React$Component) {
    _inherits(SignInPage, _React$Component);

    function SignInPage(props) {
        _classCallCheck(this, SignInPage);

        var _this = _possibleConstructorReturn(this, (SignInPage.__proto__ || Object.getPrototypeOf(SignInPage)).call(this, props));

        _this.state = {
            hasSentEmail: false,
            loadingButton: false
        };

        _this.onFormSubmit = _this.onFormSubmit.bind(_this);
        return _this;
    }

    _createClass(SignInPage, [{
        key: 'onFormSubmit',
        value: function onFormSubmit(values) {
            var _this2 = this;

            //Get the URL parameters
            var urlParams = new URLSearchParams(window.location.search);

            //Get the return URL if it exists
            var returnUrl = urlParams.get('returnUrl') || (EMULATOR ? 'http://localhost:5000/' : 'https://stepuptutoring.org/onboarding-dashboard');

            //Start the button loading
            this.setState({
                loadingButton: true
            });

            firebase.auth().sendSignInLinkToEmail(values['email'], {
                url: returnUrl,
                handleCodeInApp: true
            }).then(function () {

                //Stop loading
                _this2.setState({ loadingButton: false, hasSentEmail: true });

                window.localStorage.setItem('emailForSignIn', values['email']);
            }).catch(function (error) {

                //Stop loading
                _this2.setState({ loadingButton: false });

                //Send an error message
                message.error('Something went wrong. Please try again at another time.');
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.hasSentEmail) {
                return React.createElement(
                    Title,
                    null,
                    'We\'ve sent you a sign in email link. Check your inbox!'
                );
            }

            return React.createElement(
                Form,
                { name: 'basic', layout: 'vertical', onFinish: this.onFormSubmit },
                React.createElement(
                    Form.Item,
                    { label: 'Email', name: 'email', rules: [{ required: true, type: 'email' }] },
                    React.createElement(Input, null)
                ),
                React.createElement(
                    Form.Item,
                    null,
                    React.createElement(
                        Button,
                        { type: 'primary', htmlType: 'submit', loading: this.state.loadingButton },
                        'Submit'
                    )
                )
            );
        }
    }]);

    return SignInPage;
}(React.Component);

ReactDOM.render(React.createElement(SignInPage, null), mountNode);