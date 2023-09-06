import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { Link } from 'react-router-dom';
// mocks_
import account from '../../../_mock/account';

import axios from 'axios';

//sweetalert2
import Swal from 'sweetalert2';

import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function AccountPopover() {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
  const landingUrl = process.env.REACT_APP_AMJOR_LANDING_URL;
  const apiUrlDeploy = process.env.REACT_APP_AMJOR_API_URL_NEW;

  const [open, setOpen] = useState(null);
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [img, setImg] = useState();
  const [loading, setLoading] = useState(true)

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  axios.defaults.withCredentials = true;

  const logout = () => {
    axios
      .get(`${apiUrl}/api/logout`)
      .then((res) => {
        window.location.href = `${landingUrl}`;
        let timerInterval;
        Swal.fire({
          title: 'Cerrando sesión...',
          html: 'Por favor espere un momento',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer().querySelector('b');
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft();
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
            //window.location.reload(true);
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer');
          }
        });
      })
      .catch((err) => console.log(err));
  };


  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      setUser(decodedToken.userId);

      axios.get(`${apiUrl}/api/checkout/searchuserinfo/${decodedToken.userId}`)
        .then(res => {
          setData(res.data);
          setImg(res.data[0].img)
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener la información del usuario:", error);
        });
    }
  }, [user, apiUrl]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={`${apiUrl}/usuario/${img}`} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {loading ? (
          <Box sx={{ my: 1.5, px: 2.5 }}>

            <Typography variant="subtitle2" noWrap>

            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>

            </Typography>
          </Box>
        ) : (
          <Box sx={{ my: 1.5, px: 2.5 }}>

            <Typography variant="subtitle2" noWrap>
              {data[0].Nombre}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {data[0].correo}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>

          <Link to="/dashboard/profile" style={{ color: '#000' }}>
            <MenuItem onClick={handleClose}>
              Mi Perfil
            </MenuItem>
          </Link>

        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Cerrar sesión
        </MenuItem>
      </Popover>
    </>
  );
}