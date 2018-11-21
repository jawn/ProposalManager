import React, { Component } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import { TeamsComponentContext, Panel, PanelBody, PanelFooter, PanelHeader } from 'msteams-ui-components-react';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { getQueryVariable } from '../common';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { PeoplePickerTeamMembers } from '../components/PeoplePickerTeamMembers';
import './teams.css';
import { Trans } from "react-i18next";
import Accessdenied from '../helpers/AccessDenied';


const DayPickerStrings = {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],

    shortMonths: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],

    days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    shortDays: [
        'S',
        'M',
        'T',
        'W',
        'T',
        'F',
        'S'
    ],

    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year'
};


const oppStatusOptions = [{ "text": 'Not Started', "key": 0 },
{ "text": 'In Progress', "key": 1 },
{ "text": 'Blocked', "key": 2 },
{ "text": 'Completed', "key": 3 }];

let teamContext = {};

export class ProposalStatus extends Component {
    displayName = ProposalStatus.name
    constructor() {
        super();

        this.authHelper = window.authHelper;
        this.sdkHelper = window.sdkHelper;
        this.accessGranted = false;
        this.state = {
            proposalDocumentList: [],
            loading: true,
            currentSelectedItems: [],
            peopleList: [],
            mostRecentlyUsed: [],
            showPicker: false,
            isUpdate: false,
            MessagebarText: "",
            haveGranularAccess: false
        };

        this.ddlStatusChange = this.ddlStatusChange.bind(this);
        //this.fnChangeOwner = this.fnChangeOwner.bind(this);
        this.toggleHiddenPicker = this.toggleHiddenPicker.bind(this);
        this._onSelectLastUpdated = this._onSelectLastUpdated.bind(this);
        this.fnUpdateFormalProposal = this.fnUpdateFormalProposal.bind(this);
        this._onRenderCell = this._onRenderCell.bind(this);
    }

    componentWillMount() {
        console.log("FormalProposal_componentWillMount isauth: " + this.authHelper.isAuthenticated());
    }

    componentDidMount() {
        console.log("FormalProposal_componentDidMount isauth: " + this.authHelper.isAuthenticated());
        if (!this.state.isAuthenticated) {
            this.authHelper.callGetUserProfile()
                .then(userProfile => {
                    this.setState({
                        userProfile: userProfile,
                        loading: true
                    });
                });
        }
    }


    componentDidUpdate() {
        if (this.authHelper.isAuthenticated() && !this.accessGranted) {
            console.log("FormalProposal_componentDidUpdate callCheckAccess");
            this.accessGranted = true;
            let teamName = getQueryVariable('teamName');
            this.fnGetOpportunityData(teamName);
        }
    }

    initialize({ groupId, channelName, teamName }) {
        //this.setState({ groupId, channelName, teamName });
        let tc = {
            group: groupId,
            channel: channelName,
            team: teamName
        };
        teamContext = tc;

        this.fnGetOpportunityData(teamName);
    }


    fnGetOpportunityData(teamName) {
        return new Promise((resolve, reject) => {
            // API - Fetch call
            //let requestUrl = "api/Opportunity?name='" + teamName + "'";
            //changing to template string
            this.requestUrl = `api/Opportunity?name=${teamName}`;
            //this.requestUrl = 'api/Opportunity?id=140';
            fetch(this.requestUrl, {
                method: "GET",
                headers: { 'authorization': 'Bearer ' + window.authHelper.getWebApiToken() }
            })
                .then(response => response.json())
                .then(data => {
                    // If badrequest - user Access Denied 
                    if (data.error && data.error.code.toLowerCase() === "badrequest") {
                        this.setState({
                            loading: false,
                            haveGranularAccess: false
                        });
                        resolve(true);
                    } else {
                        // Start Check Access
                        //Opportunity_Read_Partial,Opportunity_ReadWrite_Partial,CreditCheck_Read,CreditCheck_ReadWrite
                        let permissionRequired = ["Opportunity_ReadWrite_All", "Opportunities_ReadWrite_All", "Administrator"];
                        this.authHelper.callCheckAccess(permissionRequired).then(checkAccess => {
                            if (checkAccess) {
                                let peopleListAll = [];
                                if (data.teamMembers.length > 0) {
                                    for (let i = 0; i < data.teamMembers.length; i++) {
                                        let people = {};
                                        let item = data.teamMembers[i];
                                        if (item.displayName !== "") {
                                            people.key = item.id;
                                            people.imageUrl = "";
                                            people.displayName = item.displayName;
                                            people.primaryText = item.displayName;
                                            people.userPrincipalName = item.userPrincipalName;
                                            people.secondaryText = item.assignedRole.adGroupName;
                                            people.userRole = item.assignedRole.adGroupName;
                                            people.mail = item.mail;
                                            people.phoneNumber = "";
                                            peopleListAll.push(people);
                                        }
                                    }
                                }
                                let proposalSectionListArr = [];
                                let proposalSectionList = data.proposalDocument.content.proposalSectionList;
                                for (let p = 0; p < proposalSectionList.length; p++) {
                                    proposalSectionList[p].ddlStatusChange = (event) => this.ddlStatusChange(p);
                                    proposalSectionListArr.push(proposalSectionList[p]);
                                }

                                this.setState({
                                    loading: false,
                                    proposalDocumentList: proposalSectionListArr,
                                    teamMembers: data.teamMembers,
                                    peopleList: peopleListAll, // peopleListLoan
                                    mostRecentlyUsed: peopleListAll.slice(0, 5),
                                    oppData: data,
                                    haveGranularAccess: true
                                });
                                resolve(true);

                            } else {
                                this.setState({
                                    haveGranularAccess: false,
                                    loading: false
                                });
                                resolve(true);
                            }
                        })
                            .catch(err => {
                                //this.errorHandler(err, "FormalProposal_checkUserAccess");
                                this.setState({
                                    loading: false,
                                    isReadOnly: true,
                                    haveGranularAccess:false
                                });
                                //this.hideMessagebar();
                                reject(err);
                            });

                        // End Check Access
                        
                    }
                })
                .catch(function (err) {
                    console.log("Error: OpportunityGetByName--");
                    reject(err);
                    this.setState({
                        loading: false,
                        haveGranularAccess: false
                    });
                });


        });
    }


