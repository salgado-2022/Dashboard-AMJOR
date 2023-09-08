import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogTitle, IconButton, DialogActions, Grid, DialogContent, Typography, Slide, Card, CardMedia, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function VerInsumos(props) {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
    const deployApiUrl = process.env.REACT_APP_AMJOR_DEPLOY_API_URL;

    const { selectedAnchetaID, onHide, show } = props;
    const id = selectedAnchetaID;

    const [dataA, setDataA] = useState([]);

    const [data, setInsumo] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            });
        }
        return 'N/A'; // Otra opción es retornar un valor predeterminado en caso de que price no sea un número válido
    };
    

    useEffect(() => {
        setIsLoading(true);
        if (show) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`${apiUrl}/api/admin/anchetas/insancheta/` + id);
                    setInsumo(res.data);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000)
                } catch (err) {
                    console.log(err);
                    setIsLoading(false);
                }
            };

            axios.get(`${apiUrl}/api/admin/anchetas/anchellamada/` + id)
                .then(res => {
                    setDataA(prevValues => ({
                        ...prevValues,
                        NombreAncheta: res.data[0].NombreAncheta,
                        Descripcion: res.data[0].Descripcion,
                        PrecioUnitario: res.data[0].PrecioUnitario,
                        image: res.data[0].image
                    }));
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                });

            fetchData();// Llama a la API al cargar el componente
        }
    }, [id, apiUrl, show]);

    return (
        <Dialog onClose={onHide} open={show} TransitionComponent={Transition}>
            <DialogTitle>Detalles de la ancheta</DialogTitle>
            <IconButton onClick={onHide} sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                {isLoading ? (
                    <>
                    <Grid container spacing={2} marginBottom="16px">
                        <Grid item md={6}>
                            <Skeleton variant="text" animation="wave" width={250} height={30} />
                            <Skeleton variant="text" animation="wave" width={200} height={30} />
                        </Grid>
                        <Grid item md={6}>
                            <Skeleton variant="rounded" animation="wave" width={250} height={260} />
                        </Grid>
                    </Grid>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Insumo</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Precio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map((insumos) => (
                                <TableRow key={insumos.ID_Insumos_Ancheta}>
                                    <TableCell><Skeleton variant="text" animation="wave" width={30} height={30}/></TableCell>
                                    <TableCell><Skeleton variant="text" animation="wave" width={200} height={30}/></TableCell>
                                    <TableCell><Skeleton variant="text" animation="wave" width={30} height={30}/></TableCell>
                                    <TableCell><Skeleton variant="text" animation="wave" width={70} height={30}/></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </>
                ) : (
                    <>
                    <Grid container spacing={2} marginBottom="16px">
                        <Grid item md={6}>
                            <Typography fontSize="24px" marginBottom="6px">{dataA.NombreAncheta}</Typography>
                            <Typography>{dataA.Descripcion}</Typography>
                        </Grid>
                        <Grid item md={6}>
                            <Card>
                                <CardMedia component="img" alt="" height="260px" image={`${deployApiUrl}/anchetas/` + dataA.image}/>
                            </Card>
                        </Grid>
                    </Grid>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Insumo</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Precio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map((insumos) => (
                                <TableRow key={insumos.ID_Insumos_Ancheta}>
                                    <TableCell>{insumos.ID_Insumos_Ancheta}</TableCell>
                                    <TableCell>{insumos.NombreInsumo}</TableCell>
                                    <TableCell>{insumos.Cantidad}</TableCell>
                                    <TableCell>{formatPrice(insumos.Total)}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <>
                    <Skeleton variant="text" animation="wave" width={180} height={50}/>
                    </>
                ):(
                    <>
                    <Typography variant="h4">Total: {formatPrice(dataA.PrecioUnitario)}</Typography>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export { VerInsumos };
