import { Button, TextField, Card, CardContent, Typography,Collapse,Snackbar, CircularProgress, Grid,IconButton, CardActions } from "@material-ui/core";
import {LocationOn, ExpandMore} from '@material-ui/icons';
import clsx from 'clsx';
import "./App.css";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { red } from "@material-ui/core/colors";
const useStyles = makeStyles((theme) => ({
  weather: {
    width: '48%',
    minWidth: 340,
    minHeight: 275,
    display: 'inline-block',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
  },
  snackRoot:{
    background: '#d32f2f'
  },
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: "10px",
        borderColor: "grey",
        fontFamily: "metropolislight"
      },
      "&.Mui-focused fieldset": {
        /*  borderColor: "#92c3ff",
        borderWidth: "0.2px",
        boxShadow: `0 0 0 rgb(255, 255, 255);` */
      }
    }
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  typographyBody: {
    fontFamily:'metropolislight'
  },
  input: {
    fontFamily: "metropolislight !important",
    background: 'white'
  },
  currentTemp: {
    marginTop: 23,
    fontFamily: "metropolislight"
  },
   btn: {
    backgroundColor: "#007ab8",
    color: "#fff",
    marginTop: 10,
    fontSize: "14px",
    textTransform: "uppercase",
    borderRadius: "3px",
    lineHeight: 1.8,
    padding: "6px 23px",
    borderColor: "white",
    "&:disabled": {
      color: "#c1c1c1",
      background: "grey"
    },
    "&:hover": {
      backgroundColor: "#fff",
      color: "#007ab8",
      borderStyle: "solid",
      borderColor: "#007ab8",
      borderRadius: "3px",
      borderWidth: "1px",
      outline: "1px"
    }
  },
  cardaction: {
    height:20
  }
}));

