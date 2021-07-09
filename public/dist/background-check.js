var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _antd = antd,
    Divider = _antd.Divider;

var BackgroundCheck = function (_React$Component) {
  _inherits(BackgroundCheck, _React$Component);

  function BackgroundCheck() {
    _classCallCheck(this, BackgroundCheck);

    return _possibleConstructorReturn(this, (BackgroundCheck.__proto__ || Object.getPrototypeOf(BackgroundCheck)).apply(this, arguments));
  }

  _createClass(BackgroundCheck, [{
    key: "render",
    value: function render() {

      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          { className: "section-header-h1" },
          "Live Scan"
        ),
        React.createElement(
          "h3",
          { "class": "section-approx-time" },
          "Approximate time: 2-4 days"
        ),
        React.createElement(
          "p",
          { className: "section-p" },
          " Per LAUSD request, all tutors will be required to complete a Live Scan fingerprint background check. Tutors are asked to pay for their own fingerprinting/background check, which costs $50-65. If you are a college student with need-based financial aid or have special circumstances, you may be eligible for reimbursement. Unfortunately, prior Live Scans from other organizations cannot be accepted (DOJ rules)."
        ),
        React.createElement(
          "p",
          { className: "section-p" },
          "Here is basic information for individuals needing to submit fingerprints to the DOJ for background checks."
        ),
        React.createElement(
          "div",
          { className: "bg-check-div-all-steps" },
          React.createElement(
            "div",
            { className: "bg-check-step-styling" },
            React.createElement(
              "div",
              { className: "div-bg-check-number-and-title" },
              React.createElement(
                "span",
                { className: "bg-check-number-styling" },
                "1"
              ),
              React.createElement(
                "h3",
                { className: "bg-check-step-title" },
                "Print Out This Form "
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p no-bot-margin" },
              React.createElement(
                "strong",
                null,
                "(or send a filled out form to the Live Scan site you are going to)"
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p no-bot-margin" },
              "Click on arrow on top right hand side of form to pop out new window and print."
            ),
            React.createElement(
              "p",
              { className: "bg-check-p", id: "bg-check-note" },
              React.createElement(
                "i",
                null,
                "Note: You do ",
                React.createElement(
                  "strong",
                  null,
                  "not"
                ),
                " need to fill out the Contact Telephone Number, OCA Number, Billing Number, or Misc. Number"
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              React.createElement(
                "small",
                null,
                "For volunteers residing outside of California, please click ",
                React.createElement(
                  "strong",
                  null,
                  React.createElement(
                    "a",
                    { href: "https://docs.google.com/document/d/1OskeY1-JGEbTYRCMSLa5GYr8UdvNw8zN/edit", target: "_blank" },
                    "here."
                  ),
                  " "
                )
              )
            ),
            React.createElement("iframe", { className: "bg-check-iframe", src: "https://drive.google.com/file/d/1pl1KecIrttIxzhWrVOpeYIiX1FT-2FF6/preview", width: "85%", height: "500", frameBorder: "0", allow: "autoplay" })
          ),
          React.createElement(
            "div",
            { className: "bg-check-step-styling" },
            React.createElement(
              "div",
              { className: "div-bg-check-number-and-title" },
              React.createElement(
                "span",
                { className: "bg-check-number-styling" },
                "2"
              ),
              React.createElement(
                "h3",
                { className: "bg-check-step-title" },
                "Get Fingerprinted"
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              "Once you have obtained the necessary forms from the applicant agency, go to a local Live Scan site to be fingerprinted. To find the site nearest to you and a listing of fees, see ",
              React.createElement(
                "strong",
                null,
                React.createElement(
                  "a",
                  { href: "https://oag.ca.gov/fingerprints/locations", target: "_blank" },
                  "Public Live Scan Sites"
                )
              ),
              " or click ",
              React.createElement(
                "strong",
                null,
                React.createElement(
                  "a",
                  { href: "https://docs.google.com/document/d/1M_ZBQeidwncFqY4vR3bPNKM30_dGhEl5AcojcwCvnVw/edit", target: "_blank" },
                  "here."
                )
              ),
              " Select the county and type your neighborhood in the search. You can find the same list of counties at the end of this document."
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              React.createElement(
                "i",
                null,
                "Please note: You must present valid photo identification when being fingerprinted. Expired identification information will not be accepted."
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              "A fingerprint-rolling fee may be collected when you get your fingerprints taken. Since ",
              React.createElement(
                "strong",
                null,
                "this fee varies widely among locations, you will want to review the cost before going to a fingerprinting site."
              ),
              " Be sure to check for any restrictions on method of payment, such as cash or money order only. The List of Applicant Live Scan Sites provides information by location on fees, hours of operation and if an appointment is needed."
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              "There also is a criminal history processing fee collected by the DOJ and Federal Bureau of Investigation (FBI) for the background checks. While often paid by the requesting agency, some applicants may be required to pay this fee themselves, so check with your requesting applicant agency. While the law requires applicant fingerprints to be captured and submitted electronically via Live Scan, DOJ does have limited statutory authority to issue an exemption to this mandate if an electronic transmission site is regionally unavailable or internal processing procedures dictate a need."
            )
          ),
          React.createElement(
            "div",
            { className: "bg-check-step-styling" },
            React.createElement(
              "div",
              { className: "div-bg-check-number-and-title" },
              React.createElement(
                "span",
                { className: "bg-check-number-styling" },
                "3"
              ),
              React.createElement(
                "h3",
                { className: "bg-check-step-title" },
                "Wait For The Results"
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              "Once the submission is received and processed, the DOJ will respond to the applicant agency either electronically or via U.S. mail. Step Up Tutoring will be given the results and will let you know whether or not you have passed! ",
              React.createElement(
                "strong",
                null,
                "This entire process will only take a couple days so you can start tutoring in no time!"
              )
            ),
            React.createElement(
              "p",
              { className: "bg-check-p" },
              React.createElement(
                "i",
                null,
                "Please keep the paper and/or take a picture of the form. We can do a search by your date of birth and ATI number (written in by the Live Scan attendant) in case the results get lost or are delayed."
              )
            )
          )
        )
      );
    }
  }]);

  return BackgroundCheck;
}(React.Component);