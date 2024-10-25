import * as React from 'react'
import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Autocomplete, CircularProgress, Grid, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material'
import axios from 'axios'
import {Close, Visibility, VisibilityOff } from '@mui/icons-material'



const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

function isNumeric(value) {
    return /^\d+$/.test(value)
}

let bodyFormData = null

export default function CreateAgency(props) {

    const [countries, setCountries] = React.useState([])
    const [cities, setCities] = React.useState([])

    const [oldCountry, setOldCountry] = React.useState({})
    const [oldCity, setOldCity] = React.useState({})

    const [country, setCountry] = React.useState(0)
    const [city, setCity] = React.useState(0)

    const [isLoading, setIsLoading] = React.useState(false)
    const [isSuccessed, setIsSuccessed] = React.useState(false)
    const [isSuccessedMessage, setIsSuccessedMessage] = React.useState('')

    const [responsibleFullName, setResponsibleFullName] = React.useState("")

    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState("")
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorText, setPasswordErrorText] = React.useState('')
    
    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const [phoneNumber, setPhoneNumber] = React.useState('+228')
    const [phoneNumberError, setPhoneNumberError] = React.useState(false)
    const [phoneNumberErrorText, setPhoneNumberErrorText] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)
    const [emailErrorText, setEmailErrorText] = React.useState('')

    const [phoneNumberBis, setPhoneNumberBis] = React.useState('+228')

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

    const handleCreateAgency = async () => {
        setIsLoading(true)

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            setPasswordError(false)
            setPasswordErrorText("")

            bodyFormData.set('countryId', country)
            bodyFormData.set('cityId', city)
            bodyFormData.set('email', email)
            bodyFormData.set('phoneNumber', phoneNumber)
            // bodyFormData.set('phoneNumberBis', phoneNumberBis)
            bodyFormData.set('name', name)
            bodyFormData.set('responsibleFullName', responsibleFullName)
            bodyFormData.set('password', password)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/agencies`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setCountry(0)
                            setCity(0)
                            setName("")
                            setResponsibleFullName("")
                            setEmail("")
                            setPhoneNumber("")
                            setIsLoading(false)
                            setIsSuccessed(true)
                            setIsSuccessedMessage('Agence ajoutée avec succès !')
                        }
                    } catch {
                        setIsLoading(false)
                        setIsSuccessed(true)
                        setIsSuccessedMessage('Un problème de source inconnue est survenur. Réessayez !')
                    }
                })
                .catch(function (error) {
                    if (error.response.data?.responseCode === 'E-R-00002-23') {
                        setEmailError(true)
                        setEmailErrorText('Email invalide.')
                    } else if (error.response.data?.responseCode === 'E-R-00020-23') {
                        setEmailError(true)
                        setEmailErrorText('Email ou télé phone invalide ou déjà utilisés.')
                        setPhoneNumberError(true)
                        setPhoneNumberErrorText('Email ou télé phone invalide ou déjà utilisés.')
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
                            <strong>Créer une agence</strong>
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
                        <TextField
                            disabled={isLoading}
                            fullWidth
                            error={passwordError}
                            value={password}
                            onChange={(e) => {
                                if (e.target.value.length <= 32) {
                                    setPassword(e.target.value)
                                }
                            }}
                            type={showPassword ? 'text' : 'password'}
                            label="Mot de passe"
                            placeholder='Saisir le mot de ...'
                            helperText={passwordErrorText}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        
                        <Button sx={{ mt: 1, mr: 1 }} size='large' disabled={isLoading} variant='contained' disableElevation onClick={() => {
                            handleCreateAgency()
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