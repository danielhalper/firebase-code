//The node to mount on
const mountNode = document.getElementById('signin-form');

const { Form, Input, Button, Typography, message, Alert, Skeleton } = antd;
const { Title } = Typography;

const EMULATOR = window.location.href.includes('localhost')
if (EMULATOR) firebase.functions().useEmulator("localhost", 5001)

class SignInPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hasSentEmail: false,
            loadingButton: false,
            loading: true,
            errorMessage: ''
        }

        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    componentDidMount() {
        //Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search)

        //If the email parameter was sent, we need to try and create an account for the user
        if (urlParams.has('email')) {

            const email = urlParams.get('email')

            firebase.auth().createUserWithEmailAndPassword(email, generateRandomPassword(12)).then(userCredential => {

                //Account creation was successful; redirect to the onboarding dashboard
                window.location.replace('./onboarding_dashboard.html')

            }).catch(error => {

                //This will update the sign in page to show that they have already signed up
                if (error.code == 'auth/email-already-in-use') {
                    this.setState({
                        loading: false,
                        errorMessage: 'This email has already been used in an application. Enter it below to receive a sign in link.'
                    })
                } else {
                    this.setState({
                        loading: false,
                        errorMessage: error.message
                    })
                }

            })

        }

        //If they have a stepupToken, we try and authenticate them with a custom token
        else if (urlParams.has('stepupToken')) {

            //Get the token
            const stepUpToken = urlParams.get('stepupToken')

            //Send it to our server
            firebase.functions().httpsCallable('getCustomAuthToken')({
                stepUpToken: stepUpToken
            }).then(result => {

                //Get the custom token
                const customToken = result.data.customToken

                //Now authenticate with it
                firebase.auth().signInWithCustomToken(customToken).then(userCredential => {
                    
                    //They are signed in, so redirect to the portal
                    window.location.replace('./onboarding_dashboard.html')

                }).catch(error => {

                    //Something went wrong; ask them to enter their email and sign in
                    this.setState({
                        loading: false,
                        errorMessage: 'Please enter your email below to receive a sign in link'
                    })

                })

            }).catch(error => {

                //Something went wrong; ask them to enter their email and sign in
                this.setState({
                    loading: false,
                    errorMessage: 'Please enter your email below to receive a sign in link'
                })

            })

        }

        else {

            this.setState({
                loading: false
            })

        }
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
            this.setState({ loadingButton: false })

            message.success('Sign in Email Link Sent!')

            window.localStorage.setItem('emailForSignIn', values['email'])

        }).catch(error => {

            //Stop loading
            this.setState({ loadingButton: false })

            //Send an error message
            message.error('Something went wrong. Please try again at another time.')

        })

    }

    render() {
        return <div className='signin-container'>
            <img className='signin-logo' src='https://images.squarespace-cdn.com/content/5ed9fce13f6c795edcfd9773/1599342501255-0DY89Z19CDDZ9P6B7G6R/Untitled+design+%285%29.png?format=1500w&content-type=image%2Fpng' width={300}/>
            <div className='spacer' />
            {this.state.loading && <div className='signin-content'><Skeleton active/></div>}
            {!this.state.loading && <div className='signin-content'>
                {this.state.errorMessage.length > 0 && <Alert className='signin-error' message={this.state.errorMessage} type='error'/>}
                <Title level={1}>Sign In</Title>
                <p>
                    Enter your email address here, and we will send you an email with a link which you can use to sign in.
                </p>
                <Form name='basic' layout='vertical' onFinish={this.onFormSubmit}>
                    <Form.Item name='email' rules={[{ required: true, type: 'email' }]}><Input placeholder='example@example.com' size='large'/></Form.Item>
                    <Form.Item><Button style={{ width: '100%' }} type='primary' htmlType='submit' loading={this.state.loadingButton} size='large'>Send Me a Link!</Button></Form.Item>
                </Form>
            </div>}
            <div className='spacer' />
        </div>
    }
}



function generateRandomPassword(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}




ReactDOM.render(<SignInPage />, mountNode)