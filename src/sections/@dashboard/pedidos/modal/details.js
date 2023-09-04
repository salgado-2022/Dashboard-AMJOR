import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogTitle, IconButton, DialogActions, Grid, DialogContent, Typography, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function VerInsumosPedido(props) {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

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
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`${apiUrl}/api/admin/pedidos/detalle/ancheta/` + id);
                    setInsumo(res.data);
                    setIsLoading(false);
                } catch (err) {
                    console.log(err);
                    setIsLoading(false);
                }
            };

            fetchData();// Llama a la API al cargar el componente
        }
    }, [id]);

    return (
        <Dialog onClose={onHide} open={show} TransitionComponent={Transition}>
            <DialogTitle>Detalles de la ancheta</DialogTitle>
            <IconButton onClick={onHide} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                {isLoading ? (
                    <div className="text-center">
                        <h3>Espera un momento...</h3>
                    </div>
                ) : (
                    <>
                        <div style={{ padding: "10px" }}>
                            <br />
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Insumo</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Precio</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {data.map((insumos, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{insumos.ID_PedidoInsumo}</th>
                                                <td>{insumos.NombreInsumo}</td>
                                                <td>{insumos.Cantidad}</td>
                                                <td>{formatPrice(insumos.Precio)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {/* <Typography variant="h4">Total: {formatPrice(dataA.PrecioUnitario)}</Typography> */}
            </DialogActions>
        </Dialog>
    );
}

export { VerInsumosPedido };
