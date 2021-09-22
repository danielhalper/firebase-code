const { Button} = antd;
const { CalendarOutlined } = icons;

class LiveTraining extends React.Component {

  loadDeferredIframe() {
    const userLocalEmail = getEmailFromLocalStorage();
    const userLocalFirstName = getFirstNameFromLocalStorage();
    const userLocalLastName = getLastNameFromLocalStorage();
    const iframe = document.getElementById("deferred-iframe");
    if (iframe) {
      iframe.src = `https://calendly.com/stepup-tut/training?name=${userLocalFirstName}%20${userLocalLastName}&email=${userLocalEmail}`;
      iframe.title = "Schedule Live Training";
      iframe.width = "100%";
      iframe.height = "800";
      iframe.frameBorder = "0";
    }
  };

  componentDidMount() {
    this.loadDeferredIframe();
  };

  render() {
    const tutorDetails = this.props.tutorDetails;

    if (!tutorDetails.liveTrainingDate) {
    return (
      <div>
        <h1 className="section-header-h1">Live Training</h1>
        <p>Attend an hour long, live virtual session with one of our coaches where you will find out more about how being a tutor with Step Up works, learn about some fun educational resources to use with your student, and ask any questions you may have. Please sign up for a session with Laura through the calendar below.</p>
        <div id="live-training-calendly">
          <iframe id="deferred-iframe" src="about:blank" /><script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" ></script>
        </div>
      </div>
    )
    } else {
      return (
        <div>
          <h1 className="section-header-h1">Live Training</h1>
          <div className="content-completed-container">
            <div className="appointment-confirmation-icon"><CalendarOutlined /></div>
            <p>{tutorDetails.firstname}, we have you confirmed for your appointment!</p>
            <p className="appointment-confirmation-title">Live Training Session</p>
            <p><strong>{tutorDetails.liveTrainingDate}</strong></p>
            <div className="live-training-button-container">
              <Button type="primary" href={`https://calendly.com/reschedulings/${tutorDetails.calendlyInviteeID}`} target="_blank" className="live-training-reschedule-buttons">Reschedule</Button>
              <Button type="primary" href={`https://calendly.com/cancellations/${tutorDetails.calendlyInviteeID}`} target="_blank" className="live-training-reschedule-buttons">Cancel</Button>
            </div>
          </div>
        </div>
      )
    }
  }
}
