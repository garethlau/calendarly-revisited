import React, {useState} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Stepper, Step, StepLabel, Button, CircularProgress} from '@material-ui/core';
import { Typography } from '@material-ui/core';

import axios from 'axios';

import Upload from './Upload';
import Schedule from './Schedule';
import GoogleAuth from './GoogleAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    loaderContainer: {
        width: "100vw",
        height: "80vh",
    },
    loader: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(50%, 50%)"
    }
  }),
);

function getSteps() {
    return ['Upload a PDF', 'Confirm Classes', 'Sign in to Google'];
}

const MainForm: React.FC = () => {
    const [file, setFile] = useState({});
    const [verified, setVerified] = useState(false);
    const [events, setEvents] = useState([])

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const [extracting, setExtracting] = useState(false);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleDrop = (droppedFiles: FileList) => {
        if (droppedFiles.length == 1) {
            // show load banner
            setExtracting(true);
            const data = new FormData();
            data.append('file', droppedFiles[0]);

            // make api call to extract class inforamtion
            axios.post("/api/v1/extract", data).then((res) => {
                console.log(res.data);
                setEvents(res.data);
                setExtracting(false);
                handleNext();

            }).catch(err => {
                console.log(err);
            });
        }
    }

    const getStepContent = (step: number) => {
        switch (step) {
          case 0:
            return <Upload handleDrop={handleDrop}/>;
          case 1:
            return <Schedule events={events} handleNext={handleNext}/>;
          case 2:
            return <GoogleAuth/>;
          default:
            return 'Unknown step';
        }
      }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: {completed?: boolean} = {}
                    const labelProps: {optiona?: React.ReactNode} = {}
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>
                           All steps completed - you&apos;re finished
                        </Typography>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>
                            {extracting ? (
                                <div className={classes.loaderContainer}>
                                    <div className={classes.loader}>
                                        <CircularProgress/>
                                    </div>
                                </div>
                            ) : (
                                getStepContent(activeStep)
                            )}
                        </Typography>
                    </div>
                )
                }
            </div>
        </div>
    )
}
export default MainForm;