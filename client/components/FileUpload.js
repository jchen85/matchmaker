import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {reduxForm} from 'redux-form';
import * as ProfilePictureActions from '../actions/pictureActions';

import Dropzone from 'react-dropzone';

export const fields = ['files'];

class FileUpload extends Component {

  render() {

    const formStyle = {
      clear: 'all'
    };


    const preview = {
      height: 200,
      width: 'auto',
      float: 'left'
    };

    const dropzoneStyle = {
      height: 200,
      width: 200,
      float: 'left'
    };

    const dropzoneInfoStyle = {
      textAlign: 'center',
      marginTop: 75
    }

    const buttonStyle = {
      display: 'block',
      clear: 'both',
      margin: '0px 100px 10px 225px'
    }

    const {
      fields: {files},
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <div style={dropzoneStyle}>
            <Dropzone { ...files } onDrop={ ( filesToUpload, e ) => {
              document.querySelector("#preview").src=filesToUpload[0].preview;
              files.onChange(filesToUpload);
            }}><div style={dropzoneInfoStyle}>Drop an image file here to upload</div></Dropzone>
          </div>
          <div>
            <img style={preview} id="preview" src='http://allthetickets.net/images/no-preview.png'/>
          </div>
        </div>

        <div>
          <button style={buttonStyle} type="submit" disabled={submitting} >
            {submitting ? <i/> : <i/>} Use as Profile Picture
          </button>
        </div>
      </form>
    );
  }
}

FileUpload.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'profile',
  fields
},
state => ({ // mapStateToProps
  initialValues: state.user.userInfo, // will pull state into form's initialValues
}),
{}      // mapDispatchToProps (will bind action creator to dispatch)
)(FileUpload);