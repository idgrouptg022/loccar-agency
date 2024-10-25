import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Badge, Fab, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { AccountBalance, AttachMoneyTwoTone, CarCrash, CardGiftcard, CarRepair, CheckBoxTwoTone, ChecklistRounded, Close, CommentBank, CreditCard, DocumentScanner, Error, Group, GroupSharp, History, Key, ListAlt, ListAltRounded, MapsUgcSharp, Menu, ReportProblem, Settings, SettingsBackupRestore, VerifiedUserTwoTone } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import logoText from '../../assets/images/sogenuvologotext.png'

export default function SidebBar(props) {
    const navigate = useNavigate()

    const sideBarRef = useRef()
    const [hideButton, setHideButton] = useState(false)

    return (
        <div className='side-bar-cover'>

            {
                !hideButton &&
                <Fab color='primary' className='show-menu-bar-button' size='small'
                    sx={{ mt: 4, ml: 1 }} onClick={() => {
                        if (sideBarRef) {
                            sideBarRef.current.style.display = 'block'
                            setHideButton(true)
                        }
                    }}>
                    <Menu />
                </Fab>
            }


            <div className='side-bar' ref={sideBarRef}>

                <div className='side-bar-body'>
                    <table width={`100%`}>
                        <tbody>
                            <tr>
                                <td>
                                    <a href="/">
                                        <img src={logoText} alt="img-logo" width={'90%'} />
                                    </a>
                                </td>
                                <td width={50} className='close-menu-bar-button'>
                                    <Fab color='light' size='small' sx={{ mt: -1 }} onClick={() => {
                                        if (sideBarRef) {
                                            if (sideBarRef.current.style.display === 'none') {
                                                sideBarRef.current.style.display = 'block'
                                                setHideButton(true)
                                            } else {
                                                sideBarRef.current.style.display = 'none'
                                                setHideButton(false)
                                            }

                                        }
                                    }}>
                                        <Close />
                                    </Fab>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <List
                        sx={{ width: '100%', color: '#FFF' }}
                        component="nav">

                        <ListItemButton onClick={() => {
                            navigate('/admins/categories')
                        }}>
                            <ListItemIcon>
                                <ListAltRounded style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de catégories</strong>} />
                        </ListItemButton>

                        <Typography px={'20px'} mt={2} mb={1} color={'lightblue'}>
                            <small>Gestion de types de cartes</small>
                        </Typography>

                        <ListItemButton onClick={() => {
                            navigate('/admins/card-types')
                        }}>
                            <ListItemIcon>
                                <CreditCard style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Types de cartes</strong>} />
                        </ListItemButton>

                        
                        <Typography px={'20px'} mt={2} mb={1} color={'lightblue'}>
                            <small>Agences</small>
                        </Typography>

                        <ListItemButton onClick={() => {
                            navigate('/admins/agencies')
                        }}>
                            <ListItemIcon>
                                <GroupSharp style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion d'agences</strong>} />
                        </ListItemButton>
                    </List>


                    <div style={{ margin: 20, color: 'white' }}>
                        Copyright &copy; 2023 SOGEVO
                    </div>
                </div>
            </div>
        </div>
    )
}
