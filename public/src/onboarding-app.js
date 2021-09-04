const { message } = antd

class OnboardingApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: {},
      currentStep: 0,
      loading: true,
      error: false,
      progress: {
        hasScheduledChat: false,
        hasCompletedWaiver: false,
        hasCompletedAllWorkbook: false,
        hasCompletedLiveScan: false,
        hasCompletedLiveTraining: false
      },
      workbookForms: {
        hasCompletedWbForm1: false,
        hasCompletedWbForm2: false,
        hasCompletedWbForm3: false,
        hasCompletedWbForm4: false
      },
      sidebarItems: [
        {
          keyId: 'home',
          icon: <HomeOutlined />,
          title: 'Dashboard',
          active: true,
          disabled: false,
          isSteps: true,
          subItems: [
            {
              keyId: 'chat-signup',
              icon: <CommentOutlined />,
              title: 'Chat Signup',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'waiver',
              icon: <SolutionOutlined />,
              title: 'Waiver',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'workbook',
              icon: <BookOutlined />,
              title: 'Workbook',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'livescan',
              icon: <SecurityScanOutlined />,
              title: 'Background Check',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'live-training',
              icon: <RocketOutlined />,
              title: 'Live Training',
              active: false,
              disabled: false,
              complete: false
            }
          ]
        },
        {
          keyId: 'support',
          icon: <QuestionCircleOutlined />,
          title: 'Support',
          active: false,
          disabled: false,
          isSupport: true,
          subItems: [
            {
              keyId: 'faq',
              title: 'FAQ',
              active: false,
              disabled: false,
              link: 'https://docs.google.com/document/d/1Wc2ztcXHTxDC2uZar6RkoayDRr5itrcv05thvoSs1cs/',
              icon: <QuestionOutlined/>
            },
            {
              keyId: 'tutor-resources',
              title: 'Tutor Resources',
              active: false,
              disabled: false,
              link: 'https://docs.google.com/document/d/18wWsqnV59P6a47u4i0IeXQIt2POdjAiPHol3r4i-054/edit#heading=h.6esndmj9ohuf',
              icon: <SnippetsOutlined/>
            },
            {
              keyId: 'office-hours',
              title: 'Sign Up for Office Hours',
              active: false,
              disabled: false,
              link: 'https://stepuptutoring.as.me/officehours',
              icon: <ScheduleOutlined/>
            },
            {
              keyId: 'contact',
              title: 'Contact Us',
              active: false,
              disabled: false,
              link: 'https://www.stepuptutoring.org/contact',
              icon: <MailOutlined/>
            },
            {
              keyId: 'bug',
              title: 'Report a bug',
              active: false,
              disabled: false,
              link: 'https://docs.google.com/forms/d/1hZL5lcDXqp77ixit2ZWwqafj3Ew4K7RpgoHqH37kzAE/viewform'
            }
          ]
        }
      ]
    }

    this.setUserProgress = this.setUserProgress.bind(this)
    this.disableSideItems = this.disableSideItems.bind(this)

    this.loadUserPoll = undefined //For periodically fetching user data
    this.loadUserPollInterval = 0
    this.currentLoadUserTimeout = undefined

  }

  calculateCurrentStep(user) {
    let currentStep = 0;

    switch(user.status) {
      case '':
        currentStep = 0
        break
      case 'Application Accepted':
        currentStep = 1
        break
      case 'Ready to Tutor':
        currentStep = 2
        break
      case 'Matched':
        currentStep = 4
        break
      default:
      currentStep = 5
    }

    return currentStep
  }

  // takes user data and sets currentStep
  receiveUser(user) {
    let currentStep = this.calculateCurrentStep(user)

    //Update the state with the received data
    this.setState({
      loading: false,
      userData: user,
      currentStep: currentStep
    })
  }

  // takes user data and sets info to localstorage for use in prefilling forms
  setUserLocalStorage(user) {
    let firstname = user.firstname;
    let lastname = user.lastname;
    let email = user.email;
    window.localStorage.setItem('userEmail', email);
    window.localStorage.setItem('userFirstName', firstname);
    window.localStorage.setItem('userLastName', lastname);
  }

  // takes user data and sets completed tracked items in state
  setUserProgress(user) {
    let scheduledChat = notNull(user.interviewDate);
    let completedWaiver = user.waiverCompleted;
    let completedLiveScan = user.liveScanCompleted;
    let completedLiveTraining = user.liveTrainingCompleted;
    let completedAllWorkbook;
    let completedForm1 = user.workbookForm1Completed;
    let completedForm2 = user.workbookForm2Completed;
    let completedForm3 = user.workbookForm3Completed;
    let completedForm4 = user.workbookForm4Completed;


    if (completedForm1 && completedForm2 && completedForm3 && completedForm4) {
      completedAllWorkbook = true
    } else {
      completedAllWorkbook = false
    }

    this.setState({
      progress:{
        hasScheduledChat: scheduledChat,
        hasCompletedWaiver: completedWaiver,
        hasCompletedAllWorkbook: completedAllWorkbook,
        hasCompletedLiveScan: completedLiveScan,
        hasCompletedLiveTraining: completedLiveTraining
      },
      workbookForms: {
        hasCompletedWbForm1: completedForm1,
        hasCompletedWbForm2: completedForm2,
        hasCompletedWbForm3: completedForm3,
        hasCompletedWbForm4: completedForm4
      }
    })
  }

  resetPollInterval() {
    clearTimeout(this.currentLoadUserTimeout)
    this.loadUserPollInterval = 0
    this.loadUserPoll()
  }

  loadTutorData() {

    this.loadUserPoll = () => {

      clearTimeout(this.currentLoadUserTimeout)
      this.currentLoadUserTimeout = setTimeout(() => {

        firebase.functions().httpsCallable('getOnboardingTutor')()
          .then(result => {
            const tutorDetailedResult = result.data
            this.receiveUser(tutorDetailedResult)
            this.setUserLocalStorage(tutorDetailedResult)
            this.setUserProgress(tutorDetailedResult)
            this.disableSideItems(tutorDetailedResult)

            this.loadUserPollInterval += 500

            this.loadUserPoll()
          })
          .catch(error => {
            message.error('Something went wrong. Please try again.')
            firebase.analytics.logEvent('error', {
                type: 'onboardingPortal',
                message: `Couldn't get onboarding tutor`,
                rawError: error.message
            })
            Bugsnag.notify(error)

            this.loadUserPollInterval += 500

            this.loadUserPoll()
          })

      }, this.loadUserPollInterval)

    }

    this.loadUserPoll()

  }

  // Depending on what step in process user is, sidebar items will be enabled and clickable
  disableSideItems(user) {
    const sidebarItems = this.state.sidebarItems
    const hasScheduledChat = this.state.progress.hasScheduledChat

  // Only enable sidebar if user status is empty (hasnt passed intv yet) or 'application accepted' (passed interview, needs to complete next steps)
    if ((user.status !== 'Application Accepted') && (user.status !== '')) {
      for (let i = 0; i < sidebarItems[0].subItems.length; i++) {
        sidebarItems[0].subItems[i]['disabled'] = true;
      }

      this.setState({ sidebarItems: sidebarItems })
      return
    }

    // if user has not scheduled interview, only enable chat sign up page
    if (!hasScheduledChat) {
      for (let i = 1; i < sidebarItems[0].subItems.length; i++) {
        sidebarItems[0].subItems[i]['disabled'] = true;
      }

      this.setState({ sidebarItems: sidebarItems})
      return
    }

    // at this point chat has been scheduled and becomes disabled
    const chatIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'chat-signup')
      sidebarItems[0].subItems[chatIndex]['disabled'] = true;
      sidebarItems[0].subItems[chatIndex]['complete'] = true;

    //if waiver has been completed, disable waiver page
    if (this.state.progress.hasCompletedWaiver) {
      const waiverIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'waiver')
      sidebarItems[0].subItems[waiverIndex].disabled = true
      sidebarItems[0].subItems[waiverIndex].complete = true
    }

    // if workbook has been completed, disable workbook page
    if (this.state.progress.hasCompletedAllWorkbook) {
      const workbookIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'workbook')
      sidebarItems[0].subItems[workbookIndex].disabled = true
      sidebarItems[0].subItems[workbookIndex].complete = true
    }

    // if has passed interview, check if live scan & training have been completed, enable pages when not, otherwise disabled
    if (this.state.userData.status == 'Application Accepted') {
      if (this.state.progress.hasCompletedLiveScan) {
        const livescanIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'livescan')
        sidebarItems[0].subItems[livescanIndex].disabled = true
        sidebarItems[0].subItems[livescanIndex].complete = true
      }

      if (this.state.progress.hasCompletedLiveTraining) {
        const liveTrainingIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'live-training')
        sidebarItems[0].subItems[liveTrainingIndex].disabled = true
        sidebarItems[0].subItems[liveTrainingIndex].complete = true
      }
    } else {
      const lScanIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'livescan')
      sidebarItems[0].subItems[lScanIndex].disabled = true

      const lTrainingIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'live-training')
      sidebarItems[0].subItems[lTrainingIndex].disabled = true
    }

    this.setState({
      sidebarItems: sidebarItems
    })
  }

componentDidMount() {
  FIREBASE_RUN_ON_READY.push((user) => {
    this.loadTutorData()
  })
}


  render() {
    return (
      <SidebarLayout
        pages={{
          'home': Home,
          'waiver': Waiver,
          'chat-signup': ChatSignup,
          'workbook': Workbook,
          'livescan': BackgroundCheck,
          'live-training': LiveTraining,
          'support': SupportPage
        }}
        onboarding
        sidebarItems={this.state.sidebarItems}
        workbookForms={this.state.workbookForms}
        currentTab='home'
        userData={this.state.userData}
        currentStep={this.state.currentStep}
        loading={this.state.loading}
        error={this.state.error}
        progress={this.state.progress}
        setUserProgress={this.state.setUserProgress}
        disableSideItems={this.state.disableSideItems}
      />
    )
  }
}
