//The node to mount on
const mountNode = document.getElementById('portal');

const { Form, Input, Button, Typography, message } = antd;
const { Title } = Typography;

const EMULATOR = window.location.href.includes('localhost')

class TutorPortal extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        return <div>Hi</div>
    }
}


ReactDOM.render(<TutorPortal />, mountNode)