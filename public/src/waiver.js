const { Row, Col } = antd;

class Waiver extends React.Component {

  componentDidMount() {
  const script = document.createElement("script");
  script.src = "https://paperform.co/__embed.min.js";
  document.body.appendChild(script);
};

  render() {

    return (
      <div>
        <h1 className="section-header-h1">Waiver</h1>
        <h3 className="section-approx-time">Approximate time: 5 minutes</h3>
        <p className="section-p">The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring. It outlines the tutor code of conduct, and responsibilities & expectations for our volunteer tutors. </p>
            <div className="waiver-paperform-div" data-paperform-id="tqp1uzj8"></div>
      </div>
    )
  }
}
