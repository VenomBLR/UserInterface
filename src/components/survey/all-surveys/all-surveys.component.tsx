import React, { Fragment, Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Table, Button } from 'reactstrap';
import { ISurvey } from '../../../model/surveys/survey.model';
import SurveyModal from './survey-assign-modal.component';
import { surveyClient } from '../../../axios/sms-clients/survey-client';
import { IAuthState } from '../../../reducers/management';
import { IState } from '../../../reducers';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import { FaSearch } from 'react-icons/fa';

interface IComponentProps extends RouteComponentProps<{}> {
  auth: IAuthState;
}

interface IComponentState {
  surveys: ISurvey[];
  surveysLoaded: boolean;
  surveysToAssign: number[];
  redirectTo: string | null;
  closingFilter: boolean;
  listFiltered: ISurvey[];
  title: string;
  description: string;
  filterOption: string;
  currentPage: number;
  totalPages: number;
}

export class AllSurveysComponent extends Component<
  IComponentProps,
  IComponentState
> {
  constructor(props) {
    super(props);
    this.state = {
      surveys: [],
      surveysLoaded: false,
      surveysToAssign: [],
      redirectTo: null,
      closingFilter: false,
      listFiltered: [],
      title: '',
      description: '',
      filterOption: 'Filter By',
      currentPage: 0,
      totalPages: 0,
    };
  }

  componentDidMount() {
    this.loadAllSurveys(0);
  }

  // When the user clicks a data button for a survey, redirect to the data page for that survey
  handleLoadSurveyData = (surveyId: number) => {
    this.setState({
      redirectTo: `/surveys/survey-data/${surveyId}`,
    });
  };

  // When the user clicks a users button for a survey, redirect to the respondents page for that survey
  loadSurveyRespondents = (surveyId: number) => {
    this.setState({
      redirectTo: `/surveys/respondents-data/${surveyId}`,
    });
  };

  // Added this code because I was having issues accessing this property in a later function
  // Used to return closing date by the index provided in the array that is passed
  getClosingDate = (array, index) => {
    return array[index].closingDate;
  };

  // Purpose of this function is to set a property of the state to only the surveys whose closing dates have passed
  returnPassedSurveys = arr => {
    let closingSurvey = arr;
    let filtered: ISurvey[] = [];
    for (let i = 0; i < closingSurvey.length; i++) {
      if (closingSurvey[i].closingDate !== null) {
        if (new Date(closingSurvey[i].closingDate) < new Date()) {
          filtered.push(closingSurvey[i]);
        }
      }
    }
    this.setState({
      listFiltered: filtered,
    });
  };

  // Returns surveys that are still active and sets the listFiltered array to this data.
  returnActiveSurveys = arr => {
    let activeSurvey = arr;
    let filtered: ISurvey[] = [];
    filtered = activeSurvey.filter(survey => {
      if (new Date(survey.closingDate) > new Date()) {
        return true;
      } else if (survey.closingDate === null) {
        return true;
      }
      return false;
    });
    this.setState({
      listFiltered: filtered,
    });
  };

  // Function called when user filters surveys by closing date if surveys had passed.
  // Sets a boolean check to decide whether a filtered or non-filtered list is rendered
  filterListByClosing = () => {
    this.setState({
      closingFilter: true,
      filterOption: 'Closed',
    });
    this.returnPassedSurveys(this.state.surveys);
  };

  // Function called when user filters surveys by closing date if surveys are still active.
  // Sets a boolean check to decide whether a filtered or non-filtered list is rendered
  filterListByActive = () => {
    this.setState({
      closingFilter: true,
      filterOption: 'Active',
    });
    this.returnActiveSurveys(this.state.surveys);
  };

  // Function called when user filters surveys by creator if surveys had passed.
  // Sets a boolean check to decide whether a filtered or non-filtered list is rendered
  filterListByMySurveys = () => {
    this.setState({
      closingFilter: true,
      filterOption: 'My Surveys',
    });
    this.returnPassedSurveys(this.state.surveys);
  };

  // Method used to remove filter from data list
  unFilterList = () => {
    this.setState({
      closingFilter: false,
      filterOption: 'Filter By',
    });
  };

  checkFunc = e => {
    const { checked } = e.target;
    const id = +e.target.id;

    if (checked) {
      if (!this.state.surveysToAssign.includes(id)) {
        this.setState({
          surveysToAssign: [...this.state.surveysToAssign, id],
        });
      }
    } else {
      if (this.state.surveysToAssign.includes(id)) {
        this.setState({
          surveysToAssign: this.state.surveysToAssign.filter(surveyId => {
            return surveyId !== id;
          }),
        });
      }
    }
  };

  // this function set the state after the input box has been unselected after this,
  setTitleChange = async event => {
    this.setState({
      title: event.target.value,
    });
  };

  // the getsurvey button would sent the state to the surveyClient as parameter
  getSurveysByTitle = async event => {
    event.preventDefault();
    if (this.state.title) {
      const surveyByTitle = await surveyClient.findSurveyByTitle(
        this.state.title,
      );
      this.setState({
        surveys: surveyByTitle,
        surveysLoaded: true,
      });
    } else {
      this.loadAllSurveys(0);
    }
  };

  // this function set the state after the input box has been unselected after this,
  setDescriptionChange = event => {
    this.setState({
      description: event.target.value,
    });
  };

  // the getdescription button would sent the state to the surveyClient as paramerter
  getSurveysByDescription = async event => {
    event.preventDefault();
    if (this.state.description) {
      const surveyByDescription = await surveyClient.findSurveyByDescription(
        this.state.description,
      );
      this.setState({
        surveys: surveyByDescription,
        surveysLoaded: true,
      });
    } else {
      this.loadAllSurveys(0);
    }
  };

  // Load the surveys into the state
  loadAllSurveys = async (page: number) => {
    const allSurveys = await surveyClient.findAllByPage(page);
    let publicSurveys: any[] = [];
    allSurveys.data.content.forEach(survey => {
        if (survey.published) {
          publicSurveys.push(survey);
        }
      });
    this.setState({
      surveys: publicSurveys,
      totalPages: allSurveys.data.totalPages,
      surveysLoaded: true,
      currentPage: page
    });
  };

  incrementPage = async () => {
    if (this.state.currentPage < this.state.totalPages - 1) {
      const newPage = this.state.currentPage + 1;
      await this.loadAllSurveys(newPage);
      
    }
  };

  decrementPage = async () => {
    if (this.state.currentPage > this.state.surveys.length) {
      const newPage = this.state.currentPage - 1;
      await this.loadAllSurveys(newPage);
    }
  };

  // Used to route user filter selection to appropriate function
  filterCheck = e => {
    const { id: option } = e.target;
    switch (option) {
      case 'Active':
        this.filterListByActive();
        break;
      case 'Closed':
        this.filterListByClosing();
        break;
      case 'My Surveys':
        this.filterListByMySurveys();
        break;
      case 'None':
        this.unFilterList();
        break;
      default:
        break;
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={this.state.redirectTo} />;
    }
    console.log(this.state.surveys);
    const sortOptions = ['Active', 'Closed', 'My Surveys', 'None'];
    return (
      <>
        {this.state.surveysLoaded ? (
          <Fragment>
            <div className='filterSelect'>
              <div className='dropdown sortCohortContainer'>
                {/* <button> */}
                {this.state.surveys.length > 0 && (
                  // <div className='assignButtonDiv'>
                  <span className='assignToCohorts'>
                    <SurveyModal
                      buttonLabel='Assign To Cohorts'
                      surveysToAssign={this.state.surveysToAssign}
                    />
                  </span>
                  // </div>
                )}
                {/* </button> */}
                <Button
                  className='btn sortByBtn dropdown-toggle'
                  type='button'
                  id='dropdownMenu2'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'>
                  Sort By
                </Button>
                <div className='dropdown-menu' aria-labelledby='dropdownMenu2'>
                  <ul className='list-group'>
                    {sortOptions.map(option => (
                      <li
                        id={option}
                        key={option}
                        className='list-group-item option-box'
                        onClick={e => this.filterCheck(e)}>
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Table striped id='manage-users-table' className='tableUsers'>
              <thead className='rev-background-color'>
                <tr>
                  <th>Select</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date Created</th>
                  <th>Closing Date</th>
                  <th>Published</th>
                  <th>Analytics</th>
                  <th>Respondents</th>
                </tr>
                {this.state.surveys.length > 0 && (
                  <tr style={secondHeadFilter}>
                    <td></td>
                    <td>
                      <div className='inputWrapper'>
                        <input
                          type='text'
                          id='inputTItle'
                          name='title'
                          className='inputBox form-control'
                          placeholder='Title'
                          value={this.state.title}
                          onChange={this.setTitleChange}
                        />
                        <button
                          type='submit'
                          className='btn btn-success searchbtn'
                          onClick={this.getSurveysByTitle}>
                          <FaSearch />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className='inputWrapper'>
                        <input
                          type='text'
                          id='inputDescription'
                          name='description'
                          className=' inputBox form-control'
                          placeholder='Description'
                          value={this.state.description}
                          onChange={this.setDescriptionChange}
                        />
                        <button
                          type='submit'
                          className='btn btn-success searchbtn'
                          onClick={this.getSurveysByDescription}>
                          <FaSearch />
                        </button>
                      </div>
                    </td>
                    <td>
                      {/* <DatePicker
                                                    onChange={this.getDateCreated}
                                                    value={this.state.createdDate}
                                                /> */}
                    </td>

                    <td>
                      {/* <DatePicker
                                                    onChange={this.getDateClosed}
                                                    value={this.state.endDate}
                                                /> */}
                    </td>

                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
              </thead>
              <tbody>
                {!this.state.surveys || !this.state.surveys.length ? (
                  <tr className='rev-table-row'>
                    <td colSpan={8}>
                      <div className='div-center fadeInUp'>
                        You don't have any surveys.{' '}
                        <>{console.log('I HAPPEN')}</>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {!this.state.closingFilter
                      ? this.state.surveys.map((
                          survey, // This.state.surveys is rendered if there is no filter
                        ) => (
                          <tr
                            key={survey && survey.surveyId}
                            className='rev-table-row'>
                            <td>
                              <input
                                type='checkbox'
                                onChange={e => this.checkFunc(e)}
                                id={survey && survey.surveyId.toString()}
                              />
                            </td>
                            <td>{survey && survey.title}</td>
                            <td>{survey && survey.description}</td>
                            <td>
                              {survey &&
                                (survey.dateCreated &&
                                  new Date(survey.dateCreated).toDateString())}
                            </td>
                            <td>
                              {survey &&
                                (survey.closingDate &&
                                  new Date(survey.closingDate).toDateString())}
                            </td>
                            <td>
                              {survey && (survey.published ? 'Yes' : 'No')}
                            </td>
                            <td>
                              <Button
                                className='assignSurveyBtn'
                                onClick={() =>
                                  this.handleLoadSurveyData(survey.surveyId)
                                }>
                                Data
                              </Button>
                            </td>
                            <td>
                              <Button
                                className='assignSurveyBtn'
                                onClick={() =>
                                  this.loadSurveyRespondents(survey.surveyId)
                                }>
                                Status
                              </Button>
                            </td>
                          </tr>
                        ))
                      : this.state.listFiltered.map((
                          filtered, // This.state.listFiltered is rendered if there is a filter.
                        ) => (
                          <tr
                            id={filtered.surveyId.toString()}
                            key={filtered.surveyId}
                            className='rev-table-row'>
                            <td>
                              <input
                                type='checkbox'
                                onChange={e => this.checkFunc(e)}
                              />
                            </td>
                            <td>{filtered.title}</td>
                            <td>{filtered.description}</td>
                            <td>
                              {filtered.dateCreated &&
                                new Date(filtered.dateCreated).toDateString()}
                            </td>
                            <td>
                              {filtered.closingDate &&
                                new Date(filtered.closingDate).toDateString()}
                            </td>
                            <td>{filtered.published ? 'Yes' : 'No'}</td>
                            <td>
                              <Button
                                className='assignSurveyBtn'
                                onClick={() =>
                                  this.handleLoadSurveyData(filtered.surveyId)
                                }>
                                Data
                              </Button>
                            </td>
                            <td>
                              <Button
                                className='assignSurveyBtn'
                                onClick={() =>
                                  this.loadSurveyRespondents(filtered.surveyId)
                                }>
                                Status
                              </Button>
                            </td>
                          </tr>
                        ))}
                  </>
                )}
              </tbody>
            </Table>
            {/* {1 > 3 && ( */}
            {/* {this.props.totalPages > 0 && ( */}

            <div className='row horizontal-centering vertical-centering'>
              <Button
                variant='button-color'
                className='rev-background-color div-child'
                onClick={this.decrementPage}>
                Prev
              </Button>
              <h6 className='div-child text-style'>
                {/* Page 1 of 3 */}
                Page {this.state.currentPage + 1} of {this.state.totalPages}
                {/* {this.props.totalPages} */}
              </h6>
              <Button
                variant='button-color'
                className='rev-background-color div-child'
                onClick={this.incrementPage}>
                Next
              </Button>
            </div>
            {/* )} */}
            {/* {this.state.surveys.length > 0 && (
                  <div className='assignButtonDiv'>
                    <SurveyModal
                      buttonLabel='Assign To Cohorts'
                      surveysToAssign={this.state.surveysToAssign}
                    />
                  </div>
                )} */}
          </Fragment>
        ) : (
          <Loader />
        )}
      </>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  auth: state.managementState.auth,
});

export default connect(mapStateToProps)(AllSurveysComponent);

const secondHeadFilter = {
  width: '100%',
  background: 'white',
};
