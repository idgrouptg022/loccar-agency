import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'

export default function ClassifiedInvoice(props) {
    const [invoices, setInvoices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [currentInvoiceId, setCurrentInvoiceId] = useState(0)

    const [isFetched, setIsFetched] = useState(false)

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/list/classified`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setInvoices(response.data.data)
                        setIsFetched(true)
                        setOpenAlert(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                // console.log(error)
            })
    }

    const handleClassifyInvoice = async () => {
        if (props.userRights?.split(',').includes('23') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/invoices/${currentInvoiceId}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetchData()
                            setIsLoading(false)
                            setCurrentInvoiceId(0)
                            setOpenAlert(false)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {

                })
        }
    }

    useEffect(() => {

        fetchData()

    }, [])

    useEffect(() => {
        props.socket.on("handleAcceptInvoice", async (data) => {
            fetchData()
        })
    }, [props.socket])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des devis classés</h2>
                </Grid>
            </Grid><br />
            {
                !props.userRights?.split(',').includes('22') && JSON.parse(localStorage.getItem('data')).id != 1 ?
                    <Typography textAlign={`center`} typography={`h5`}>
                        <br /><br /><br />
                        Non autorisé !
                    </Typography> :
                    !isFetched ?
                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                            <CircularProgress />
                        </div> :
                        <Fragment>
                            {
                                invoices.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de devis classé</strong>.</Typography> :
                                    <Grid container spacing={3}>
                                        {
                                            invoices.map((data) => {
                                                return (
                                                    <Grid xl={3} lg={4} item key={data.id}>
                                                        <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                            <Typography typography={'h5'} mb={1}>
                                                                Devis #{data.ref}
                                                            </Typography>
                                                            <Typography fontSize={13}>
                                                                <strong>{data.car.brand} {data.car.model} {data.car.year} {data.car.carPlateNumber}</strong><br />
                                                                <b>{data.owner.ref}</b> {data.owner.accountType === 'enterprise' ? data.owner.socialReason : data.owner.fullName}<br />

                                                                Objet :&nbsp;
                                                                {
                                                                    data.source === 'accident' ?
                                                                        <b>Devis d'accident</b> :
                                                                        <Fragment>
                                                                            {
                                                                                data.source === 'breakdown' ?
                                                                                    <b>Devis panne</b> :
                                                                                    <b>Devis d'entretien</b>
                                                                            }
                                                                        </Fragment>
                                                                }<br />
                                                                <strong>Etat</strong> : {
                                                                    data.state === 1 ?
                                                                        "Acceptée" :
                                                                        <Fragment>
                                                                            {
                                                                                data.state === -1 ?
                                                                                    "Rejetée" :
                                                                                    <Fragment>
                                                                                        {
                                                                                            data.state === 2 ?
                                                                                                "Commenté" :
                                                                                                "Neutre"
                                                                                        }
                                                                                    </Fragment>
                                                                            }
                                                                        </Fragment>
                                                                }

                                                                <br /><br />

                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${data.file}`}><strong>Devis.PDF [Cliquez pour ouvrir]</strong></a><br /><br />

                                                                <Button disabled={!props.userRights?.split(',').includes('23') && JSON.parse(localStorage.getItem('data')).id != 1} variant='outlined' color='error' onClick={() => {
                                                                    setOpenAlert(true)
                                                                    setCurrentInvoiceId(data.id)
                                                                }}><strong>Supprimer de devis</strong></Button>
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                            }

                        </Fragment>
            }

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentInvoiceId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer ce devis ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer ce devis ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentInvoiceId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleClassifyInvoice(currentInvoiceId)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}