import React from 'react';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

import ReactTable from "react-table";

// getting api call
import { AUTHORITY_QESP_INCREASE_REQUEST } from '../../nsglobals/api_end_points';
import { doAxiosPost } from "nsglobals/axios_helper";
import { getRacf } from '../../nsglobals/user';

const greenTheme = createMuiTheme({ palette: { primary: green } });
const override = css`
    display: flex;
    margin: 10 10 10;
    border-color: green;
`;

function lastDayOfMonth(y,m){
	return  y + "-" + m + '-' + new Date(y, m , 0).getDate();
}

let getSelectedData = (rowsChecked, data) => {
  return new Promise (async (resolve, reject) => {

    let selectedData = [];
    rowsChecked.forEach(function(item, i) {
      if(item){
        let calculatedEffDate = new Date(data[i]['expDt']);
        calculatedEffDate.setFullYear(calculatedEffDate.getFullYear() - 1);
        calculatedEffDate.setDate(calculatedEffDate.getDate() + 1);
		calculatedEffDate = calculatedEffDate.toISOString().split('T')[0];
		
        
        let calculatedExpDate = new Date(data[i]['expDt']);
		calculatedExpDate.setMonth(calculatedExpDate.getMonth() + 4);
		
		calculatedExpDate = lastDayOfMonth(calculatedExpDate.getFullYear(), calculatedExpDate.getMonth());

		
        let effDatePlus1 = new Date(data[i]['expDt']);
        effDatePlus1.setDate(effDatePlus1.getDate() + 1);

        let percentIncrease = 0; // ['percentIncrease']
        if (data[i]['percentIncrease']) {
          percentIncrease = data[i]['percentIncrease'];
        }
        
        let parameters = {
          "requestId" : data[i]['requestID'],
          "bureau" : data[i]['bureau'],
          "authNum" : data[i]['authority'],
          "originalExpDate" : data[i]['expDt'],
		  "statsEffDate" : calculatedEffDate,
		  
		  "effDate" : effDatePlus1,
          "expDate" : calculatedExpDate,
          "percentIncrease" : percentIncrease,
          "publish" : false,
          "allowRepublish" : false
        };

        selectedData.push(parameters);
      }
    });
    resolve(selectedData);
  });
};

let postIncreaseRequest = (request) => {
  return new Promise (async (resolve, reject) => {

    let apiUrl = AUTHORITY_QESP_INCREASE_REQUEST + '?RACF=' + getRacf(); 
    doAxiosPost(apiUrl, request, (result) => {
      resolve(result);
    });

  });
};

let publishIncreaseRequest = (data, tableData) => {
  return new Promise (async (resolve, reject) => {

	let publishData = [];

	tableData.forEach(function(item1, i1) {
		if(item1['editAbleEffDate']['editIt'] === 'yes') {

        let calculatedEffDate = new Date(item1['originalExpDate']);
        calculatedEffDate.setFullYear(calculatedEffDate.getFullYear() - 1);
        calculatedEffDate.setDate(calculatedEffDate.getDate() + 1);
		calculatedEffDate = calculatedEffDate.toISOString().split('T')[0];

		let temp = {
			'requestId': item1['requestId'],
			'originalExpDate': item1['originalExpDate'],
			'statsEffDate': calculatedEffDate,
			'effDate': item1['editAbleEffDate']['dateN'],
			'expDate': item1['editAbleExpDate']['dateN'],
			'percentIncrease': item1['percentIncrease'],
			'publish': true,
			'allowRepublish': true,
			'comments': item1['validation']
		}

			publishData.push(temp);
		}
	});

    let apiUrl = AUTHORITY_QESP_INCREASE_REQUEST + '?RACF=' + getRacf(); 
    doAxiosPost(apiUrl, publishData, (result) => {
	  resolve(result);
	  
    });
  });
};

