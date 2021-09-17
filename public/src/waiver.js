class Waiver extends React.Component {

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://paperform.co/__embed.min.js";
    document.body.appendChild(script);
};

  render() {
    const userLocalEmail = getEmailFromLocalStorage();
    const userLocalFirstName = getFirstNameFromLocalStorage();
    const userLocalLastName = getLastNameFromLocalStorage();
    if(!this.props.progress.hasCompletedWaiver) {
      return (
        <div>
          <h1 className="section-header-h1">Waiver</h1>
          <h3 className="section-approx-time">Approximate time: 5 minutes</h3>
          <p className="section-p">The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring. It outlines the tutor code of conduct, and responsibilities & expectations for our volunteer tutors. </p>
          <div className="waiver-paperform-div" data-prefill={`firstName=${userLocalFirstName}&lastName=${userLocalLastName}&email=${userLocalEmail}&2n0v7=${userLocalFirstName}%20${userLocalLastName}`} data-paperform-id="tqp1uzj8"></div>
        </div>
      )
      } else {
        return (
        <div>
          <h1 className="section-header-h1" > Waiver</h1 >
          <div className="chat-scheduled-date-container">
            <p>Thanks for completing the waiver.</p>
              <p>If you&#39;d like to review the waiver, you can find it here. </p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
        )
      }
  }
}
