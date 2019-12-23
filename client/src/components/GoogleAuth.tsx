import React, {useState} from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Event {
    class: String;
    code: String;
    section: String;
    type: String;
    day: String;
    start: String;
    end: String;
    location: String;
  }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center"
    },
    button: {
      marginTop: "10px"
    },
    img: {
      width: "auto",
      height: "60vh",
      marginLeft: "auto",
      marginRight: "auto",
      display: "block"
    },
  })
);

const GoogleAuth: React.FC<{
    options: {
        startDate: String,
        endDate: String,
        calendarId: String
    },
    events: Event[],
    handleNext: Function
}> = (props) => {
  const classes = useStyles();
  const [authed, setAuthed] = useState(false);

  const startAuth = () => {
    axios
      .get("/login", {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then((res) => {
        setAuthed(true)
        window.open(res.data, "_blank")
      })
      .catch(err => {
        console.log(err);
      });
  };

  const createEvents = () => {
      const data = new FormData();
      data.append('options', JSON.stringify(props.options))
      data.append('events', JSON.stringify(props.events))
      axios.post('/api/v1/create-events', data).then(res => {
          console.log(res)
          props.handleNext();
      }).catch(err => {
          console.log(err)
      })
  }

  return (
    <div className={classes.root}>
            <img className={classes.img} src={require("../assets/secure.svg")} />

      Almost there! We'll need your permission to add events to your Google Calendar.
      <div>

      <Button className={classes.button} variant="contained" color="primary" onClick={startAuth}>
        Grant Permission
      </Button>

      </div>
      <div>
      <Button className={classes.button} variant="contained" color="primary" onClick={createEvents} disabled={!authed}>
        Create Events
      </Button>
      </div>

    </div>
  );
};

export default GoogleAuth;
