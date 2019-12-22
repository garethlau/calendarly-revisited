import React from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
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

const GoogleAuth: React.FC<{
    options: {
        startDate: String,
        endDate: String,
        calendarId: String
    },
    events: Event[]
}> = (props) => {

  const startAuth = () => {
    axios
      .get("/login", {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then((res) => {
        console.log("done login??", res);
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
      }).catch(err => {
          console.log(err)
      })
  }

  return (
    <div>
      Google Auth Page
      <Button variant="contained" color="primary" onClick={startAuth}>
        Login to Google
      </Button>


      <Button variant="contained" color="primary" onClick={createEvents}>
        Create Events
      </Button>
    </div>
  );
};

export default GoogleAuth;
