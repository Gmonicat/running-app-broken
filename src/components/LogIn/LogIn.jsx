import * as React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import userActions from '../../redux/actions/userActions';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Visibility from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import { Divider, IconButton, OutlinedInput, InputLabel, InputAdornment, Link, FormControl, Box, Container, Grid, Checkbox, FormControlLabel, TextField, CssBaseline, Button, collapseClasses } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/system'
// import {KeyRound} from 'lucide-react'
const thisTheme = createTheme({
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            }
        }
    }
})
export default function LogIn() {
    const dispatch = useDispatch()
    const [sendButtonHovered, setSendButtonHovered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRemember, setShowRemember] = useState(false)
    const [rememberAccount, setRememberAccount] = useState(false);
    const [hasAccount, setHasAccount] = useState(false);
    // const [open, setOpen] = useState(true)
    // const user = useSelector((store) => store.userReducer.user);
    const navigate = useNavigate();
    
    const handleMouseDownPassword = () => {
        setShowPassword(true)
    }
    const handleMouseUpPassword = () => {
        setShowPassword(false)
    }
    const handlePreLogin = async (event) => {
        event.preventDefault()

        !hasAccount ? checkAcc(event) : handleSubmit(event)

    }
    const handleLoginVariables = {
        rememberCheckbox: ()=>{
                setRememberAccount(!rememberAccount)
        }
    }
    const checkAcc = async (event) => {

        const data = new FormData(event.currentTarget);
        const userData = {
            email: data.get('email'),
            from: 'signUp-form',
            aplication: 'training-app'
        }
        try {
            const params = {
                email: userData.email,
                from: userData.from,
                aplication: userData.aplication
            }
            const hasAcc = await dispatch(userActions.preSignIn(params))

            setHasAccount(hasAcc)

            if (!hasAcc) {
                navigate('/signup')
            }

        } catch (err) {
            console.error('Error during login processs', err)
        }

    }
    const handleSubmit = (event) => {
        event.preventDefault();
        let userInput = document.getElementById('email');
        userInput.disabled = false
        const data = new FormData(event.currentTarget);
        const userData = {
            email: data.get('email'),
            password: data.get('password'),
            from: "signUp-form",
            aplication: "training-app",
            remember:rememberAccount
        };


        dispatch(userActions.signInUser(userData))


    };
    const googleSubmit = async (event) => {

        const token = event.credential;
        const decoded = await jwtDecode(token);
        console.log(decoded)
        const userData = {
            email: decoded.email,
            password: decoded.family_name + "AMD23google",
            from: "google",
            aplication: "training-app"
        };
        dispatch(userActions.signInUser(userData))

    };

    const handleHovers = {
        sendButton: {
            handleMouseEnter: () => {
                setSendButtonHovered(true);
            },
            handleMouseLeave: () => {
                setSendButtonHovered(false);
            }
        },
        remember: {
            handleMouseEnter: () => {
                setShowRemember(true);
            },
            handleMouseLeave: () => {
                setShowRemember(false);
            }
        }



    }


    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh'
        }}>
            <div className='form_container'
                style={{
                    display: "flex",
                    backgroundColor: "transparent",
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 5,
                    paddingLeft: 5,
                    width: "auto",
                    height: "auto",
                    justifySelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid",
                    borderRadius: "20px"
                }}>

                <Container component="main" maxWidth="xs" >
                    <CssBaseline />
                    <Box
                        sx={{
                            width: '300px',
                            height: 'auto',
                            marginY: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <section style={{ width: 'auto', height: 'auto' }}>
                            <GoogleLogin
                                style={{ width: '20%' }}
                                onSuccess={googleSubmit}
                                buttonText="login"
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </section>
                        <Divider sx={{ my: 2, width: '100%' }} variant="middle"></Divider>

                        <Box component="form" onSubmit={handlePreLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: 2 }}>
                            <div className='form_main_container'>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    variant='outlined'
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    disabled={hasAccount}
                                    sx={{ '& .MuiInputBase-input': { backgroundColor: 'white !important' } }}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position='end'>
                                                <CheckCircleOutlineIcon edge="end" style={{ color: 'green', visibility: hasAccount ? 'visible' : 'hidden', backgroundColor: 'transparent' }}>

                                                </CheckCircleOutlineIcon>
                                            </InputAdornment>
                                    }}
                                >
                                </TextField>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="password"
                                    variant='outlined'
                                    label="Password"
                                    name="password"
                                    autoComplete="password"
                                    style={{ display: hasAccount ? 'block' : 'none' }}
                                    autoFocus
                                    disabled={!hasAccount}
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                >
                                </TextField>



                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <FormControlLabel
                                        control={<Checkbox onClick={handleLoginVariables.rememberCheckbox} onMouseEnter={handleHovers.remember.handleMouseEnter} onMouseLeave={handleHovers.remember.handleMouseLeave} value="remember" color="secondary" />}
                                        label={<p style={{ opacity: showRemember ? '1' : '0', transition: 'opacity 0.4s ease' }}>Stay Connected</p>}
                                        disableTypography
                                    />
                                    <Link href="#" variant="body2"
                                        style={{ visibility: hasAccount ? 'visible' : 'hidden' }}>
                                        Forgot
                                        {/* <KeyRound /> */}
                                    </Link>
                                </div>

                            </div>

                            <Button
                                variant='outlined'
                                onMouseEnter={handleHovers.sendButton.handleMouseEnter}
                                onMouseLeave={handleHovers.sendButton.handleMouseLeave}
                                type="submit"
                                className="custom-btn btn-7 form_submit_button"
                                style={{
                                    width: '50%',
                                    height: '50px',
                                    cursor: 'pointer',
                                    borderRadius: '20px',
                                    backgroundColor: sendButtonHovered ? 'rgb(87, 141, 255,0.7)' : 'rgb(87, 141, 255,0.5)',
                                }}>
                                Send
                            </Button>

                        </Box>
                    </Box>

                </Container>
            </div>
        </Box>
    );
}