    fnUpdateFormalProposal(oppViewData) {
        this.setState({ isUpdate: true, MessagebarText: <Trans>updating</Trans> });


        // API Update call        
        this.requestUpdUrl = 'api/opportunity?id=' + oppViewData.id; //56';// + oppID;
        let options = {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer    ' + window.authHelper.getWebApiToken()
            },
            body: JSON.stringify(oppViewData),
            id: oppViewData.id
        };

        fetch(this.requestUpdUrl, options)
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.ok) {
                    return response.json;
                } else {
                    console.log('Error...: ');
                }
            }).then(json => {
                this.setState({ MessagebarText: <Trans>updatedSuccessfully</Trans> });
                console.log(json);
                // this.setState({ isUpdate: false, MessagebarText: "" });
                setTimeout(function () { this.setState({ isUpdate: false, MessagebarText: "" }); }.bind(this), 3000);
                //this.setState({ showPicker: false });
            });
    }

    /* Staus Update */

    ddlStatusChange = (idx) => (event) => {
        this.setState({ showPicker: false });
        let oppViewData = this.state.oppData;

        let propDoc = this.state.oppData.proposalDocument;

        let propSecItem = propDoc.content.proposalSectionList[idx];
        propSecItem.sectionStatus = event.key; //oppStatus[event.key];

        oppViewData.proposalDocument.content.proposalSectionList[idx] = propSecItem;
        this.fnUpdateFormalProposal(oppViewData);
    }

    /* Last Date Update */
    _onSelectLastUpdated = (idx) => (date) => {
        this.setState({ showPicker: false });
        let oppViewData = this.state.oppData;

        let propDoc = this.state.oppData.proposalDocument;

        let propSecItem = propDoc.content.proposalSectionList[idx];

        propSecItem.lastModifiedDateTime = date.toLocaleDateString();

        oppViewData.proposalDocument.content.proposalSectionList[idx] = propSecItem;
        this.fnUpdateFormalProposal(oppViewData);
        // this.fnUpdateFormalProposal(proposalDocumentObj,idx);
    }

    /* Owner updated */
    fnChangeOwnerNew(owner, idx) {
        if (owner.length > 0) {
            this.setState({ showPicker: false });
            let oppViewData = this.state.oppData;

            let propDoc = this.state.oppData.proposalDocument;

            let propSecItem = propDoc.content.proposalSectionList[idx];
            let selOwner = {
                "id": owner[0].key,
                "displayName": owner[0].text,
                "mail": owner[0].mail,
                "phoneNumber": "",//owner[0].phoneNumber,
                "UserPicture": "",//owner[0].imageUrl,
                "userPrincipalName": owner[0].userPrincipalName,
                "userRole": owner[0].userRole
            };
            propSecItem.owner = selOwner;

            oppViewData.proposalDocument.content.proposalSectionList[idx].owner = selOwner;

            this.fnUpdateFormalProposal(oppViewData);
        }
    }

    /* Date Picker */
    _setItemDate(lastModifiedDateTime) {
        //new Date(item.lastModifiedDateTime)
        let lmDate = new Date(lastModifiedDateTime);
        if (lmDate.getFullYear() === 1 || lmDate.getFullYear() === 0) {
            return new Date();
        } else return new Date(lastModifiedDateTime);
    }

    _onFormatDate = (date) => {
        return (
            date.getMonth() + 1 +
            '/' +
            date.getDate() +
            '/' +
            date.getFullYear()
        );
    }

    _onParseDateFromString = (value) => {
        const date = this.state.value || new Date();
        const values = (value || '').trim().split('/');
        const day =
            values.length > 0
                ? Math.max(1, Math.min(31, parseInt(values[0], 10)))
                : date.getDate();
        const month =
            values.length > 1
                ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1
                : date.getMonth();
        let year = values.length > 2 ? parseInt(values[2], 10) : date.getFullYear();
        if (year < 100) {
            year += date.getFullYear() - date.getFullYear() % 100;
        }
        return new Date(year, month, day);
    }

    toggleHiddenPicker() {
        this.setState({
            showPicker: !this.state.showPicker
        });
    }

    _onRenderColumn(item, index, column) {
        let value = item && column && column.fieldName ? item[column.fieldName] : '';

        if (value === null || value === undefined) {
            value = '';
        }

        return (
            <div
                className={'grouped-example-column'}
                data-is-focusable='true'
            >
                {value}
            </div>
        );
    }

    proposalListHeading() {
        return (
            <div className='ms-List-th TablHeading'>
                <div className='ms-List-th itemSections'><Trans>sections</Trans></div>
                <div className='ms-List-th-itemOwner'><Trans>owner</Trans></div>
                <div className='ms-List-th-itemStatus'><Trans>status</Trans></div>
                <div className='ms-List-th-itemLastUpdated'><Trans>lastUpdated</Trans></div>
            </div>
        );
    }

    proposalList(itemsList, tm) {
        // Add all team members to itemList Objec
        itemsList.AllTeamMembers = tm;
        const items = itemsList;

        return (
            <div>

                <FocusZone direction={FocusZoneDirection.vertical}>
                    <List
                        items={items}
                        onRenderCell={this._onRenderCell}
                        className='ms-List'
                    />
                </FocusZone>
            </div>
        );
    }

    _onRenderCell(item, idx) {
        return (
            <div className='ms-List-itemCell' data-is-focusable='true'>
                <div className='ms-List-itemContent'>
                    {
                        item.displayName.match(/\./g) === null ? <div className='ms-List-itemSections'>
                            {item.displayName}
                        </div> :
                            item.displayName.match(/\./g).length === 1 ?
                                <div className='ms-List-itemSections ms-padding-1'>
                                    {item.displayName}
                                </div> : item.displayName.match(/\./g).length === 2 ?
                                    <div className='ms-List-itemSections ms-padding-2'>
                                        {item.displayName}
                                    </div> : item.displayName.match(/\./g).length === 3 ?
                                        <div className='ms-List-itemSections ms-padding-3'>
                                            {item.displayName}
                                        </div> : ""

                    }
                    <div className='ms-List-itemOwner'>
                        <PeoplePickerTeamMembers teamMembers={this.state.peopleList} onChange={(e) => this.fnChangeOwnerNew(e, idx)} itemLimit='1' defaultSelectedUsers={[item.owner]} />
                    </div>
                    <div className='ms-List-itemStatus'>
                        <Dropdown
                            defaultSelectedKey={item.sectionStatus}
                            onChanged={this.ddlStatusChange(idx)}
                            options={oppStatusOptions}
                        />
                    </div>
                    <div className='ms-List-itemLastUpdated'>
                        <DatePicker strings={DayPickerStrings}
                            value={this._setItemDate(item.lastModifiedDateTime)}
                            showWeekNumbers={false}
                            firstWeekOfYear={1}
                            showMonthPickerAsOverlay='true'
                            iconProps={{ iconName: 'Calendar' }}
                            onSelectDate={this._onSelectLastUpdated(idx)}
                            formatDate={this._onFormatDate}
                            parseDateFromString={this._onParseDateFromString}
                        />
                    </div>
                </div>
            </div>
        );
    }


    render() {
        const proposalListHeading = this.proposalListHeading();
        const proposalListComponent = this.proposalList(this.state.proposalDocumentList, this.state.teamMembers);

        if (this.state.loading) {
            return (
                <div className='ms-BasicSpinnersExample pull-center'>
                    <Spinner size={SpinnerSize.medium} label={<Trans>loading</Trans>} ariaLive='assertive' />
                </div>
            );
        } else {
            return (
                <div>
                    <TeamsComponentContext>
                        {
                            this.state.haveGranularAccess
                                ?
                                <Panel>
                                    <PanelHeader />
                                    <PanelBody>
                                        <div className='ms-Grid '>
                                            <div className='ms-Grid-row' />
                                            <div className='ms-Grid-row'>
                                                <div className=' ms-Grid-col ms-sm6 ms-md8 ms-lg12 bgwhite tabviewUpdates noscroll'>
                                                    <h3><Trans>formalProposal</Trans></h3>
                                                    {
                                                        this.state.isUpdate ?
                                                            <MessageBar
                                                                messageBarType={MessageBarType.success}
                                                                isMultiline={false}
                                                            >
                                                                {this.state.MessagebarText}
                                                            </MessageBar>
                                                            : ""
                                                    }
                                                    {proposalListHeading}
                                                    {proposalListComponent}
                                                    <br />

                                                </div>
                                            </div>
                                        </div>


                                    </PanelBody>
                                    <PanelFooter />
                                </Panel>
                                :
                                <Accessdenied />
                        }
                    </TeamsComponentContext>
                </div >

            );
        }
    }
}
