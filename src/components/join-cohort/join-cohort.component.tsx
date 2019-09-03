import React from 'react';
import CreateUserComponent from '../create-user/create-user.component';
import { Button } from 'reactstrap';
import { connect } from "react-redux";
import { IState } from '../../reducers';
import { joinCohort, findLoggedInUser, findCohortByToken } from '../../actions/join-cohort/join-cohort.actions';
import { IAuthState, IJoinCohortState } from "../../reducers/management";
import { ICognitoUser } from "../../model/cognito-user.model";
import { IUser } from "../../model/user.model";
import { updateLocations } from '../../actions/address/address.actions';
import { History } from "history";
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';

export interface IJoinCohortProps {
  token: string,
  login: IAuthState,
  joinCohortState: IJoinCohortState,
  history: History,
  findCohortByToken:(token:string, history:History) => void,
  joinCohort:(user:IUser, token:string, history:History) => void,
  updateLocations: () => void,
  findLoggedInUser: (user:ICognitoUser, history:History) => void
}

export class JoinCohortComponent extends React.Component<IJoinCohortProps, IJoinCohortState> {
  constructor(props) {
    super(props)
  }

  // assert cohort token is real
  // if not display not a valid cohort link,

<<<<<<< HEAD
  async componentDidMount(){
    await this.props.findCohortByToken(this.props.token);
    await this.props.updateLocations();
    if (this.props.login.currentUser.email && !this.props.joinCohortState.userToJoin.userId) {
      await this.props.findLoggedInUser(this.props.login.currentUser);
    }
  }

