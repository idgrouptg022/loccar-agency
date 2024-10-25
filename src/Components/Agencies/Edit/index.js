import React, { Fragment } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Autocomplete, CircularProgress, FormControlLabel, Grid, IconButton, Snackbar, Switch, TextField } from '@mui/material'
import axios from 'axios'
import { Close } from '@mui/icons-material'

const steps = [
    {
        label: 'Documents d\'identité',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'Informations pripriétaire',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'Paramètres de connexion',
        description: <React.Fragment></React.Fragment>,
    }
]

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

function isNumeric(value) {
    return /^\d+$/.test(value)
}

let bodyFormData = null

export default function EditAgency(props) {

    const [countries, setCountries] = React.useState([])
    const [cities, setCities] = React.useState([])

    const [isLoading, setIsLoading] = React.useState(false)
    const [isSuccessed, setIsSuccessed] = React.useState(false)
    const [isSuccessedMessage, setIsSuccessedMessage] = React.useState('')

    const [oldCountry, setOldCountry] = React.useState({})
    const [oldCity, setOldCity] = React.useState({})

    const [country, setCountry] = React.useState(0)
    const [city, setCity] = React.useState(0)
    const [responsibleFullName, setResponsibleFullName] = React.useState("")

    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)
    const [emailErrorText, setEmailErrorText] = React.useState('')

    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [phoneNumberError, setPhoneNumberError] = React.useState(false)
    const [phoneNumberErrorText, setPhoneNumberErrorText] = React.useState('')

    const [phoneNumberBis, setPhoneNumberBis] = React.useState('228')

    async function fetchAgency() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/agencies/${props.agency}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    
                    if (response.data?.responseCode === '0') {
                        console.log(response.data.data[0])
                        setOldCountry(response.data.data[0].country)
                        setOldCity(response.data.data[0].city)
                        setCountry(response.data.data[0].country.id)
                        setCity(response.data.data[0].city.id)

                        setResponsibleFullName(response.data.data[0].responsibleFullName)
                        setName(response.data.data[0].name)

                        setEmail(response.data.data[0].email)
                        setPhoneNumber(response.data.data[0].phoneNumber)
                        // setPhoneNumberBis(response.data.data[0].phoneNumberBis)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    React.useEffect(() => {

        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/countries`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setCountries(response.data.data)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }

        fetchAgency()
        fetchData()
        
    }, [])

    const fetchCities = async (countryId) => {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/countries/${countryId}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setCities(response.data.data[0].cities)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleUpdateAgency = async () => {
        setIsLoading(true)

        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }

        bodyFormData.set('countryId', country)
        bodyFormData.set('cityId', city)
        bodyFormData.set('email', email)
        bodyFormData.set('phoneNumber', phoneNumber)
        // bodyFormData.set('phoneNumberBis', phoneNumberBis)
        bodyFormData.set('name', name)
        bodyFormData.set('responsibleFullName', responsibleFullName)

        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/agencies/${props.agency}`,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setIsLoading(false)
                        setIsSuccessed(true)
                        setIsSuccessedMessage('Agence mise à jour avec succèse !')

                        fetchAgency()
                    }
                } catch {
                    setIsLoading(false)
                    setIsSuccessed(true)
                    setIsSuccessedMessage('Un problème de source inconnue est survenur. Réessayez !')
                }
            })
            .catch(function (error) {
                console.log(error.response.data);
                if (error.response.data?.responseCode === 'E-R-00002-23') {
                    setEmailError(true)
                    setEmailErrorText('Email invalide.')
                } else if (error.response.data?.responseCode === 'E-R-00020-23') {
                    setEmailError(true)
                    setEmailErrorText('Email ou téléphone invalide ou déjà utilisés.')
                    setPhoneNumberError(true)
                    setPhoneNumberErrorText('Email ou téléphone invalide ou déjà utilisés.')
                }
                setIsLoading(false)
            })
    }

    return (
        <Grid container>
            <Grid xs={2} item>

            </Grid>
            <Grid xs={6} item>
                <form>
                    <Box mt={5} maxWidth={400}>
                        <Typography typography={'h5'}>
                            <strong>Modifier une agence</strong>
                        </Typography><br /><br />
                        <Autocomplete
                            onChange={(event, newValue) => {
                                const newCountryId = newValue ? newValue.id : 0

                                setCountry(newCountryId)
                                setOldCountry(newValue)
                                // setIsDocumentsProvided(newCountryId !== 0 && cardNumber.length !== 0)
                                fetchCities(newCountryId)
                            }}
                            value={oldCountry}
                            disablePortal
                            id="combo-box-demo"
                            options={countries}
                            getOptionLabel={(option) => option.name || ''}
                            sx={{ mb: 2 }}
                            renderInput={(params) => <TextField {...params} label="Pays" />}
                        />
                        <Autocomplete
                            onChange={(event, newValue) => {
                                const newCityId = newValue ? newValue.id : 0

                                setCity(newCityId)
                                setOldCity(newValue)
                                // setIsDocumentsProvided(newCountryId !== 0 && cardNumber.length !== 0)
                            }}
                            value={oldCity}
                            disablePortal
                            id="combo-box-demo"
                            options={cities}
                            getOptionLabel={(option) => option.name || ''}
                            sx={{ mb: 2 }}
                            renderInput={(params) => <TextField {...params} label="Villes" />}
                        />
                        <TextField label="Nom de l'agence" variant="outlined" sx={{ mb: 2 }} fullWidth value={name} onChange={(e) => {
                            setName(e.target.value)
                        }} />
                        <TextField label="Nom du responsable" variant="outlined" sx={{ mb: 2 }} fullWidth value={responsibleFullName} onChange={(e) => {
                            setResponsibleFullName(e.target.value)
                        }} />
                        <TextField label="Email" variant="outlined" sx={{ mb: 2 }} fullWidth value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }} />
                        <TextField label="N° de téléphone" variant="outlined" sx={{ mb: 2 }} fullWidth value={phoneNumber} onChange={(e) => {
                            setPhoneNumber(e.target.value)
                        }} />
                        
                        <Button sx={{ mt: 1, mr: 1 }} size='large' disabled={isLoading} variant='contained' disableElevation onClick={() => {
                            handleUpdateAgency()
                        }}>
                            {
                                isLoading ? <CircularProgress size={26} /> :
                                    <strong>Terminer</strong>
                            }
                        </Button>
                    </Box>
                </form>
            </Grid>

            <Snackbar
                open={isSuccessed}
                autoHideDuration={6000}
                onClose={() => {
                    setIsSuccessed(false)
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message={isSuccessedMessage}
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => {
                        setIsSuccessed(false)
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>}
            />
        </Grid>

    )
}