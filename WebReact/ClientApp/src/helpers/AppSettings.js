/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

// General settings
export const appUri = 'https://proposal-manager.azurewebsites.net'; //Base Url generated by Azure for the web service.

// This Section is Required to be updated before the initial publish to Azure.
export const clientId = '7e2ffb00-c152-4759-b76b-59fe0693bdf0'; //Registered Application Id from apps.dev.microsoft.com.
export const redirectUri = appUri + "/"; //Redircet Url used at authentication.
export const instanceId = 'https://login.microsoftonline.com/';
export const graphScopes = ["offline_access", "profile", "User.ReadBasic.All", "mail.send"]; //User scopes defined at app registration.
export const graphScopesAdmin = ["offline_access", "profile", "User.Read.All", "mail.send", "Sites.ReadWrite.All", "Files.ReadWrite.All", "Group.ReadWrite.All"]; //Application scopes defined at app registration.
export const webApiScopes = ["api://7e2ffb00-c152-4759-b76b-59fe0693bdf0/access_as_user"];// web Api scope generated at app registration from apps.dev.microsoft.com.
export const authority = "https://login.microsoftonline.com/9ec16324-e534-4d84-81de-59a03f343e20"; // Null for login as common (multi-tenant also) eg. https://login.microsoftonline.com/common/oauth2/v2.0/authorize

//No need  to update anything bellow these are placeholders
const generalProposalManagementTeam = ""; //The Proposal Manager general team name that contains all the administration functionality.
const teamsAppInstanceId = ""; //Id of the Proposal Manager application instaled in teams.
const localStorePrefix = "env1_"; //Local Store Prefix.
const teamsAppName = ""; //The short Name specified in the appllication manifest file.
const reportId = ""; //PowerBI Report Id.
const workspaceId = ""; //PowerBI WorkSpace Id.

export const appSettingsObject = {
    generalProposalManagementTeam,
    teamsAppInstanceId,
    localStorePrefix,
    teamsAppName,
    reportId,
    workspaceId
};

export default appSettingsObject;