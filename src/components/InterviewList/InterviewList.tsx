import React from 'react';
import { connect } from 'react-redux';
import { getInterviewPages, markAsReviewed, setSelected } from '../../actions/interviewList/interviewList.actions';
import ReactPaginate from 'react-paginate'
import { IState } from '../../reducers';
import { Link } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';
import { Label } from 'reactstrap';
import { store } from '../../Store';
// import { Button } from 'react-bootstrap'; 
import ReviewButton from './ActionButtons/ReviewButton';
import { CookieStorage } from '@aws-amplify/auth';
// import { cognitoRoles } from '../../model/cognito-user.model';



export interface InterviewListProps {
    email: string,
    listOfInterviews: any[],

    numberOfPages: number,
    currentPage: number,
    pageSize: number,
    orderBy: string,
    direction: string,
    getInterviewPages: (
        pageNumber?: number,
        pageSize?: number,
        ordeyBy?: string,
        direction?: string,
        associateEmail?: string,
        managerEmail?: string,
        place?: string,
        clientName?: string,
        staging?: string) => void,
    markAsReviewed: (interviewId: number) => void,
    setSelected: (current: any) => void;
}

export interface InterviewListState {
    direction: string,
    loaded: boolean,
    tableHeaderId: string,
    previousTableHeaderId: string,
    listOfInterviews: any[],
    associateEmail: string,
    managerEmail: string,
    place: string,
    clientName: string,
    staging: string
}
const tableHeaderValues: Object =
{
    associateEmail: 'Associate Email',
    managerEmail: 'Manager Email',
    place: 'Location',
    client: 'Client',
    notified: 'Date Notified',
    scheduled: 'Date Scheduled',
    reviewed: 'Date Reviewed',
    associateInput: 'Associate Input',
    interviewFeedback: 'Interview Feedback'
}
// More comments 
export class InterviewList extends React.Component<InterviewListProps, InterviewListState> {
    constructor(props: InterviewListProps) {
        super(props);

        this.state = {
            direction: this.props.direction,
            loaded: false,
            tableHeaderId: '0',
            previousTableHeaderId: '1', //init diff values of tableHeaderId and previousTableHeaderId to start DESC sorting logic
            listOfInterviews: [],
            associateEmail: 'associateEmail',
            managerEmail: 'managerEmail',
            place: 'placeName',
            clientName: 'clientName',
            staging: 'stagingOff'
        }
    }

    async componentDidMount() {
        this.setState({
            listOfInterviews: this.props.listOfInterviews
        });
    }

    async componentWillReceiveProps(nextProps) { //Move props into state here
        this.setState({
            listOfInterviews: nextProps.listOfInterviews,
            //listOfInterviewsInitial: nextProps.listOfInterviews
        });
    }

    async componentDidUpdate() {
        console.log(this.state);

        if (!this.state.loaded) {
            this.setState({
                loaded: true
            });
            this.props.getInterviewPages(
                this.props.currentPage,
                this.props.pageSize,
                this.props.orderBy,
                this.props.direction,
                this.state.associateEmail,
                this.state.managerEmail,
                this.state.place,
                this.state.clientName,
                this.state.staging);
        }
    }

    handlePageClick = (data) => {
        console.log(data);

        this.props.getInterviewPages(data.selected,
            this.props.pageSize,
            this.props.orderBy,
            this.props.direction,
            this.state.associateEmail,
            this.state.managerEmail,
            this.state.place,
            this.state.clientName,
            this.state.staging);
    }

    changeOrderAsc = () => {
        this.setState({
            direction: 'ASC'
        })
    }

    changeOrderDesc = () => {
        this.setState({
            direction: 'DESC'
        })
    }

    changeOrderCriteria = async (event: any) => {



        await this.setState({
            tableHeaderId: event.currentTarget.id
        });

        //store page ASC or DESC
        let orderDirection;

        if (this.state.tableHeaderId === this.state.previousTableHeaderId) { //if click same header -> toggle ASC/DESC
            if (this.state.direction === 'ASC') {

                orderDirection = 'DESC'
                //this.setState({
                //    direction: 'DESC'
                //});
            } else {
                orderDirection = 'ASC'
                //this.setState({
                //    direction: 'ASC'
                //});
            }
        } else { //if click diff header -> sort ASC
            orderDirection = 'ASC'
            //this.setState({
            //    direction: 'ASC'
            //})
        }
        this.setState({
            previousTableHeaderId: this.state.tableHeaderId,
            direction: orderDirection
        });
        await this.props.getInterviewPages(
            0,
            this.props.pageSize,
            // event.currentTarget.id,
            this.state.tableHeaderId,
            this.state.direction,
            this.state.associateEmail,
            this.state.managerEmail,
            this.state.place,
            this.state.clientName,
            this.state.staging);
    }
    /*
                *** REDUNDANT CODE ***
                      FIX BELOW.
    */
    // changePageSize = (event: any) => {
    //     this.props.getInterviewPages(
    //         this.props.currentPage,
    //         event.currentTarget.value,
    //         this.props.orderBy,
    //         this.props.direction,
    //         this.state.associateEmail,
    //         this.state.managerEmail,
    //         this.state.place,
    //         this.state.clientName,
    //         this.state.staging);
    // }

