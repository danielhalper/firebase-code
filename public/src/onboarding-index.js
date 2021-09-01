const ErrorBoundary = Bugsnag.use( bugsnag__react(React) )

//The node to mount on
const mountNode = document.getElementById('content')

const EMULATOR = window.location.href.includes('localhost')

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001)

ReactDOM.render(<ErrorBoundary><OnboardingApp /></ErrorBoundary>, mountNode)
