import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

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

interface Props {
  events: Event[];
  handleNext: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      overflowX: "scroll",
      float: "left",
      width: "100vw",
      height: "80vh"
    },
    button: {
        marginRight: theme.spacing(1),
    },
    prompt: {
        display: "inline-block",
        marginLeft: "10px",
    },
    action: {
        marginLeft: "auto",
    },
    grid: {
      width: 1475
    },
    header: {
      textAlign: "center"
    },
    col: {
      width: 275,
      float: "left",
      marginRight: "10px",
      marginLeft: "10px"
    },
    card: {
      minWidth: 275,
      marginBottom: "10px"
    },
    title: {
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    }
  })
);
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const Schedule: React.FC<Props> = props => {
  const classes = useStyles();

  const renderEvents = (day: String) => {
    console.log("render events for", day);
    return props.events
      .filter(event => (event.day == day ? 1 : 0))
      .map(event => {
        return (
          <div>
            <Card className={classes.card}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {event.start + " - " + event.end}
                </Typography>
                <Typography variant="h5" component="h2">
                  {event.class + " " + event.code}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  {event.section + " | " + event.type}
                </Typography>
                <Typography variant="body2" component="p">
                  {event.location}
                </Typography>
              </CardContent>
            </Card>
          </div>
        );
      });
  };

  const renderColumns = () => {
    console.log("rendering col");
    return days.map(day => {
      return (
        <div className={classes.col}>
          <div>
            <Typography className={classes.header}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Typography>
            {renderEvents(day)}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.grid}>{renderColumns()}</div>
      </div>
      <div className={classes.action}>
        <Typography className={classes.prompt}>Do these look correct?</Typography>
        <Button className={classes.button} variant="contained" color="primary" onClick={props.handleNext}>
          Yes
        </Button>
        <Button className={classes.button} variant="contained" color="secondary">
          No
        </Button>
      </div>
    </div>
  );
};

export default Schedule;
