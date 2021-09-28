const { Row, Col, Button, Link } = antd;
const { CalendarOutlined, CheckOutlined, CheckCircleFilled } = icons;

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

          <p className="section-p">If you need assistance, please reach out to our Onboarding Specialist at <Link href='mailto:laura@stepuptutoring.org'>laura@stepuptutoring.org</Link>. If you have already signed up or completed session, please disregard.</p>
          <div className="center-embed-iframe">
            <iframe id="my-deferred-iframe" src="about:blank" /><script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
          </div>
        </div>
        )
    } else if (this.props.progress.hasScheduledChat && tutorDetails.status === ''){
          return (
            <div>
              <h1 className = "section-header-h1" > 15-Minute Chat</h1 >
              <div className="content-completed-container">
                <div className="appointment-confirmation-icon"><CalendarOutlined /></div>
                <p>{tutorDetails.firstname}, we have you confirmed for your appointment!</p>
                <p className="appointment-confirmation-title">15 Minute Zoom Chat</p>
                <p><strong>{new Date(interviewDate).toLocaleString()}</strong> </p>
                <div>
                  <Button className="chat-cancel-button" type="primary" href={`https://us-central1-acuity-82682.cloudfunctions.net/rescheduleAppointment?appointmentId=${tutorDetails.acuityAppointmentID}&email=${tutorDetails.email}`} target="_blank">Cancel & Reschedule</Button>
                  <p style={{ fontSize: '12px' }}>*Cancellations without a reschedule may take 20 minutes to reflect change.</p>
                </div>
              </div>
            </div>
          )
    } else {
      return(
        <div>
          <h1 className="section-header-h1" > 15-Minute Chat {tutorDetails.status === 'Application Accepted' ? <span className="header-completed-done-check">< CheckOutlined /></span> : null}</h1 >
          <div className="content-completed-container">
            <img className="svg-completed-img" src="./meeting.svg" alt="calendar booked image"></img>
            <p>Thank you for completing the 15 minute chat with us, it was great to meet you {tutorDetails.firstname}.</p>
            <p>You're now one step closer to becoming a Step Up Tutor and making a difference in a child's life!</p>
          </div>
        </div>
      )
    }
  }
}
