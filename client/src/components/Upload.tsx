import React, { useCallback, useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useDropzone } from "react-dropzone";

interface Props {
  handleDrop: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      otline: "0 none",
      "&:focus": {
        outline: "0 none !important"
      }
    },
    button: {
      marginRight: theme.spacing(1)
    },
    img: {
      height: "50vh",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "10vh",
      "&:hover": {
        cursor: "pointer"
      }
    }
  })
);

const Upload: React.FC<Props> = props => {
  const onDrop = useCallback(props.handleDrop, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root} {...getRootProps()}>
        <input {...getInputProps()} />
        <img
          src={require("../assets/file-drop.svg")}
          className={classes.img}
          alt="graphic"
        ></img>
        <div>
          {isDragActive ? (
            <p>Drop your file here</p>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Browse
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Upload;
