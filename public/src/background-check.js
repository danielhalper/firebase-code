const { Divider } = antd;

class BackgroundCheck extends React.Component {

  render() {

    return (
      <div>
        <h1 className="section-header-h1">Live Scan</h1>
        <h3 class="section-approx-time">Approximate time: 2-4 days</h3>
        <p className="section-p"> Per LAUSD request, all tutors will be required to complete a Live Scan fingerprint background check. Tutors are asked to pay for their own fingerprinting/background check, which costs $50-65. If you are a college student with need-based financial aid or have special circumstances, you may be eligible for reimbursement. Unfortunately, prior Live Scans from other organizations cannot be accepted (DOJ rules).</p>
        <p className="section-p">Here is basic information for individuals needing to submit fingerprints to the DOJ for background checks.</p>
          <div className="bg-check-div-all-steps">
            <div className="bg-check-step-styling">
              <div className="div-bg-check-number-and-title">
                <span className="bg-check-number-styling">1</span><h3 className="bg-check-step-title">Print Out This Form </h3>
              </div>
              <p className="bg-check-p no-bot-margin"><strong>(or send a filled out form to the Live Scan site you are going to)</strong></p>
              <p className="bg-check-p no-bot-margin">Click on arrow on top right hand side of form to pop out new window and print.</p>
              <p className="bg-check-p" id="bg-check-note"><i>Note: You do <strong>not</strong> need to fill out the Contact Telephone Number, OCA Number, Billing Number, or Misc. Number</i></p>
            <p className="bg-check-p"><small>For volunteers residing outside of California, please click <strong><a href="https://docs.google.com/document/d/1OskeY1-JGEbTYRCMSLa5GYr8UdvNw8zN/edit" target='_blank'>here.</a> </strong></small></p>
              <iframe className="bg-check-iframe" src="https://drive.google.com/file/d/1pl1KecIrttIxzhWrVOpeYIiX1FT-2FF6/preview" width="85%" height="500" frameBorder="0" allow="autoplay"></iframe>
            </div>
            <div className="bg-check-step-styling">
              <div className="div-bg-check-number-and-title">
                <span className="bg-check-number-styling">2</span><h3 className="bg-check-step-title">Get Fingerprinted</h3>
              </div>
            <p className="bg-check-p">Once you have obtained the necessary forms from the applicant agency, go to a local Live Scan site to be fingerprinted. To find the site nearest to you and a listing of fees, see <strong><a href="https://oag.ca.gov/fingerprints/locations" target='_blank'>Public Live Scan Sites</a></strong> or click <strong><a href="https://docs.google.com/document/d/1M_ZBQeidwncFqY4vR3bPNKM30_dGhEl5AcojcwCvnVw/edit" target='_blank'>here.</a></strong> Select the county and type your neighborhood in the search. You can find the same list of counties at the end of this document.</p>
            <p className="bg-check-p"><i>Please note: You must present valid photo identification when being fingerprinted. Expired identification information will not be accepted.</i></p>
            <p className="bg-check-p">A fingerprint-rolling fee may be collected when you get your fingerprints taken. Since <strong>this fee varies widely among locations, you will want to review the cost before going to a fingerprinting site.</strong> Be sure to check for any restrictions on method of payment, such as cash or money order only. The List of Applicant Live Scan Sites provides information by location on fees, hours of operation and if an appointment is needed.</p>
              <p className="bg-check-p">There also is a criminal history processing fee collected by the DOJ and Federal Bureau of Investigation (FBI) for the background checks. While often paid by the requesting agency, some applicants may be required to pay this fee themselves, so check with your requesting applicant agency. While the law requires applicant fingerprints to be captured and submitted electronically via Live Scan, DOJ does have limited statutory authority to issue an exemption to this mandate if an electronic transmission site is regionally unavailable or internal processing procedures dictate a need.</p>
              </div>
            <div className="bg-check-step-styling">
              <div className="div-bg-check-number-and-title">
                <span className="bg-check-number-styling">3</span><h3 className="bg-check-step-title">Wait For The Results</h3>
              </div>
            <p className="bg-check-p">Once the submission is received and processed, the DOJ will respond to the applicant agency either electronically or via U.S. mail. Step Up Tutoring will be given the results and will let you know whether or not you have passed! <strong>This entire process will only take a couple days so you can start tutoring in no time!</strong></p>
            <p className="bg-check-p"><i>Please keep the paper and/or take a picture of the form. We can do a search by your date of birth and ATI number (written in by the Live Scan attendant) in case the results get lost or are delayed.</i></p>
            </div>
          </div>
      </div>
    )
  }
}
