import { Avatar, IconButton } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import SidebBar from '../SideBar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { io } from "socket.io-client"
import CardTypes from '../CardTypes'
import Agencies from '../Agencies'
// import CreateOwner from '../Agencies/Create'
import Agency from '../Agencies/Agency'

import Categories from '../Categories'
import Category from '../Categories/Category'
import CreateCategory from '../Categories/Create'
import EditAgency from '../Agencies/Edit'
import CreateAgency from '../Agencies/Create'

const socket = io.connect(process.env.REACT_APP_API_BASE_URL, {
    query: {
        id: JSON.parse(localStorage.getItem("data"))?.id
    }
})

function stringToColor(string) {
    let hash = 0
    let i

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
}

export default function Home() {
    const [administrators, setAdministrators] = useState([])
    

    const params = useParams()
    const navigate = useNavigate()

    const Component = () => {
        if (params.page === undefined || params.page === 'agencies') {
            return (
                <Agencies userRights={administrators[0].rightsId} />
            )
        } else if (params.page.startsWith('agency-')) {
            return (
                <Agency agency={params.page.substring(7)} />
            )
        } else if (params.page === 'create-agency') {
            return (
                <CreateAgency />
            )
        } else if (params.page.startsWith('edit-agency-')) {
            return (
                <EditAgency agency={params.page.substring(12)} />
            )
        } else if(params.page === ('card-types')) {
            return (
                <CardTypes userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'categories') {
            return (
                <Categories socket={socket} />
            )
        } else if (params.page.startsWith('categories-')) {
            return (
                <Category category={params.page.substring(11)} />
            )
        } else if (params.page === 'create-category') {
            return (
                <CreateCategory />
            )
        }
    }

    useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/administrators/${JSON.parse(localStorage.getItem("data")).id}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            console.log(response.data)
                            if (response.data.data[0].admin.lastLogin.substring(0, response.data.data[0].admin.lastLogin.length - 5) === JSON.parse(localStorage.getItem("data")).lastLogin.substring(0, JSON.parse(localStorage.getItem("data")).lastLogin.length - 5)) {
                                setAdministrators([response.data.data[0].admin])
                            } else {
                                console.log(response.data.data[0].admin);
                            }
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
        fetchData()

    }, [])

    if (!localStorage.getItem('isLogged')) {
        window.location = '/sign-in'
        return 'Redirection ...'
    }

    return (
        <Fragment>
            {
                administrators.length > 0 ?
                    <Fragment>
                        <SidebBar socket={socket} userRights={administrators[0].rightsId} />
                        <div className='wrap-content'>
                            <div className='wrap-content-body'>
                                <div className='wrap-content-header'>
                                    <table width='100%'>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Link to='/admins'><strong>Home</strong></Link>
                                                </td>
                                                <td>
                                                    <div align='right'>
                                                        {
                                                            administrators.map((data) => {
                                                                return (
                                                                    <div key={data.id}>
                                                                        <IconButton size="small" onClick={() => {
                                                                            navigate('/sign-out')
                                                                        }}>
                                                                            <Avatar sx={{ width: 32, height: 32 }} {...stringAvatar(data.fullName)} />
                                                                        </IconButton>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <Component />
                            </div>
                        </div>
                    </Fragment> :
                    "Chargement ..."
            }
        </Fragment>
    )
}
