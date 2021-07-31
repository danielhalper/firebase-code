//The node to mount on
var mountNode = document.getElementById('content');

var EMULATOR = window.location.href.includes('localhost');

if (EMULATOR) firebase.functions().useEmulator("localhost", 5001);

ReactDOM.render(React.createElement(OnboardingApp, null), mountNode);