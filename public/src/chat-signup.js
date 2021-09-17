const { Row, Col } = antd;

class ChatSignup extends React.Component {

  loadDeferredIframe() {
    const userLocalEmail = getEmailFromLocalStorage();
    const userLocalFirstName = getFirstNameFromLocalStorage();
    const userLocalLastName = getLastNameFromLocalStorage();
    const iframe = document.getElementById("my-deferred-iframe");
    if (iframe) {
      iframe.src = `https://app.acuityscheduling.com/schedule.php?owner=21394641&appointmentType=18777910&firstName=${userLocalFirstName}&lastName=${userLocalLastName}&email=${userLocalEmail}`;
      iframe.title = "Schedule Appointment";
      iframe.width = "90%";
      iframe.height = "1600";
      iframe.frameBorder = "0";
    }
  };


  componentDidMount() {
    this.loadDeferredIframe();
  };

  render() {
    let tutorDetails = this.props.tutorDetails;
    let interviewDate = '';
    if (notNull(interviewDate)) interviewDate = tutorDetails.interviewDate;

    if (!this.props.progress.hasScheduledChat){
      return (
        <div>
          <h1 className="section-header-h1">15-Minute Chat</h1>

          <p className="section-p">We want to keep it casual, ask a few questions, and get to know you better!</p>

          <p className="section-p">All meetings with us are via Zoom, be on the lookout for the link in your confirmation email.</p>

          <p className="section-p">If you need assistance, please reach out to our Onboarding Specialist at laura@stepuptutoring.org or (205) 953-1894. If you have already signed up or completed session, please disregard.</p>
          <div className="center-embed-iframe">
            <iframe id="my-deferred-iframe" src="about:blank" /><script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
          </div>
        </div>
        )
    } else if (this.props.progress.hasScheduledChat && tutorDetails.status === ''){
          return (
            <div>
              <h1 className = "section-header-h1" > 15-Minute Chat</h1 >
              <div className="chat-scheduled-date-container">
                <p>Thanks for scheduling a chat with us, we&#39;re excited to speak to you!</p>
                <p>Your interview is scheduled for <strong>{new Date(interviewDate).toLocaleString()}</strong> </p>
              </div>
            </div>
          )
    } else {
      return(
        <div>
          <h1 className="section-header-h1" > 15-Minute Chat</h1 >
          <div className="chat-scheduled-date-container">
            <p>Great speaking with you, lorem ipsum...</p>
          </div>
        </div>
      )
    }
  }
}