    // filterByAssociateEmail = (event: any) => { //handle filter click by associate email
    //     console.log(event.currentTarget.value);

    //     if (event.currentTarget.value === 'associateEmail') {
    //         this.setState({
    //             associateEmail: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             event.currentTarget.value,
    //             this.state.managerEmail,
    //             this.state.place,
    //             this.state.clientName,
    //             this.state.staging);

    //     } else {
    //         this.setState({
    //             associateEmail: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             event.currentTarget.value,
    //             this.state.managerEmail,
    //             this.state.place,
    //             this.state.clientName,
    //             this.state.staging);
    //     }
    // }

    // filterByManagerEmail = (event: any) => { //handle filter click by manager email
    //     if (event.currentTarget.value === 'managerEmail') {
    //         this.setState({
    //             managerEmail: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             event.currentTarget.value,
    //             this.state.place,
    //             this.state.clientName,
    //             this.state.staging);
    //     } else {
    //         this.setState({
    //             managerEmail: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             event.currentTarget.value,
    //             this.state.place,
    //             this.state.clientName,
    //             this.state.staging);
    //     }
    // }

    // filterByPlace = (event: any) => { //handle filter click by place
    //     if (event.currentTarget.value === 'placeName') {
    //         this.setState({
    //             place: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             this.state.managerEmail,
    //             event.currentTarget.value,
    //             this.state.clientName,
    //             this.state.staging);
    //     } else {
    //         this.setState({
    //             place: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             this.state.managerEmail,
    //             event.currentTarget.value,
    //             this.state.clientName,
    //             this.state.staging);
    //     }
    // }

    // filterByClient = (event: any) => { //handle filter click by client
    //     if (event.currentTarget.value === 'clientName') {
    //         this.setState({
    //             clientName: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             this.state.managerEmail,
    //             this.state.place,
    //             event.currentTarget.value,
    //             this.state.staging);
    //     } else {
    //         this.setState({
    //             clientName: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             this.state.managerEmail,
    //             this.state.place,
    //             event.currentTarget.value,
    //             this.state.staging);
    //     }
    // }

    // filterByStaging = (event: any) => { //handle filter click by associate email
    //     console.log(event.currentTarget.value);

    //     if (event.currentTarget.value === 'stagingOff') {
    //         this.setState({
    //             staging: event.currentTarget.value
    //         });
    //         console.log("staging Off");

    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             this.state.managerEmail,
    //             this.state.place,
    //             this.state.clientName,
    //             event.currentTarget.value);

    //     } else {
    //         this.setState({
    //             staging: event.currentTarget.value
    //         });
    //         this.props.getInterviewPages(
    //             0,
    //             this.props.pageSize,
    //             this.props.orderBy,
    //             this.props.direction,
    //             this.state.associateEmail,
    //             this.state.managerEmail,
    //             this.state.place,
    //             this.state.clientName,
    //             event.currentTarget.value);
    //     }
    // }
    filterChange = (event: any) => {

        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        const pageSize = (name === 'pageSize') ? value : this.props.pageSize;
        const associateEmail = (name === 'associateEmail') ? value : this.state.associateEmail;
        const managerEmail = (name === 'managerEmail') ? value : this.state.managerEmail;
        const place = (name === 'place') ? value : this.state.place;
        const clientName = (name === 'client') ? value : this.state.clientName;
        const staging = (name === 'staging') ? value : this.state.staging;
        this.setState({
            associateEmail,
            managerEmail,
            place,
            clientName,
            staging,
        });
        this.props.getInterviewPages(
            0,
            pageSize as number,
            this.props.orderBy,
            this.props.direction,
            associateEmail,
            managerEmail,
            place,
            clientName,
            staging);
    }

    renderDate = (date: number) => {
        if (date > 0) {
            return new Date(date).toDateString()
        } else {
            return '-';
        }
    }

