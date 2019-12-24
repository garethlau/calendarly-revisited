import React from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center"
    },
    img: {
        height: "50vh",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "15vh"
    },
    textContainer: {
        width: "80vw",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "20px"
    },
  })
);

const Feedback:React.FC<{
    message: String,
    img: String
}> = (props) => {
    const classes = useStyles();
    console.log("props in feedback", props)
    return (
        <div className={classes.root}>
            <div>
                <img className={classes.img} src={require(`../assets/${props.img}`)} />
            </div>
            <div>
                <div className={classes.textContainer}>
                    {props.message}
                </div>
            </div>

        </div>
    )
}
export default Feedback;