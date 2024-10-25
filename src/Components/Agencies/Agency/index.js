import { Box, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { ArrowDownward, ArrowUpward, Check, Delete, Lock } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
}

export default function Agency(props) {
    const [openEmail, setOpenEmail] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)
    const [openEmailAlert, setOpenEmailAlert] = React.useState(false)
    const [openAgencyAlert, setOpenAgencyAlert] = React.useState(false)
    const handleOpenModal = () => setOpenModal(true)

    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)

    const [isEmailDeleting, setIsEmailDeleting] = useState(false)
    const [isAgencyDeleting, setIsAgencyDeleting] = useState(false)

    const [currentEmailId, setCurrentEmailId] = React.useState(0)
    const [currentEmail, setCurrentEmail] = React.useState('')

    const [currentAgencyId, setCurrentAgencyId] = React.useState(0)
    const [currentAgencyName, setCurrentAgencyName] = React.useState('')

    const [additionnalEmail, setAdditionnalEmail] = React.useState('')

    const [agencies, setAgencies] = useState([])
    const [additionnalEmails, setAdditionnalEmails] = useState([])
    const [payments, setPayments] = React.useState([])

    const [amount, setAmount] = useState(0)
    const [wording, setWording] = useState('')

    const [password, setPassword] = useState('')
    const [updatePassword, setUpdatePassword] = useState(false)

    const [openSuccess, setOpenSuccess] = useState(false)


    const navigate = useNavigate()

    async function fetchData() {

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
                        setAgencies(response.data.data)
                        setAdditionnalEmails(response.data.data[0].additionalEmails)
                        setIsFetched(true)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    useEffect(() => {

        fetchData()

    }, [])

    const handleRemoveAgency = async (agencyId) => {
        setIsAgencyDeleting(true)
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/agencies/${agencyId}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            navigate(-1)
                            setIsAgencyDeleting(false)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
    }

    const handleClose = () => {
        setOpenModal(false)
    }

    useEffect(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const passwordLength = 8;

        let newPassword = ''
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            newPassword += characters.charAt(randomIndex);
        }

        setPassword(newPassword)
    }, [])

    return (

        <Fragment>

<Fragment>
                        {
                            !isFetched ?
                                <div style={{ textAlign: 'center', height: '80vh', lineHeight: '80vh' }}>
                                    <CircularProgress />
                                </div> :
                                <Fragment>
                                    <br /><br /><br />
                                    {
                                        agencies.map((data, key) => {
                                            return (
                                                <Grid container spacing={2} key={key}>
                                                    <Grid xs={4} item>

                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 5, mb: 2 }}>
                                                            <Typography typography='h4' mb={2}>
                                                                <strong>{data.accountType === 'personnal' ? data.fullName : data.socialReason}</strong>
                                                            </Typography>

                                                            <Typography mt={2} mb={2} lineHeight={2} component={'div'}>
                                                                <div><strong>Nom Agence :</strong> {data.name}</div>
                                                                <div><strong>Nom responsable :</strong> {data.responsibleFullName}</div>
                                                                <div><strong>Email :</strong> {data.email}</div>
                                                                <div><strong>Téléphone 1 :</strong> {data.phoneNumber}</div>
                                                                <div><strong>Téléphone 2 :</strong> {(!data.phoneNumberBis || data.phoneNumberBis === '228') ? <i>Non renseigné !</i> : data.phoneNumberBis}</div>
                                                            </Typography>

                                                            <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth>

                                                                <Button onClick={() => {
                                                                    navigate('/admins/edit-agency-' + data.id)
                                                                }}><strong>Modifier</strong></Button>
                                                                <Button color='error' sx={{ borderRadius: 5 }} onClick={() => {
                                                                    setOpenAgencyAlert(true)
                                                                    setCurrentAgencyId(data.id)
                                                                    setCurrentAgencyName(data.name)
                                                                }}><Delete /></Button>
                                                            </ButtonGroup><br /><br />

                                                            <Dialog
                                                                open={openAgencyAlert}
                                                                onClose={() => {
                                                                    setOpenAgencyAlert(false)
                                                                    setCurrentAgencyId(0)
                                                                    setCurrentAgencyName('')
                                                                }}
                                                                aria-labelledby="alert-dialog-title"
                                                                aria-describedby="alert-dialog-description"
                                                            >
                                                                <DialogTitle id="alert-dialog-title">
                                                                    {"Supprimer cette agence de la liste ?"}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText id="alert-dialog-description">
                                                                        Êtes-vous sûr(e) de vouloir supprimer cette agence "<strong>{currentAgencyName}</strong>" et toutes ses instances ? Cette action sera défintive et irréversible !
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={() => {
                                                                        setOpenAgencyAlert(false)
                                                                        setCurrentAgencyId(0)
                                                                        setCurrentAgencyName('')
                                                                    }}>Fermer</Button>
                                                                    <Button color='error' onClick={() => {
                                                                        handleRemoveAgency(currentAgencyId)
                                                                    }} autoFocus>
                                                                        {isAgencyDeleting ? "Patientez ..." : "Supprimer"}
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>

                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Fragment>
                        }
                    </Fragment>

        </Fragment>
    )
}