    getAssocInput = (entry: any) => {
        let url = (entry.associateInput ? 'viewAssocInput' : 'associateInput');
        let text = (entry.associateInput ? 'View' : 'Add');
        return (
            <td>
                {
                    <Link onClick={e => {
                        this.props.setSelected(entry.associateInput);
                    }} to={{
                        pathname: `/interview/${url}`,
                        state: { interviewId: entry.id }
                    }} >{`${text} Associate Input`}
                    </Link>
                }
            </td>
        );
    };
    // CHECKOUT HERE
    render() {
        //listOfInterviews: [{associateEmail: 1,...}, {associateEmail: 2,...}]
        const roles = (store.getState().managementState.auth.currentUser.roles);
        const isAdmin = (roles.includes('admin') || roles.includes('staging-manager') || roles.includes('trainer'));
        // const arrAssociateEmail1 = this.props.listOfInterviews.map((item) => { //convert interview array to place array
        //     return item.associateEmail;
        // });
        // const arrAssociateEmail2 = arrAssociateEmail1.filter((item, pos) => { //need unique places for select option
        //     console.log("Item: " + item + " Pos: " + pos);
        //     console.log(arrAssociateEmail1);
        //     return arrAssociateEmail1.indexOf(item) === pos;
        // });
        // const arrManagerEmail1 = this.props.listOfInterviews.map((item) => { //convert interview array to place array
        //     return item.managerEmail;
        // });
        // const arrManagerEmail2 = arrManagerEmail1.filter((item, pos) => { //need unique places for select option
        //     return arrManagerEmail1.indexOf(item) === pos;
        // });
        // const arrPlace1 = this.props.listOfInterviews.map((item) => { //convert interview array to place array
        //     return item.place;
        // });
        // const arrPlace2 = arrPlace1.filter((item, pos) => { //need unique places for select option
        //     return arrPlace1.indexOf(item) === pos;
        // });
        // //END CHECKOUT HERE
        // const arrClientName1 = this.props.listOfInterviews.map((item) => { //convert interview array to place array
        //     return item.client.clientName;
        // });
        // const arrClientName2 = arrClientName1.filter((item, pos) => { //need unique places for select option
        //     return arrClientName1.indexOf(item) === pos;
        // });
        let thKeys = Object.keys(tableHeaderValues);
        let thValues = Object.values(tableHeaderValues);
        return (
            <div className='container'>
                <div className='row'>
                    <div>
                        <div className='table-responsive-xl'>
                            <table className='table table-striped mx-auto w-auto'>
                                <thead className='rev-background-color'>
                                    <tr>
                                        {isAdmin ? <th>Reviewed</th> : <></>}
                                        {/* CHECKOUT THE FOLLOWING */}
                                        {thKeys.map((element, index) => {
                                            return (<th id={element} className='cursor-hover' onClick={this.changeOrderCriteria}>
                                                {/* guard operator to toggle arrow up and down */}
                                                {thValues[index]}
                                                {this.state.tableHeaderId === element && this.state.direction === 'DESC' && <IoIosArrowDown className='cursor-hover' onClick={this.changeOrderDesc} />}
                                                {this.state.tableHeaderId === element && this.state.direction === 'ASC' && <IoIosArrowUp className='cursor-hover' onClick={this.changeOrderAsc} />}
                                            </th>)
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.listOfInterviews.map((entry) => {
                                        return (<tr key={entry.id}>
                                            {/* {isAdmin? <td><input id={entry.id} type="checkbox" checked={entry.reviewed} onChange={this.markAsReviewed} /></td> : <></>} */}
                                            {/* {isAdmin? <td><ReviewButton className="text-warning" interviewId = {entry.id}/></td> : <></>} */}
                                            {/* Added isAdmin check before the review button to fix bug. Originally, checkbox was showing even when user wasn't admin.*/}
                                            {isAdmin ?
                                                <td><ReviewButton disabled={!isAdmin} interview={entry} assocInput={entry.associateInput || 'bleh'} /></td> : null}
                                            <td>{entry.associateEmail}</td>
                                            <td>{entry.managerEmail}</td>
                                            <td>{entry.place}</td>
                                            <td>{entry.client.clientName}</td>
                                            <td>{this.renderDate(entry.notified)}</td>
                                            <td>{this.renderDate(entry.scheduled)}</td>
                                            <td>{this.renderDate(entry.reviewed)}</td>
                                            {this.getAssocInput(entry)}
                                            <td>{
                                                entry.feedback ?
                                                    <Link to={{ pathname: "/interview/viewFeedback", state: { interviewId: entry.id } }}>Edit Interview Feedback</Link>
                                                    :
                                                    isAdmin ?
                                                        <Link to={{ pathname: `/interview/${entry.id}/feedback` }}>Complete Interview Feedback</Link>
                                                        :
                                                        <></>
                                            }</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                            <form>
                                <div className='form-row'>
                                    {thKeys.map((element, keyIndex) => {
                                        let filterCurrentArrValues: string[] = [];
                                        return (keyIndex < 4 ? <div className='col-1.5' style={{ width: '12%' }}>
                                            <select onChange={this.filterChange} name={element}
                                                value={this.state[element]} className='form-control'>
                                                <option value={element}>{thValues[keyIndex]}</option>
                                                {this.props.listOfInterviews.map((entry, index) => {
                                                    let currentNestedEntry = (entry[element] instanceof Object) ? entry[element].clientName : entry[element];
                                                    if (!filterCurrentArrValues.includes(currentNestedEntry)) {
                                                        filterCurrentArrValues.push(currentNestedEntry);
                                                        return (<option value={currentNestedEntry} key={index}>{currentNestedEntry}</option>)
                                                    }
                                                    return;
                                                })}
                                            </select>
                                        </div> : null)
                                        // <div className='col-1.5' style={{ width: '12%' }}>
                                        //     <select onChange={this.filterChange} name="managerEmail"
                                        //         value={this.state.managerEmail} className='form-control'>
                                        //         <option value='managerEmail'>Manager Email</option>
                                        //         {arrManagerEmail2.map((entry, index) => {
                                        //             return (
                                        //                 <option value={entry} key={index}>{entry}</option>
                                        //             );
                                        //         })}
                                        //     </select>
                                        // </div>
                                        // <div className='col-1' style={{ width: '8%' }}>
                                        //     <select onChange={this.filterChange} name="placeName"
                                        //         value={this.state.place} className='form-control'>
                                        //         <option value='placeName'>Location</option>
                                        //         {arrPlace2.map((entry, index) => {
                                        //             return (
                                        //                 <option value={entry} key={index}>{entry}</option>
                                        //             );
                                        //         })}
                                        //     </select>
                                        // </div>
                                        // {/* END CHECKOUT HERE*/}
                                        // <div className='col-1.5' style={{ width: '9%' }}>
                                        //     <select onChange={this.filterChange} name="clientName"
                                        //         value={this.state.clientName} className='form-control'>
                                        //         <option value='clientName'>Client</option>
                                        //         {arrClientName2.map((entry, index) => {
                                        //             return (
                                        //                 <option value={entry} key={index}>{entry}</option>
                                        //             );
                                        //         })}
                                        //     </select>
                                        // </div>
                                    })}
                                    <div className='col'>
                                        <select onChange={this.filterChange} value={this.state.staging}
                                            name='staging' className='form-control'>
                                            <option value='stagingOff'>Staging Off</option>
                                            <option value='stagingOn'>Staging On</option>
                                        </select>
                                    </div>
                                    <div className='col'>
                                        <select name='pageSize' onChange={this.filterChange} className='form-control'>
                                            <option value="" disabled selected hidden>Page</option>
                                            <option value={5} className={'justify-content-center'}>5</option>
                                            <option value={10} className={'justify-content-center'}>10</option>
                                            <option value={25} className={'justify-content-center'}>25</option>
                                            <option value={50} className={'justify-content-center'}>50</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <br />
                <ReactPaginate
                    previousLabel={'Prev'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    breakClassName={'page-item no-select justify-content-center'}
                    breakLinkClassName={'break-me-link page-link'}
                    pageCount={this.props.numberOfPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    forcePage={this.props.currentPage}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination page-navigator justify-content-center'}
                    activeClassName={'active'}
                    pageClassName={'page-item cursor-hover'}
                    pageLinkClassName={'paginate-link page-link no-select justify-content-center'}
                    nextClassName={'page-item cursor-hover'}
                    nextLinkClassName={'paginate-next page-link no-select justify-content-center'}
                    previousClassName={'page-item cursor-hover'}
                    previousLinkClassName={'paginate-previous page-link no-select justify-content-center'} />
            </div >
        );
    }
}

const mapStateToProps = (state: IState) => {
    return {
        email: state.managementState.auth.currentUser.email,
        listOfInterviews: state.interviewState.interviewList.listOfInterviews,
        numberOfPages: state.interviewState.interviewList.numberOfPages,
        currentPage: state.interviewState.interviewList.currentPage,
        pageSize: state.interviewState.interviewList.pageSize,
        orderBy: state.interviewState.interviewList.orderBy,
        direction: state.interviewState.interviewList.direction
    }
}

const mapDispatchToProps = {
    getInterviewPages,
    markAsReviewed,
    setSelected
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewList);
