//The node to mount on
const mountNode = document.getElementById('signin-form');

const { Form, Input, Button, Typography, message } = antd;
const { Title } = Typography;

const EMULATOR = window.location.href.includes('localhost')

class SignInPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hasSentEmail: false,
            loadingButton: false
        }

        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onFormSubmit(values) {

        //Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search)

        //Get the return URL if it exists
        const returnUrl = urlParams.get('returnUrl') || (EMULATOR ? 'http://localhost:5000/' : 'https://stepuptutoring.org/onboarding-dashboard')

        //Start the button loading
        this.setState({
            loadingButton: true
        })

        firebase.auth().sendSignInLinkToEmail(values['email'], {
            url: returnUrl,
            handleCodeInApp: true
        }).then(() => {

            //Stop loading
            this.setState({ loadingButton: false, hasSentEmail: true })

            window.localStorage.setItem('emailForSignIn', values['email'])

        }).catch(error => {

            //Stop loading
            this.setState({ loadingButton: false })

            //Send an error message
            message.error('Something went wrong. Please try again at another time.')

        })

    }

    render() {
        if (this.state.hasSentEmail) {
            return <Title>We've sent you a sign in email link. Check your inbox!</Title>
        }

        return (<Form name='basic' layout='vertical' onFinish={this.onFormSubmit}>
            <Form.Item label='Email' name='email' rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
            <Form.Item><Button type='primary' htmlType='submit' loading={this.state.loadingButton}>Submit</Button></Form.Item>
        </Form>)
    }
}


ReactDOM.render(<SignInPage />, mountNode)