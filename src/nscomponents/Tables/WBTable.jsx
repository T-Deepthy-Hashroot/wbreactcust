import React from "react";
import ReactTable from "react-table";
import loadingImage from "nsassets/img/Workbench-Loading-Screen-Animation.gif";
import classnames from 'classnames';


class WBTable extends React.Component
{
    render()
    {
        return (
            <ReactTable
                {...this.props}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                // add custom loading component
                LoadingComponent={(className, ...rest) => (
                    <div
                        className={classnames('-loading', {'-active': this.props.loading}, className)}
                        style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '3px'}}
                        {...rest}
                    >
                        <div className="-loading-inner">
                            <img style={{width: '300px', marginTop: '-50px'}} src={loadingImage} alt="Loading..."/>
                        </div>
                    </div>
                )}
            />)
    }
}

export default WBTable;