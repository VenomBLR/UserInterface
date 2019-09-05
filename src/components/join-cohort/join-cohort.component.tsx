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
import { Card } from 'react-bootstrap';
import { BarLoader } from 'react-spinners';

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

  componentDidMount(){
  this.props.updateLocations();
  this.props.findCohortByToken(this.props.token, this.props.history);
  }

  componentDidUpdate() {
    if (this.props.login.currentUser.email && !this.props.joinCohortState.userToJoin.userId) {
      this.props.findLoggedInUser(this.props.login.currentUser, this.props.history);
    }
  }

  joinCohort = () => {
    if (this.props.joinCohortState.foundCohort.users.find((currentUser:IUser) => 
        ( currentUser.userId === this.props.joinCohortState.userToJoin.userId))) 
    {
        this.props.history.push('/');
        toast.info(`You are already in the ${this.props.joinCohortState.foundCohort.cohortName} cohort`);
    } else {
    this.props.joinCohort(this.props.joinCohortState.userToJoin, this.props.token, this.props.history);
  }
}

  // join cohort window has username and cohort name and a join button
  // after clicking join, take you to cohort page

  render() {
      const { login } = this.props;
      // If new user just filled the sign up form, will be redirected automatically to the
      // cohort login page
      return (
        <>  
        { 
          // If the token exists in the database
          this.props.joinCohortState.validToken ?
            (
              login.currentUser.email ?
              <>
                <Button color='primary' onClick={this.joinCohort}>Join Cohort</Button>
              </>
              :
              <>
                <CreateUserComponent />    
              </>
            ) 
          :
            (
              // Avoid showing "Cohort not found" if the data hasn't being fetched yet.
              // Instead, use a bar loader.
              this.props.joinCohortState.foundCohort ?
                (
                  <>
                    <Card>
                      Cohort Not found. Please verify the link.
                    </Card>
                  </>
                )
              :
                (
                  <>
                    <BarLoader/>
                  </>
                )
            )
        }
        </>
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