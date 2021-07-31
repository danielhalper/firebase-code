var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OnboardingApp = function (_React$Component) {
  _inherits(OnboardingApp, _React$Component);

  function OnboardingApp(props) {
    _classCallCheck(this, OnboardingApp);

    var _this = _possibleConstructorReturn(this, (OnboardingApp.__proto__ || Object.getPrototypeOf(OnboardingApp)).call(this, props));

    _this.state = {
      userData: {},
      currentStep: 0,
      loading: true,
      error: false,
      progress: {
        hasScheduledChat: false,
        hasCompletedWaiver: false,
        hasCompletedWorkbook: false,
        hasCompletedLiveScan: false,
        hasCompletedLiveTraining: false
      },
      sidebarItems: [{
        keyId: 'home',
        icon: React.createElement(HomeOutlined, null),
        title: 'Dashboard',
        active: true,
        disabled: false,
        isSteps: true,
        subItems: [{
          keyId: 'chat-signup',
          icon: React.createElement(CommentOutlined, null),
          title: 'Chat Signup',
          active: false,
          disabled: false,
          complete: false
        }, {
          keyId: 'waiver',
          icon: React.createElement(SolutionOutlined, null),
          title: 'Waiver',
          active: false,
          disabled: true,
          complete: false
        }, {
          keyId: 'workbook',
          icon: React.createElement(BookOutlined, null),
          title: 'Workbook',
          active: false,
          disabled: true,
          complete: false
        }, {
          keyId: 'livescan',
          icon: React.createElement(SecurityScanOutlined, null),
          title: 'Background Check',
          active: false,
          disabled: true,
          complete: false
        }, {
          keyId: 'live-training',
          icon: React.createElement(RocketOutlined, null),
          title: 'Live Training',
          active: false,
          disabled: true,
          complete: false
        }]
      }, {
        keyId: 'support',
        icon: React.createElement(QuestionCircleOutlined, null),
        title: 'Support',
        active: false,
        disabled: false,
        subItems: [{
          keyId: 'faq',
          title: 'FAQ',
          active: false,
          disabled: false
        }, {
          keyId: 'tutor-resources',
          title: 'Tutor Resources',
          active: false,
          disabled: false
        }, {
          keyId: 'office-hours',
          title: 'Sign up for office hours',
          active: false,
          disabled: false
        }, {
          keyId: 'contact',
          title: 'Contact Laura',
          active: false,
          disabled: false
        }]
      }]
    };

    _this.setUserProgress = _this.setUserProgress.bind(_this);
    _this.disableSideItems = _this.disableSideItems.bind(_this);

    return _this;
  }

  _createClass(OnboardingApp, [{
    key: 'calculateCurrentStep',
    value: function calculateCurrentStep(user) {
      var currentStep = 0;

      if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Application Accepted') {
        currentStep = 1;
      }
      if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Ready to Tutor') {
        currentStep = 2;
      }
      if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Matched') {
        currentStep = 4;
      }
      return currentStep;
    }

    // takes user data and sets currentStep

  }, {
    key: 'receiveUser',
    value: function receiveUser(user) {
      var currentStep = this.calculateCurrentStep(user);

      //Update the state with the received data
      this.setState({
        loading: false,
        userData: user.data.user,
        currentStep: currentStep
      });
    }

    // takes user data and sets info to localstorage for use in prefilling forms

  }, {
    key: 'setUserLocalStorage',
    value: function setUserLocalStorage(user) {
      var firstname = user.data.user['First Name'];
      var lastname = user.data.user['Last Name'];
      var email = user.data.user['Email'];
      window.localStorage.setItem('userEmail', email);
      window.localStorage.setItem('userFirstName', firstname);
      window.localStorage.setItem('userLastName', lastname);
    }

    // takes user data and sets completed tracked items in state

  }, {
    key: 'setUserProgress',
    value: function setUserProgress(user) {
      var scheduledChat = false;
      var completedWaiver = false;
      var completedWorkbook = false;
      var completedLiveScan = false;
      var completedLiveTraining = false;

      if ('Interview Date' in user.data['user']) {
        scheduledChat = notNull(user.data['user']['Interview Date']);
      }
      if ('Waiver?' in user.data['user']) {
        completedWaiver = notNull(user.data['user']['Waiver?']);
      }
      if ('Section 2' in user.data['user']) {
        completedWorkbook = notNull(user.data['user']['Section 2']);
      }
      if ('Live Scan?' in user.data['user']) {
        completedLiveScan = notNull(user.data['user']['Live Scan?']);
      }
      if ('Live Training?' in user.data['user']) {
        completedLiveTraining = notNull(user.data['user']['Live Training?']);
      }

      this.setState({
        progress: {
          hasScheduledChat: scheduledChat,
          hasCompletedWaiver: completedWaiver,
          hasCompletedWorkbook: completedWorkbook,
          hasCompletedLiveScan: completedLiveScan,
          hasCompletedLiveTraining: completedLiveTraining
        }
      });
    }
  }, {
    key: 'loadTutorData',
    value: function loadTutorData() {
      var _this2 = this;

      firebase.functions().httpsCallable('getTutorData')().then(function (tutorDetailedResult) {
        _this2.receiveUser(tutorDetailedResult);
        _this2.setUserLocalStorage(tutorDetailedResult);
        _this2.setUserProgress(tutorDetailedResult);
        _this2.disableSideItems();
      }).catch(function (error) {
        console.log(error);
      });
    }

    // if interview has not been scheduled, disable all other subitems on sidebar

  }, {
    key: 'disableSideItems',
    value: function disableSideItems() {
      var sidebarItems = this.state.sidebarItems;
      var userData = this.state.userData;
      var hasScheduledChat = this.state.progress.hasScheduledChat;

      if (!hasScheduledChat) {
        for (var i = 1; i < sidebarItems[0].subItems.length; i++) {
          sidebarItems[0].subItems[i]['disabled'] = true;
        }
      }

      if (hasScheduledChat) {
        sidebarItems[0].subItems[1]['disabled'] = false;
        sidebarItems[0].subItems[2]['disabled'] = false;
      }

      // if has passed interview enable all sidebar items
      if ('Status' in userData && userData['Status'] == 'Application Accepted') {
        sidebarItems[0].subItems.map(function (item) {
          return item.disabled = false;
        });
      }

      this.setState({
        sidebarItems: sidebarItems
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      FIREBASE_RUN_ON_READY.push(function (user) {
        _this3.loadTutorData();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(SidebarLayout, {
        pages: {
          'home': Home,
          'waiver': Waiver,
          'chat-signup': ChatSignup,
          'workbook': Workbook,
          'livescan': BackgroundCheck,
          'live-training': LiveTraining
        },
        sidebarItems: this.state.sidebarItems,
        currentTab: 'home',
        userData: this.state.userData,
        currentStep: this.state.currentStep,
        loading: this.state.loading,
        error: this.state.error,
        progress: this.state.progress,
        setUserProgress: this.state.setUserProgress,
        disableSideItems: this.state.disableSideItems
      });
    }
  }]);

  return OnboardingApp;
}(React.Component);