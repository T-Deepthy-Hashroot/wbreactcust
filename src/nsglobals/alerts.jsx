import React from "react";
import SweetAlert from "react-bootstrap-sweetalert"

import loadingImage from "nsassets/img/Workbench-Loading-Screen-Animation.gif";


const alert = {callback: null};

const nullAlert = {alert: null};


const LoadingAlert = {
    alert:
        (<SweetAlert
            style={{display: "block", marginTop: "-150px", backgroundColor: 'rgba(0, 0, 0, 0.0)'}}
            title=""
            showConfirm={false}
            onConfirm={() => {}}
        >
            <img style={{width: '300px'}} src={loadingImage} alt="Loading..."/>
        </SweetAlert>)
}

export function showLoadingAlert(showIt)
{
    if (alert.callback && showIt)
    {
        alert.callback(LoadingAlert);
    }
    else if (alert.callback)
    {
        alert.callback(nullAlert);
    }
}


export function registerAlertCallback(func)
{
    alert.callback = func;
}


export function showErrorAlert(title, message, alertComponent)
{
    let alertObj = null;
    if (alertComponent)
    {
        alertObj = {
            alert: alertComponent
        }
    }
    else
    {
        // create an alert component
        alertObj = {
            alert: (
                <SweetAlert
                    type='error'
                    title={title}
                    showConfirm={false}
                    onConfirm={() => {alert.callback(nullAlert)}}
                    onCancel={() => {alert.callback(nullAlert)}}
                    >
                    {message}
                </SweetAlert>
            )
        }
    }

    if ( alert.callback )
    {
        alert.callback( alertObj );
    }
}

