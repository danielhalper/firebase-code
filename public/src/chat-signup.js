const { Row, Col } = antd;

class ChatSignup extends React.Component {

  render() {
  return (
    <div>
      <h1 className="section-header-h1">15-Minute Chat</h1>

      <p className="section-p">We want to keep it casual, ask a few questions, and get to know you better!</p>

      <p className="section-p">All meetings with us are via Zoom, be on the lookout for the link in your confirmation email.</p>

      <p className="section-p">If you need assistance, please reach out to our Onboarding Specialist at laura@stepuptutoring.org or (205) 953-1894. If you have already signed up or completed session, please disregard.</p>
      <div className="center-embed-chat-signup">
        <iframe src="https://app.acuityscheduling.com/schedule.php?owner=21394641&appointmentType=18777910" title="Schedule Appointment" width="90%" height="1200" frameBorder="0"></iframe><script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
      </div>
    </div>
    )
  }
}
