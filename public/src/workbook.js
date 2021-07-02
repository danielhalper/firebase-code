class Workbook extends React.Component {

  render() {
    const userLocalEmail = getEmailFromLocalStorage();
    const userLocalFirstName = getFirstNameFromLocalStorage();
    const userLocalLastName = getLastNameFromLocalStorage();

    return (
      <div className="section-content" id="workbook-section-content">
        <h1 className="section-header-h1">Training Modules</h1>
        <h3 className="section-approx-time">Approximate time: 1-2 hours</h3>
        <p className="section-p">Please take your time when completing the Step Up workbook. It is essential for....</p>
        <div className="workbook-tab-style">
          <Tabs defaultActiveKey="1" centered className="tab-content-style">
            <TabPane tab="General Expectations" key="1" forceRender="true">
              <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLScN2qPXuWx7PcG4rAPzFUx06M-V5Ahtx0o-ge1L3ifc-9VVFQ/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.147453066=${userLocalEmail}`} width="640" height="3200" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </TabPane>
            <TabPane tab="Sexual Harassment and Boundaries" key="2" forceRender="true">
              <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLSdx3uxtfVJEf8jSs4bXwKUFZp0a5teFBxxs-vwod3koxJ1gbA/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.147453066=${userLocalEmail}`} width="640" height="2100" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </TabPane>
            <TabPane tab="Teaching Math" key="3" forceRender="true">
              <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLSeG5hnnpsDSCjelPD31tm3q8jIxd_AqiphhUpicC_DPvJSZCA/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.144716208=${userLocalEmail}`} width="640" height="2400" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </TabPane>
            <TabPane tab="Teaching Reading" key="4" forceRender="true">
              <iframe src={`https://docs.google.com/forms/d/e/1FAIpQLScewxx296TOYqKFJEPDKKzPi56A-bvKdBoZG3OtDhzAnkMNZQ/viewform?embedded=true&usp=pp_url&entry.1506871634=${userLocalFirstName}%20${userLocalLastName}&entry.689630015=${userLocalEmail}`} width="640" height="1550" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