  updateNewUserInfo = (e: React.FormEvent) => {
    let updatedNewUser = this.props.createUser.newUser;

    const target = e.target as HTMLSelectElement;
    switch (target.name) {
      case inputNames.EMAIL:
        updatedNewUser = {
          ...updatedNewUser,
          email: target.value
        }
        break;
      case inputNames.FIRST_NAME:
        updatedNewUser = {
          ...updatedNewUser,
          firstName: target.value
        }
        break;
      case inputNames.LAST_NAME:
        updatedNewUser = {
          ...updatedNewUser,
          lastName: target.value
        }
        break;
      case inputNames.PHONE:
        updatedNewUser = {
          ...updatedNewUser,
          phoneNumber: target.value
        }
        break;
      default:
        break;
    }
    const tempUser: IUser = {
      email: updatedNewUser.email,
      userId: 0,
      firstName: updatedNewUser.firstName,
      lastName: updatedNewUser.lastName,
      phoneNumber: updatedNewUser.phoneNumber,
      trainingAddress: updatedNewUser.trainingAddress,
      personalAddress: {
        addressId: 0,
        street: '',
        alias: '',
        city: '',
        country: '',
        state: '',
        zip: ''
      },
      userStatus: {
        statusId: 0,
        generalStatus: '',
        specificStatus: '',
        virtual: false,
      },
      roles: [this.props.createUser.newUser.role],
=======
  componentDidMount(){
  this.props.updateLocations();
  this.props.findCohortByToken(this.props.token, this.props.history);
  }

  componentDidUpdate() {
    if (this.props.login.currentUser.email && !this.props.joinCohortState.userToJoin.userId) {
      this.props.findLoggedInUser(this.props.login.currentUser, this.props.history);
>>>>>>> fcea897333021fcd0005f5de99353e2353029cb2
    }
  }

<<<<<<< HEAD
  saveNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempUser: IUser = {
      email: this.props.createUser.newUser.email,
      userId: 0,
      firstName: this.props.createUser.newUser.firstName,
      lastName: this.props.createUser.newUser.lastName,
      phoneNumber: this.props.createUser.newUser.phoneNumber,
      trainingAddress: this.props.createUser.newUser.trainingAddress,
      personalAddress: {
        addressId: 0,
        street: '',
        alias: '',
        city: '',
        country: '',
        state: '',
        zip: ''
      },
      userStatus: {
        statusId: 2,
        generalStatus: 'Training',
        specificStatus: 'Training',
        virtual: false
      },
      roles: ['associate'],
    }
    await this.props.saveUserAssociate(tempUser);
    // If this.joinCohort() is called here, the userId property of tempUser will be 0.
    // It should be called after the new user body is sent after saving it.
    // await this.joinCohort();
  }

  joinCohort() {
    this.props.joinCohort(this.props.joinCohortState.userToJoin, this.props.token, this.props.history);
  }
  // This function is called when an user already logged in and
  goToHomePage = (message:string) => {
    toast.info(message);
    this.props.history.push('/dashboard/home');
  }
=======
  joinCohort = () => {
    if (this.props.joinCohortState.foundCohort.users.find((currentUser:IUser) => ( currentUser.userId === this.props.joinCohortState.userToJoin.userId))) {
        this.props.history.push('/');
        toast.info(`You are already in the ${this.props.joinCohortState.foundCohort.cohortName} cohort`);
    } else {
    this.props.joinCohort(this.props.joinCohortState.userToJoin, this.props.token, this.props.history);
  }
}
>>>>>>> fcea897333021fcd0005f5de99353e2353029cb2

  // join cohort window has username and cohort name and a join button
  // after clicking join, take you to cohort page

  render() {
<<<<<<< HEAD
    if (this.props.joinCohortState.validToken) {
      // If new user just filled the sign up form, will be redirected automatically to the
      // cohort login page
      if (this.props.joinCohortState.userToJoin.userId && !this.props.login.currentUser.email) 
      {
        return (
          <div>
            <p>Going to cohort login...</p>
            <BarLoader/>
            {this.joinCohort()}
          </div>
        )
      }
      // If user is logged in and is already part of another cohort no need to rejoin. 
      // User is not supposed to be part of multiple cohorts (?)
      else if (this.props.login.currentUser.email && this.props.joinCohortState.userToJoin.userId
              &&
              this.props.joinCohortState.userToJoin.trainingAddress.addressId) 
      {
        return (
          <div>
            <BarLoader />
            {this.goToHomePage(`You are already in the ${this.props.joinCohortState.userToJoin.trainingAddress.alias} cohort`)}
          </div>
        )
      }
      // If user is logged in and is already part of the present cohort no need to re-join. 
      // Instead, user is redirected to the home page automatically.
      else if (this.props.login.currentUser.email &&
              this.props.joinCohortState.foundCohort.users.find((u:IUser)=>(
                u.userId == this.props.joinCohortState.userToJoin.userId)
              )
          )  
      {
        return (
          <div>
            <BarLoader />
            {this.goToHomePage(`Welcome ${this.props.joinCohortState.userToJoin.firstName}`)}
          </div>
        )
        // If user doesn't exist is going to fill the form for the first time
      } else {
        //Offer login or signup for the current cohort
        let createUser = this.props.createUser;
        let addresses = this.props.addresses;
        return (
          <Card
          className="join-cohort-signup-card">
            <form onSubmit={this.saveNewUser}>
              <div className="responsive-modal-row">
                <div className="responsive-modal-column create-user-margin">
                  <Label for="create-user-firstname-input">First Name</Label>
                  <Input name={inputNames.FIRST_NAME}
                    id="create-user-firstname-input"
                    className="responsive-modal-row-item"
                    placeholder="First Name"
                    onChange={this.updateNewUserInfo}
                    value={createUser.newUser.firstName}
                    valid={!!createUser.newUser.firstName}
                    invalid={!createUser.newUser.firstName} />
                </div>
                <div className="responsive-modal-column create-user-margin">
                  <Label for="create-user-lastname-input">Last Name</Label>
                  <Input name={inputNames.LAST_NAME}
                    id="create-user-lastname-input"
                    className="responsive-modal-row-item"
                    placeholder="Last Name"
                    onChange={this.updateNewUserInfo}
                    value={createUser.newUser.lastName}
                    valid={!!createUser.newUser.lastName}
                    invalid={!createUser.newUser.lastName} />
                </div>
              </div>
              <div className="responsive-modal-row">
                <div className="responsive-modal-column create-user-margin">
                  <Label for="create-user-email-input">Email</Label>
                  <Input className="responsive-modal-row-item"
                    id="create-user-email-input"
                    name={inputNames.EMAIL}
                    onChange={this.updateNewUserInfo}
                    value={createUser.newUser.email}
                    valid={!!createUser.newUser.email}
                    invalid={!createUser.newUser.email}
                    placeholder="Email" />
                </div>
                <div className="responsive-modal-column create-user-margin">
                  <Label for="create-user-phoneNumber-input">Phone Number</Label>
                  <Input className="responsive-modal-row-item"
                    id="create-user-phoneNumber-input"
                    name={inputNames.PHONE}
                    onChange={this.updateNewUserInfo}
                    value={createUser.newUser.phoneNumber}
                    valid={!!createUser.newUser.phoneNumber}
                    invalid={!createUser.newUser.phoneNumber}
                    placeholder="Phone Number" />
                </div>
              </div>
              <div className="responsive-modal-row create-user-buttons">
                <div className="responsive-modal-column create-user-margin">
                  <Label for="create-user-location-dropdown">Location</Label>
                  <Dropdown color="success" className="responsive-modal-row-item rev-btn"
                    id="create-user-location-dropdown"
                    isOpen={this.props.createUser.locationDropdownActive}
                    toggle={this.props.toggleLocationDropdown}>
                    <DropdownToggle caret>
                      {createUser.newUser.trainingAddress.alias || 'Location'}
                    </DropdownToggle>
                    <DropdownMenu>
                      {
                        addresses.trainingAddresses.length === 0
                          ? 
                          <>
                            <DropdownItem>Unable To Find Any Locations</DropdownItem>
                            <DropdownItem divider />
                          </>
                          : 
                          addresses.trainingAddresses.map(location =>
                            <DropdownItem key={location.addressId} onClick={() => this.props.updateNewUserLocation(location)}>{location.alias}</DropdownItem>
                          )
                      }
                    </DropdownMenu>
                  </Dropdown>
                </div>
                </div>
              <Button type="submit" className="rev-btn">Save</Button>
            </form>
          </Card>
        )
=======
      const { login } = this.props;
      // If new user just filled the sign up form, will be redirected automatically to the
      // cohort login page
      return (
      <div>  
      { login.currentUser.email ? 
          <div>
            <Button color='primary' onClick={this.joinCohort}>Join Cohort</Button>
          </div>
          :
          <div>
            <CreateUserComponent />    
         </div>
>>>>>>> fcea897333021fcd0005f5de99353e2353029cb2
      }
      </div>
      )
    }
}

const mapStateToProps = (state:IState, ownProps) => ({
  token: ownProps.match.params.token,
  // tslint:disable-next-line: object-literal-sort-keys
  login: state.managementState.auth,
  joinCohortState: state.managementState.joinCohort,
  history: ownProps.history
})


const mapDispatchToProps = {
  findCohortByToken,
  findLoggedInUser,
  joinCohort,
  updateLocations
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JoinCohortComponent))