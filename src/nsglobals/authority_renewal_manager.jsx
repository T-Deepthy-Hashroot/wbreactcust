import {showLoadingAlert} from "./alerts";
import {
    FIND_AUTHORITY_RENEWAL_REQUEST_API,
    GET_AUTHORITY_RENEWAL_REQUEST_API,
    AUHTORITY_RENEWAL_TRACKER_AUTHORITIES_API,
    AUTHORITY_RENEWAL_FIELD_OPTIONS_API,
    AUTHORITY_RENEWAL_SAVE_REQUEST_API
} from "./api_end_points";
import {doAxiosGet, doAxiosPost} from "./axios_helper";
import Log from "nsglobals/Log";


// For holding a loaded authority renewal request.
export let authorityRenewalRequest = {request: null};

export function isAuthorityRenewalRequestLoaded()
{
    return authorityRenewalRequest.request != null;
}

export function findAuthorityRenewalRequest(bureau, authority, expDt, statsEffDt, history, forceRefresh)
{
    const bureauParameter = "bureau=" + bureau;
    const authorityParameter = "authority=" + authority;
    const expDtParameter = "originalExpDt=" + expDt;
    const statsEffDtParameter = "statsEffDt=" + statsEffDt;
    const forceRefreshParameter = forceRefresh ? '&refresh=' + forceRefresh : '';

    authorityRenewalRequest.request = null;

    if (forceRefresh)
    {
        cachedAuthorityRenewals = null;
    }

    showLoadingAlert(true);

    let request = FIND_AUTHORITY_RENEWAL_REQUEST_API + "?" + bureauParameter + "&" + authorityParameter + "&" + expDtParameter + "&" + statsEffDtParameter + forceRefreshParameter;
    doAxiosGet(request, (result) =>
    {
        Log.info(result, 'authority_renewal_manager.jsx:findAuthorityRenewalRequest()');
        authorityRenewalRequest.request = result;


        Log.info(history, 'authority_renewal_manager.jsx:findAuthorityRenewalRequest()');
        showLoadingAlert(false);
        if (history)
        {
            history.push("/workbench/");
            history.push("/workbench/authority_renewal")
        }
        else
            Log.warn('No history.  Try exporting your component using export withRouter(MyComponent)', 'authority_renewal_manager.jsx:findAuthorityRenewalRequest()');
    })
}


let cachedAuthorityRenewals = null;

export function getAuthorityRenewals(callback, forceRefresh)
{
    if (forceRefresh || !cachedAuthorityRenewals)
    {

        const majorGroup = getSelectedMajorGroup();

        if (majorGroup && majorGroup !== '?')
        {

            let api = AUHTORITY_RENEWAL_TRACKER_AUTHORITIES_API + "?majorGroup=" + getSelectedMajorGroup();


            doAxiosGet(api, (result) =>
            {

                if (result)
                {
                    const today = new Date();
                    cachedAuthorityRenewals = result.map((obj, key) =>
                    {
                        return ({
                            id: key,
                            bureau: (obj.bureau ? obj.bureau : ""),
                            authority: (obj.authority ? obj.authority : ""),
                            majorGroup: obj.majorGroup,
                            bureau_authority: (obj.bureau ? obj.bureau + " " : "") + (obj.authority ? obj.authority : ""),
                            customer: obj.customer ? obj.customer : "",
                            carloads: obj.carloadsRY ? obj.carloadsRY : 0,
                            revenue: obj.nsRevenueRY ? obj.nsRevenueRY : 0,
                            expDt: obj.expDt,
                            effDt: obj.effDt,
                            countdown: obj.expDt ? Math.floor((new Date(obj.expDt).getTime() - today.getTime()) / (1000 * 60 * 60 * 24) + 1) : 0,
                            totalContribution: obj.contributionRY ? obj.contributionRY : 0,
                            numberOfSections: obj.sections,
                            lanes: obj.lanes ? obj.lanes : 0,
                            marketManager: obj.marketManager,
                            status: obj.status,
                            statsDt: obj.statsEffDate,
                            requestID: obj.requestID,
                        })
                    });
                }
                else
                {
                    cachedAuthorityRenewals = [];
                }
                callback(cachedAuthorityRenewals);

            });

        }
        else
        {
            cachedAuthorityRenewals = [];
            callback(cachedAuthorityRenewals);
        }
    }
    else
    {
        callback(cachedAuthorityRenewals);
    }


}


export function getAuthorityRenewalRequest(requestID, history)
{

    const requestIDParameter = "requestId=" + requestID;

    showLoadingAlert(true);

    let api = GET_AUTHORITY_RENEWAL_REQUEST_API + "?" + requestIDParameter;

    doAxiosGet(api, (result) =>
    {
        authorityRenewalRequest.request = result;
        showLoadingAlert(false);
        history.push("/workbench/authority_renewal");
    });
}


// for handling filter changes in the Authority Renewal Tracker
export const TRACKER_FILTER = {
    UPCOMING: 'UPCOMING',
    EXPIRED: 'EXPIRED',
    COMPLETED: 'COMPLETED',
    ALL: 'ALL',
}

const trackerFilterListener = {listener: null};

export function registerTrackerFilterChangeListener(func)
{
    trackerFilterListener.listener = func;
}

export function trackerFilterChanged(filter)
{
    trackerFilterListener.listener(filter);
}


// for handling lane column group changes in the Authority Renewal Lanes
const laneColumnGroupSelectionListener = {listener: null}

export function registerLaneColumnGroupChangeListener(func)
{
    laneColumnGroupSelectionListener.listener = func;
}

export function laneColumnGroupChanged(group)
{
    laneColumnGroupSelectionListener.listener(group);
}


export function clearAuthorityRenewalRequest(history)
{
    authorityRenewalRequest.request = null;
    history.push("/workbench/authority_renewal");
}


let selectedMajorGroup = null;

export function setSelectedMajorGroup(_selectedMajorGroup)
{
    selectedMajorGroup = _selectedMajorGroup;
}

export function getSelectedMajorGroup()
{
    return selectedMajorGroup;
}

let majorGroupOptions = null;

export function getMajorGroupOptions(callback)
{
    if (!majorGroupOptions)
    {
        let api = AUTHORITY_RENEWAL_FIELD_OPTIONS_API + "?fieldName=MajorGroup";

        doAxiosGet(api, (result) =>
        {
            majorGroupOptions = result;
            callback(majorGroupOptions);
        });

    } else
    {
        callback(majorGroupOptions);
    }
}

export function saveRenewalRequest(history)
{
    showLoadingAlert(true);
    const json = authorityRenewalRequest.request;

    Log.info(JSON.stringify(json));
    doAxiosPost(AUTHORITY_RENEWAL_SAVE_REQUEST_API, json, (result) =>
    {
        authorityRenewalRequest.request = result;
        showLoadingAlert(false);
        history.push("/workbench/authority_renewal");
    });
}


// TODO implement column and lane caching for authority renewals

// TODO implement last sort, last page, last filter





