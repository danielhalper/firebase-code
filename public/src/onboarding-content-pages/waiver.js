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
    let tutorDetails = this.props.tutorDetails;

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
            <h1 className="section-header-h1"> Waiver {tutorDetails.waiverCompleted ? <span className="header-completed-done-check">< CheckOutlined /></span> : null}</h1 >

          <div className="content-completed-container" id="completed-waiver-container">
              <p className="waiver-done-message">Thanks for completing the waiver! Review below.</p>
              <div>
                <p>Step Up Tutoring(collectively, with its affiliates, “Step Up Tutoring” or “we”) requires you(“Tutor” or “you”) to sign this
                  Tutor Agreement(this “Agreement”) in order to provide tutoring services to students participating in Step Up Tutoring’s tutoring program(the “Program”).
                </p>

                <p><span className="waiver-numbered-titles">1. Volunteer Tutor</span>
                  Tutor acknowledges and agrees that(i) Tutor’s participation in the Program and provision of tutoring services is voluntary,
                    (ii) Tutor will not be paid for such services, and(iii) Tutor is not an employee or agent of Step Up Tutoring.
                    The selection of tutors for the Program is in Step Up Tutoring’s sole discretion, and Tutor understands that Step Up Tutoring
                    is under no obligation to select Tutor as a tutor for the Program or to pair Tutor with any student participating in the Program.
                    Tutor acknowledges that Step Up Tutoring has the right to cease permitting Tutor to participate in the Program at any time and for any reason.
                    The Program may use third - party platforms such as Zoom, Google, and Remind(“Third - Party Services”) to facilitate the Program.
                    Tutor acknowledges that Third - Party Services are not provided by Step Up Tutoring and Tutor’s use of Third - Party Services is
                    governed by the terms of use of the applicable Third - Party Services, and Tutor agrees that Tutor will abide by such terms of use.
                    Step Up Tutoring is not responsible for Third - Party Services, Tutor’s use thereof, or the privacy practices of the operators of any Third -
                    Party Services.Tutor consents to Step Up Tutoring sharing Tutor’s name, email address(es) and / or phone number(s) in connection with the
                    Program, including with other Program tutors.
                </p>

                <p><span className="waiver-numbered-titles">2. Code of Conduct</span>
                  Tutor acknowledges that he or she has reviewed the Step Up Tutoring Code of Conduct set forth in Exhibit A(the “Tutor Code of Conduct”),
                    and agrees to comply with all terms set forth in the Tutor Code of Conduct, which are hereby incorporated by reference in this Agreement.
                    Any violation of the Tutor Code of Conduct or any other inappropriate behavior may result in Tutor’s immediate disqualification from
                    participation in the Program.
                </p>

                <p><span className="waiver-numbered-titles">3. Representations and Warranties</span>
                  Tutor represents and warrants to Step Up Tutoring that:
                    a.Tutor is at least 16 years old and has the legal right to, and by signing this Agreement does, consent to the terms and conditions
                    of this Agreement(including the Tutor Code of Conduct); and
                    b.the information submitted to Step Up Tutoring in Tutor’s application is truthful and accurate and,
                    to the extent such information is no longer accurate, Tutor will provide Step Up Tutoring with updated information as soon as possible.
                </p>
                <p><span className="waiver-numbered-titles">4. Waiver and Release</span>
                  Tutor acknowledges that Tutor is voluntarily participating in tutoring activities organized by Step Up Tutoring.
                  Tutor voluntarily assumes all risks and takes full responsibility for any consequences that may arise from Tutor’s participation in the Program.
                  In consideration for being able to participate in the Program, Tutor hereby, on behalf of Tutor and his or her heirs, executors, administrators,
                  assigns, and personal representatives, releases and forever discharges Step Up Tutoring and its respective affiliates, members, partners,
                  representatives, directors, employees, contractors, agents, and their successors and assigns(collectively, the “Released Parties”) from and against
                  any and all claims, demands, losses, damages, costs(including court costs and attorneys’ fees), illnesses, injuries(including death or emotional distress),
                  or other liability, financial or otherwise, that may arise from Tutor’s performance of tutoring services, participation in the Program, or breach of
                  this Agreement, whether as a result of the Released Parties’ negligence or otherwise(collectively, “Claims”).
                  Tutor acknowledges that Tutor may subsequently learn of claims, risks, or facts of which Tutor is not currently aware.It remains Tutor’s intention to
                  grant the Released Parties a full and final release of all claims, whether known or unknown.Tutor is aware of Section 1542 of the California Civil Code,
                  which provides that:
                </p>
                <p>A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS THAT THE CREDITOR OR RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR
                  AT THE TIME OF EXECUTING THE RELEASE AND THAT, IF KNOWN BY HIM OR HER, WOULD HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE
                  DEBTOR OR RELEASED PARTY.
                </p>
                <p>Being aware of this code section, Tutor expressly waives any rights that Tutor may have based upon it, as well as under any other statutes or
                  common law principles of similar effect.Tutor will not pursue legal or other action against any of the Released Parties for any losses,
                  damages, injuries(including death), or other liability, real or perceived, arising from any Claims.
                  Tutor acknowledges that Tutor has read this release and that Tutor fully understands its terms.
                  Tutor is signing this release freely and voluntarily, and intends it to be a binding instrument.
                </p>

                <p><span className="waiver-numbered-titles">5. Indemnification</span>
                  Tutor will defend(at Step Up Tutoring’s option), indemnify, and hold the Released Parties harmless from and against any and all Claims.
                </p>

                <p><span className="waiver-numbered-titles">6. General</span>
                  This Agreement shall be governed by the laws of the State of California.
                    This Agreement(including the Tutor Code of Conduct) contains the entire agreement between the parties regarding its subject matter and
                    supersedes all prior understandings and communications, oral, or written.This Agreement may be executed in any number of counterparts,
                    each of which, when executed and delivered(including electronically), will be deemed an original and all of which together will constitute
                    one and the same instrument. Each counterpart may be delivered by electronic transmission, including by submitting via a webpage or by
                    emailing a scanned version, and an electronically transmitted signature page shall have the same force and effect as an original signature.
                    If any provision of this Agreement is deemed to be invalid, unlawful, or otherwise unenforceable, that provision will be deemed modified
                    to the minimum extent necessary to be enforceable while most nearly effecting the intent of the original provision.The words
                    “include, ” “includes” and “including” shall be deemed to be followed by the phrase “without limitation.” Tutor may not assign this Agreement
                    without the prior written consent of Step Up Tutoring.Any purported assignment and / or transfer without such consent, shall be null,
                    void and unenforceable.Step Up Tutoring may assign this Agreement, in whole or in part, including its rights and obligations hereunder,
                    without the approval of Tutor.</p>
              </div>
          </div>
        </div>
        )
      }
  }
}
