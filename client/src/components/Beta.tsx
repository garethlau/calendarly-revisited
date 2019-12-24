import React, {useState} from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cornerRibbon: {
      top: "12.5px",
      left: "-25px",
      right: "auto",
      transform: "rotate(-45deg)",
      "-webkit-transform": "rotate(-45deg)",
      background: "#e43",
      width: "100px",
      position: "absolute",
      "text-align": "center",
      "line-height": "25px",
      "letter-spacing": "1px",
      color: "#f0f0f0",
      opcacity: "0.5",
      "&:hover": {
        cursor: "pointer"
      }
    },
    email: {
        textDecoration: "none"
    }
  })
);
const Beta: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <>
      <div className={classes.cornerRibbon} onClick={handleClickOpen}>
        Issue?
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Report an issue
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This project is still being actively worked on. If you encounter any issues
            (parsing, creating events, authentation), please email me at
            glau29@uwo.ca. <br></br> Thanks :)<br></br>- Gareth
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <a className={classes.email} href="mailto:glau29@uwo.ca">
            <Button onClick={handleClose} color="primary">
              Email
            </Button>
          </a>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Beta;
