import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "30px"
    },
    form: {
      "& > *": {
        margin: theme.spacing(1),
        width: 200
      }
    },
    buttons: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  })
);

const Options: React.FC<{
  saveConfig: Function;
  handleNext: Function;
}> = props => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2020-01-01T21:11:54")
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date("2020-04-26T21:11:54")
  );
  const [calendarId, setCalendarId] = useState<String>("");
  const [timeZone, setTimeZone] = useState<String>("");
  const inputLabel = React.useRef<HTMLLabelElement>(null);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeZone(event.target.value as string);
  };
  const saveConfig = () => {
    let config = {
      startDate: startDate,
      endDate: endDate,
      calendarId: calendarId,
      timeZone: timeZone
    };
    props.saveConfig(config);
    props.handleNext();
  };

  return (
    <div className={classes.root}>
      <form>
        <TextField
          id="calendar-id"
          label="Calendar ID"
          name="calendarId"
          onChange={e => setCalendarId(e.target.value)}
        />
      </form>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Time Zone</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={timeZone}
          onChange={handleChange}
        >
          <MenuItem value={"Canada/Eastern"}>Canada/Eastern</MenuItem>
          <MenuItem value={"Canada/Mountain"}>Canada/Mountain</MenuItem>
          <MenuItem value={"Canada/Pacific"}>Canada/Pacific</MenuItem>
        </Select>
      </FormControl>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Start Date"
          value={startDate}
          onChange={(date: Date | null) => {
            setStartDate(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="End Date"
          value={endDate}
          onChange={(date: Date | null) => {
            setEndDate(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
      <div className={classes.buttons}>
        <Button color="primary" variant="contained" onClick={saveConfig}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Options;