function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [dataTable, setDataTable] = React.useState([]);
  const [dataTableConfirm, setDataTableConfirm] = React.useState([]);

  // need same parameters for second call, so saving them
  const [postParameters, setPostParameters] = React.useState('');

  const [load, setLoad] = React.useState(false);
  const [circularLoading, setCircularLoading] = React.useState(false);
  const [confirmError, setConfirmError] = React.useState(false);

  async function handleClickOpen() {
	setCircularLoading(true);

	if(props.rowsChecked.length !== 0) {

		let selectedData = await getSelectedData(props.rowsChecked, props.editedData);
		let increaseRequestResult = await postIncreaseRequest(selectedData);
		let rowColor = '';
		let trackCount = 0;
		
		increaseRequestResult.forEach( function(item, i) {
			if(item) {

				increaseRequestResult[i]['tempPercentIncrease'] = increaseRequestResult[i]['percentIncrease'] + '%';

				if(increaseRequestResult[i]['header'] === true) {
					increaseRequestResult[i]['editAbleEffDate'] = {editIt: 'yes', dateN: increaseRequestResult[i]['effDate']};
					increaseRequestResult[i]['editAbleExpDate'] = {editIt: 'yes', dateN: increaseRequestResult[i]['expDate']};

					rowColor = (trackCount & 1) ? 'white' : '#eeeeee';
					trackCount++;

					increaseRequestResult[i]['rowColorGrey'] = rowColor;
				} else {
					increaseRequestResult[i]['editAbleEffDate'] = {editIt: 'no', dateN: increaseRequestResult[i]['effDate']};
					increaseRequestResult[i]['editAbleExpDate'] = {editIt: 'no', dateN: increaseRequestResult[i]['expDate']};

					increaseRequestResult[i]['rowColorGrey'] = rowColor;
					
					if (increaseRequestResult[i]['totalLanes'] === increaseRequestResult[i]['validLanes']) {
						increaseRequestResult[i]['tempAuthority'] = <p style={{ color: 'green' }}>&#10003;</p>;
						increaseRequestResult[i]['validation'] = <p style={{ color: 'green' }}>No Errors.</p>;
					} else {
						increaseRequestResult[i]['validation'] = 'Error: ' + increaseRequestResult[i]['errors'];
						increaseRequestResult[i]['tempAuthority'] = <p style={{ color: 'red' }}>&#10008;</p>;
					}
				}
			}
		});

		setPostParameters(selectedData);
		setDataTable(increaseRequestResult);
		setLoad(true);
		setOpen(true);
	}
	setCircularLoading(false);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleCloseConfirm() {
	setOpenConfirm(false);
	//window.location.reload();

	window.authRenewTrackTableComponent.refreshTheTableWithNSSMFilter();
  }

  function handleContact() {

	let errorIds = '';
	
	dataTableConfirm.forEach( function(item, i) {
		if(item) {

			if (errorIds.length === 0 && dataTableConfirm[i]['errorIds']) {
				errorIds = dataTableConfirm[i]['errorIds'];
			} else if ( dataTableConfirm[i]['errorIds'] ) {
				errorIds = errorIds + ',' + dataTableConfirm[i]['errorIds'];
			}
		}
	});
	
	  var email = 'WorkbenchSupport@nscorp.com';
	  
	  document.location = "mailto:" + email + "?subject=" + errorIds + "&body=" + errorIds;
  }

  async function submitData () {
	  
	let result = await publishIncreaseRequest(postParameters, dataTable);
	setOpen(false);

	var errorRequestIdsTemp = [];
	var errorIds = [];
	let finalJSON = [];
	
	result.forEach( function(item, i) {
		if(item) {

			if(result[i]['errors'] && result[i]['errors'].length > 0) {
				
				if (errorIds.length === 0 && result[i]['authority'] && result[i]['requestId']) {
					errorIds = 'WB Error: Authority = ' + result[i]['authority'] + ' and RequestId = ' + result[i]['requestId'];
				} else if ( result[i]['authority'] && result[i]['requestId'] ) {
					errorIds = errorIds + ', ' + 'Authority = ' + result[i]['authority'] + ' and RequestId = ' + result[i]['requestId'];
				}
				
				errorRequestIdsTemp.push(result[i]['authority']);
			}
		}
	  });

	  if(errorRequestIdsTemp.length && errorRequestIdsTemp.length > 0) {
		  finalJSON.push({
						'confirmMessage': <p style={{ color: 'red' }}>Oops. Something went wrong! Please contact WorkbenchSupport@nscorp.com.</p>,
						'errorIds' : errorIds
					},
					{
						'confirmMessage': 'Sections that did not publish: ' + errorRequestIdsTemp
					});
		//finalJSON.push(errorRequestIdsTemp);
		
		  setConfirmError(true);
	  } else {
		  finalJSON.push({'confirmMessage': <p style={{ color: 'green' }}>Validated sections successfully published!</p> });
		  setConfirmError(false);
	  }

	//result.push(errorRequestIds);
	
	setDataTableConfirm(finalJSON);
	
    setOpenConfirm(true);
  }


  function renderEditableComments(cellInfo) {

	let data = dataTable[cellInfo.index][cellInfo.column.id];

	if(cellInfo.row['editAbleExpDate']['editIt'] === 'yes') {

		return (
			<input
			name="inputText"
			type="text"
			maxLength="78"
			onChange = {e => {
				dataTable[cellInfo.index][cellInfo.column.id] = e.target.value;
				data = e.target.value;
			}}
        	defaultValue = {data}
			style={{width: "550px"}}
			/>
		);
	} else {
		return cellInfo.row['validation'];
	}
  };

  function renderEditable(cellInfo) {

	let data = dataTable[cellInfo.index][cellInfo.column.id]['dateN'];
	
    return (
        <input
        name="input"
        type="date"
        onChange = {e => {
          dataTable[cellInfo.index][cellInfo.column.id]['dateN'] = e.target.value;
          data = e.target.value;
        }}
        defaultValue = {data}
        style={{width: "150px"}}
      />
    );
  };

  const columns = [{
    Header: "",
    accessor: 'tempAuthority',
    width: 18,
    style: { 'white-space': 'unset' }
  },
  {
    Header: "Authority/Section",
    accessor: 'authority',
    width: 170,
    style: { 'white-space': 'unset' }
  },
  {
    Header: 'Effective',
    accessor: 'editAbleEffDate', 
    width: 170,
    style: { 'white-space': 'unset' },
	Cell: row => row.row.editAbleEffDate.editIt === 'yes' ? renderEditable(row) : row.row.editAbleEffDate.dateN
	//Cell: renderEditable
  },
  {
    Header: 'Expiration',
	accessor: 'editAbleExpDate',
    width: 170,
    style: { 'white-space': 'unset' },
	Cell: row => row.row.editAbleExpDate.editIt === 'yes' ? renderEditable(row) : row.row.editAbleExpDate.dateN
  },
  {
    Header: 'Increase',
    accessor: 'tempPercentIncrease',
    style: { 'white-space': 'unset' }
  },
  {
    Header: 'Lanes',
    accessor: 'totalLanes',
    style: { 'white-space': 'unset' }
  },
  {
    Header: 'Validation/Comments',
    accessor: 'validation',
	  width: 558,
	  Cell: renderEditableComments
  }
  ];

  const columnsConfirm = [
  {
    Header: '',
    accessor: 'confirmMessage',
    width: 600,
	sortable: false,
	filterable: false
  }
  ];

  return (
    <div>
      <MuiThemeProvider theme={greenTheme}>
        <ClipLoader
          css={override}
          sizeUnit={"px"}
          size={25}
          color={'green'}
          loading={circularLoading}
        />
        <Button color="primary" variant="raised" onClick={handleClickOpen}>
          Submit
        </Button>
      </MuiThemeProvider>
      <p></p>
      <p></p>
      
      <Dialog maxWidth='xl' open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Publish Data</DialogTitle>
        <DialogContent>
          {
            load ?
              <ReactTable
                getTrProps={(state, rowInfo) => {
                  if(rowInfo && rowInfo.row ) {
                    return {
                      style: {
                        background: rowInfo.row['_original']['rowColorGrey']
                      }
                    };
                  } else {
                    return {};
                  }
                }}
                data={dataTable}
                columns={columns}
                showPagination={false}
                minRows={5}
              /> :
            null
          }
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
          <MuiThemeProvider theme={greenTheme}>
            <Button onClick={submitData} color="primary" variant="raised">
              Publish
            </Button>
          </MuiThemeProvider>
          </DialogActions>
        </DialogContent>
		<DialogContent><div style={{font: '10px', color: 'green'}}>*Only sections without error(s) will be published to 9255*</div></DialogContent>
      </Dialog>

	  <Dialog maxWidth='xl' open={openConfirm} onClose={handleCloseConfirm} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title-2">Confirmation</DialogTitle>
        <DialogContent>
          {
            load ?
              <ReactTable
                data={dataTableConfirm}
                columns={columnsConfirm}
                showPagination={false}
                minRows={3}
              /> :
            null
		  }
		  
		<p></p>
		<p></p>
          <DialogActions style={{ justifyContent: 'center' }}>
		  {confirmError ?
				
			<MuiThemeProvider theme={greenTheme}>
				<Button onClick={handleCloseConfirm}>
				Okay
				</Button>
				<Button onClick={handleContact} color="primary" variant="raised">
				Contact
				</Button>
			</MuiThemeProvider>
			: 
			
			<MuiThemeProvider theme={greenTheme}>
				<Button onClick={handleCloseConfirm} color="primary" variant="raised">
				Okay
				</Button>
			</MuiThemeProvider> }
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default FormDialog;
