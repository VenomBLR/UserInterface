const mockReturn = {
    returnMySurveys: jest.fn(),
}

import { shallow, mount, render } from 'enzyme';
import { ISurvey } from '../../../model/surveys/survey.model';
import { AllSurveysComponent } from './all-surveys.component';
import { RouteComponentProps } from 'react-router';
import { IAuthState } from '../../../reducers/management';
import { createBrowserHistory } from 'history';


interface IComponentProps extends RouteComponentProps<{}> {
    auth: IAuthState;
}

let filler: any = null;
let d:IComponentProps = {auth: {
        currentUser: {
            email: "black.kruppa@revature.com",
            roles: ['staging-manager', 'trainer', 'admin']
        }
    },
    history: createBrowserHistory(),
    location: filler,
    match: filler
}


// mock data to work with filtering
let mySurveyArr: any = [
  {
    surveyId: 4,
    title: 'RC Survey',
    description: 'A survey for training feedback.',
    dateCreated: new Date('8/31/2019'),
    closingDate: null,
    template: false,
    published: true,
    creator: 'blake.kruppa@revature.com',
  },
  {
    surveyId: 5,
    title: 'Testing2',
    description: 'A survey for testing',
    dateCreated: new Date('5/31/2019'),
    closingDate: new Date('5-24-2019'),
    template: false,
    published: true,
    creator: '',
  },
  {
    surveyId: 6,
    title: 'Testingstuff',
    description: 'A survey for more testing',
    dateCreated: new Date('5/31/2019'),
    closingDate: new Date('5-10-2019'),
    template: false,
    published: true,
    creator: '',
  },
  {
    surveyId: 7,
    title: 'RC Survey',
    description: 'A survey for training feedback.',
    dateCreated: new Date('8/31/2019'),
    closingDate: null,
    template: false,
    published: true,
    creator: 'blake.kruppa@revature.com',
  },
  {
    surveyId: 8,
    title: 'Testing2',
    description: 'A survey for testing',
    dateCreated: new Date('5/31/2019'),
    closingDate: new Date('5-24-2019'),
    template: false,
    published: true,
    creator: 'blake.kruppa@revature.com',
  },
  {
    surveyId: 9,
    title: 'Testingstuff',
    description: 'A survey for more testing',
    dateCreated: new Date('5/31/2019'),
    closingDate: new Date('5-10-2019'),
    template: false,
    published: true,
    creator: '',
  },
];


describe('Testing search by My Surveys', () => {
    it('should Only return surveys created by the current user', () => {
        
       const mySurveys = mockReturn.returnActiveSurveys(mySurveyArr);
       mySurveys.find('dropdownMenu2').simulate('change', {
         target: { email: 'blake.kruppa@revature.com' },
       });

       expect(mySurveys).resolves;
    })
})
