const { CheckCircleFilled, MinusCircleOutlined, SmileTwoTone } = icons;

function CompletedFormMsg(props) {

    return (
      <div className="completed-form-outer-div">
        <div className="completed-form-icon"><SmileTwoTone twoToneColor="#1BCBD9" /></div>
        <h2 className="completed-form-thank-you">Thank You!</h2>
        <p>Your submission for {props.workbookForm} has been saved.</p>
        <p>Review the form. This will be a link</p>
      </div>
    )
}


class Workbook extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const myIframes = document.querySelectorAll("iframe");
    myIframes.forEach(function(iframe) {
      iframe.addEventListener("load",
        function () {
          document.querySelector('.main-content').scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        });
    })
  }

  render() {
    const userLocalEmail = getEmailFromLocalStorage();
    const userLocalFirstName = getFirstNameFromLocalStorage();
    const userLocalLastName = getLastNameFromLocalStorage();
    const wbForms = this.props.workbookForms;
    const progress = this.props.progress

    return (
      <div className="section-content" id="workbook-section-content">
        <h1 className="section-header-h1"> Workbook Training Modules {progress.hasCompletedAllWorkbook ? <span className="header-completed-done-check">< CheckOutlined /></span> : null}</h1>
        <h3 className="section-approx-time">Approximate time: 1-2 hours</h3>
        <p className="section-p">Please take your time when completing the Step Up workbook. It is essential for....</p>
        <div className="workbook-tab-style" id="workbook-tabs">
          <Tabs defaultActiveKey="1" centered className="tab-content-style">

            <TabPane
              tab={ <span> { wbForms.hasCompletedWbForm1 ? <CheckCircleFilled className="wb-check-style" />  : <div className="wb-form-incomplete"></div> } General Expectations </span> }
              key="1"
              forceRender="true"  >
              {wbForms.hasCompletedWbForm1 ? <CompletedFormMsg workbookForm={"General Expectations"} /> :
                <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLScN2qPXuWx7PcG4rAPzFUx06M-V5Ahtx0o-ge1L3ifc-9VVFQ/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.147453066=${userLocalEmail}`} width="640" height="3500" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
              }
            </TabPane>

            <TabPane
              tab={ <span> { wbForms.hasCompletedWbForm2 ? <CheckCircleFilled className="wb-check-style" /> : <div className="wb-form-incomplete"></div> } Sexual Harassment and Boundaries </span> }
              key="2"
              forceRender="true" >
              {wbForms.hasCompletedWbForm2 ? <CompletedFormMsg workbookForm={"Sexual Harassment and Boundaries"} /> :
                <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLSdx3uxtfVJEf8jSs4bXwKUFZp0a5teFBxxs-vwod3koxJ1gbA/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.147453066=${userLocalEmail}`} width="640" height="2300" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
              }
              </TabPane>

            <TabPane
              tab={ <span> { wbForms.hasCompletedWbForm3 ? <CheckCircleFilled className="wb-check-style" /> : <div className="wb-form-incomplete"></div> } Tutoring Math </span> }
              key="3"
              forceRender="true" >
              {wbForms.hasCompletedWbForm3 ? <CompletedFormMsg workbookForm={"Tutoring Math"} /> :
                <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLSca40szBn7VgKf8QGM1nhAzrh0wumXnfAdWqsV9r5EZq4eCdA/viewform?embedded=true&usp=pp_url&entry.1424269320=${userLocalFirstName}%20${userLocalLastName}&entry.348644900=${userLocalEmail}`} width="640" height="3200" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
              }
              </TabPane>

            <TabPane
              tab={ <span> { wbForms.hasCompletedWbForm4 ? <CheckCircleFilled className="wb-check-style" />  : <div className="wb-form-incomplete"></div> } Teaching Reading </span> }
              key="4"
              forceRender="true" >
              {wbForms.hasCompletedWbForm4 ? <CompletedFormMsg workbookForm={"Teaching Reading Comprehension"} /> :
                <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLScewxx296TOYqKFJEPDKKzPi56A-bvKdBoZG3OtDhzAnkMNZQ/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.689630015=${userLocalEmail}`} width="640" height="1550" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
              }
              </TabPane>

          </Tabs>
        </div>
      </div>
    )
  }
}