export default function App() {
  const classes = useStyles(); 
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;
  const [settings, setSettings] = useState({sunRise: '', sunSet: '',location: 'New York',  expanded: false, timeStamp: undefined, weatherUpdate: {}});
  const [unit, setUnit]= useState('imperial');
  const [error,setError] = useState(undefined);
  console.log('settngs is',settings);
   const handleExpandClick = () => {
     setSettings({...settings, expanded:!settings.expanded});
   };
   const handleClick = (newState,message)  => {
     console.log('I\'m clicked');
    setState({ open: true, ...newState });
    setError(message)
  };

  const handleClose = () => {
    console.log('I\'m closed');
    setState({ ...state, open: false });
  };

  let fetchUrl='http://api.openweathermap.org/data/2.5/weather?units='+unit+'&q='+settings.location+'&APPID=10d305791efc4e7255cf5e9c810180a4';
  
  const handleWeatherUpdate=(result)=> {
    if(result && result.message){

      handleClick({
        vertical: 'bottom',
        horizontal: 'center',
      }, result.message);
    } else{
      const currentDate=new Date();
    const currentTime= (currentDate.getHours()>12 ? currentDate.getHours()-12 +':'+currentDate.getMinutes()+' PM' : currentDate.getHours() +':'+currentDate.getMinutes()+' AM')
    const currentDateTime=currentTime +', ' +currentDate.toDateString();
    const sunriseDetails=result && result.sys ? new Date((result.sys.sunrise+result.timezone)*1000).toUTCString().split(' ')[4].split(':'): '';
    const sunsetDetails=result && result.sys ? new Date((result.sys.sunset+result.timezone)*1000).toUTCString().split(' ')[4].split(':'): '';
    let sunRiseTime, sunSetTime='';
    if(parseInt(sunriseDetails[0])>12){
      sunRiseTime=(12- parseInt(sunriseDetails[0]))+':'+sunriseDetails[1]+' PM';
    } else{
      sunRiseTime=sunriseDetails[0]+':'+sunriseDetails[1]+' AM';
    }
    if(parseInt(sunsetDetails[0])>12){
      sunSetTime=(parseInt(sunsetDetails[0])-12)+':'+sunsetDetails[1]+' PM';
    } else{
      sunSetTime=sunsetDetails[0]+':'+sunsetDetails[1]+' AM';
    }
    setSettings({...settings, weatherUpdate:result,timeStamp:currentDateTime, sunRise: sunRiseTime, sunSet: sunSetTime});
    }
  }

  const generateFetchUrl =(param)=>{
    return 'http://api.openweathermap.org/data/2.5/weather?units='+param+'&q='+settings.location+'&APPID=10d305791efc4e7255cf5e9c810180a4';
  }

  const checkWeatherHandler = (e,param) => {
    setSettings({...settings, weatherUpdate:{}});
    setError(undefined);
    checkWeather(param);
  }
 
  const checkWeather = (param) => {
    fetch(
      param? generateFetchUrl(param):fetchUrl      
    ).then((response) => response.json())
      .then(
        (result) => {
        
         setTimeout(()=>handleWeatherUpdate(result),1000);
        
        },
        (error) => {
         console.log('error is', error);
        }
      )
  };

  const toggleUnit =(e, param) =>{
    console.log('param',param);
    setUnit(param);
    checkWeatherHandler(null,param);
  };

  const changeLocation = (e) => {
    setSettings({...settings,location:e.target.value});
  };

  useEffect(() => {
    checkWeather();
  },[]);
/* 
  useEffect(()=>{
    fetchWeatherIcon(weatherIcon);
  },[weatherIcon]) */

  return (
    <div className="App">
    <div>
      <TextField
        required
        value={settings.location}
        onChange={changeLocation}
        className={classes.root}
        id="outlined-secondary"
        label="Location "
        variant="outlined"
        color="primary"
        InputProps={{
          className: classes.input
        }}
      />&nbsp;&nbsp;
      <Button className={classes.btn} disabled={!settings.location} onClick={(e)=>checkWeatherHandler(null,unit)}>
        Check Weather
      </Button>
    </div>
    {console.log('weatherUpdate', settings.weatherUpdate, 'unit',unit)}
     <div className="weatherDetails">
     <Snackbar
  anchorOrigin={{ vertical, horizontal }}
  open={open}
  ContentProps={{
    classes: {
      root: classes.snackRoot
    }
  }}
  autoHideDuration={3000}
  onClose={handleClose}
  message={error}
  key={vertical + horizontal}
/>
       <Card className={classes.weather}>
            
       {error && 
            <CardContent style={{width:'100%', height:'100%',     marginTop: 88}}> 
            No results found</CardContent>
            }
          
            {(!error && (!settings.weatherUpdate || (settings.weatherUpdate && Object.keys(settings.weatherUpdate).length<1))) && 
            <CardContent style={{width:'100%', height:'100%',     marginTop: 88}}> 
            <CircularProgress /> <br/> Loading latest weather updates</CardContent>
            }
           {  settings.weatherUpdate && Object.keys(settings.weatherUpdate).length>0 && 
            <><CardContent className="weatherContent"><Typography classes={{root:"timeStamp", body1: classes.typographyBody}} variant="body1" component="h2">
              {settings.timeStamp}
            </Typography>
            <div className="temperatureWindow">
              <img src={`http://openweathermap.org/img/wn/`+settings.weatherUpdate.weather[0].icon+`@2x.png`}/>
              <Typography className={classes.currentTemp} variant="h3" component="h3">
              {Math.round(settings.weatherUpdate.main.temp * 10) / 10}
            </Typography>
            {unit==='imperial' && <Typography  className={classes.currentTemp} variant="h4" component="h4">
            °F
            </Typography>}
            {unit==='metric' && <Typography  className={classes.currentTemp} variant="h4" component="h4">
            °C
            </Typography>}
            <Typography className={classes.currentTemp} variant="h6" component="h6">
            |
            </Typography>
            {unit==='metric' && <Typography onClick={(e)=>toggleUnit(e,'imperial')} className={classes.currentTemp} variant="h6" component="h6">
            °F
            </Typography>} {unit==='imperial' && <Typography onClick={(e)=>toggleUnit(e,'metric')} className={classes.currentTemp} variant="h6" component="h6">
            °C
            </Typography>}
         </div>
            
            
            <Typography classes={{h5: classes.typographyBody}} variant="h5" component="h2">
              {settings.weatherUpdate.weather[0].main}
            </Typography>
            <Typography style={{color: 'lightslategray'}} variant="body2" component="p">
              {settings.weatherUpdate.name}       
            </Typography>
            <div>{Math.round(settings.weatherUpdate.main.temp_max * 10) / 10}°-{Math.round(settings.weatherUpdate.main.temp_min * 10) / 10}°</div>
        
          </CardContent>
          <CardActions className={classes.cardaction}>
            <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: settings.expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={settings.expanded}
            aria-label="show more"
          >
            <ExpandMore /> 
          </IconButton><span className="more"> More</span>
          </CardActions>
          <Collapse in={settings.expanded} timeout="auto" unmountOnExit>
              <div className="gridContainer">
                <Grid container rowspacing={1} columnspacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid  className="grid" >
                  <span>Humidity: <strong>{settings.weatherUpdate.main.humidity}%</strong></span>
                </Grid>
                <Grid  className="grid">
                  <span>Pressure: <strong>{settings.weatherUpdate.main.pressure} hPa</strong></span>
                </Grid>
                <Grid  className="grid">
                  <span>Wind Speed: <strong>{unit ==='metric' ? settings.weatherUpdate.wind.speed+' m/s': settings.weatherUpdate.wind.speed+' mph' }</strong></span>
                </Grid>
                <Grid  className="grid">
                  <span>Sunrise/Sunset: <strong>{settings.sunRise}/{settings.sunSet}</strong></span>
                </Grid>
              </Grid>
              </div>
            
            </Collapse>
            </>
            }
      </Card>

    </div>
   
    </div>
  );
}
