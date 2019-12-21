import React, {useCallback, useState, useEffect} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import {useDropzone} from 'react-dropzone';

interface Props {
    handleDrop: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        textAlign: "center",
    },
    button: {
        marginRight: theme.spacing(1),
    },
  }),
);

const Upload:React.FC<Props> = (props) => {

    const onDrop = useCallback(props.handleDrop, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
    const classes = useStyles()

    return (
        <div>
            <div className={classes.root} {...getRootProps()}>
            <input {...getInputProps()}/>
            <img src={require("../assets/ducky.jpg")} className={"main"} alt="graphic"></img>
            <p>drag and drop or click "browse" select a file to upload</p>
            <b>
                <p>
                {
                    isDragActive ? <>drop your file here</> : <>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                        >
                            browse
                        </Button>
                    </>
                }
                </p>
            </b>
        </div>
    </div>
    )
}
export default Upload;