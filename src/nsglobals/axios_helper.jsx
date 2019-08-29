import {showErrorAlert} from "./alerts";
import axios from "axios/index";
import Log from "nsglobals/Log";


function handleFail(message, failFunc)
{
    Log.error( message, 'axios_helper.jsx:handleFail()' );
    if (failFunc)
    {
        failFunc(message);
    }
    else
    {
        showErrorAlert("We've run into a problem!", message);
    }
}


// apiUrl and successFunc are required.  failFunc is optionional  The default is to show an error dialog to the user - i.e. with no failFunc provided.
export function doAxiosGet(apiUrl, successFunc, failFunc)
{
    Log.info( "GET: " + apiUrl, 'axios_helper.jsx:doAxiosGet()' );
    axios.get(apiUrl).then((response) =>
    {
        Log.info( 'Server responded with: ' + response.status + ' ' + response.statusText + ' for GET to: ' + apiUrl, 'axios_helper.jsx:doAxiosGet()');
        Log.info( response, 'axios_helper.jsx:doAxiosGet()' );
        if (response.status === 200)
        {
            if (response.data.resultCode === 0)
            {
                if (successFunc)
                {
                    successFunc(response.data.result);
                }
            }
            else
            {
                handleFail('Server returned the following: ' + response.data.resultDescription + ':  ' +  response.data.resultMessage, failFunc);
            }

        } else
        {
            handleFail('Server returned code ' + response.status + ': ' + response.statusText, failFunc);
        }

    }).catch((error) =>
    {
        Log.error( error, 'axios_helper.jsx:doAxiosGet()' );
        handleFail('Looks like the server may be down or another unexpected problem occured.', failFunc);
    });
}

export function doAxiosPost(apiUrl, postData, successFunc, failFunc)
{
    Log.info( "POST: " + apiUrl, 'axios_helper.jsx:doAxiosPost()' );
    Log.info( postData, 'axios_helper.jsx:doAxiosPost()' );
    axios.post(apiUrl, postData).then((response) =>
    {
        Log.info( 'Server responded with: ' + response.status + ' ' + response.statusText + ' for POST to: ' + apiUrl, 'axios_helper.jsx:doAxiosPost()');
        Log.info( response, 'axios_helper.jsx:doAxiosPost()' );
        if (response.status === 200)
        {
            if (response.data.resultCode === 0)
            {
                if (successFunc)
                {
                    successFunc(response.data.result);
                }
            }
            else
            {
                handleFail('Server returned the following: ' + response.data.resultDescription + ':  ' +  response.data.resultMessage, failFunc);
            }

        } else
        {
            handleFail('Server returned code ' + response.status + ': ' + response.statusText, failFunc);
        }

    }).catch((error) =>
    {
        Log.error( error, 'axios_helper.jsx:doAxiosPost()' );
        handleFail('Looks like the server may be down or another unexpected problem occured.', failFunc);
    });
}
