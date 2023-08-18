import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

function VerInsumos(props) {
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
                    const res = await axios.get(`${apiUrl}/api/admin/anchetas/insancheta/` + id);
                    setInsumo(res.data);
                    setIsLoading(false);
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
    }, [id]);

    return (
        <Modal
            onHide={onHide}
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ zIndex: '2000' }}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" className="text-black">
                    Insumos de la Ancheta
                </Modal.Title>
                <Button variant="secondary" onClick={props.onHide} className="close">
                    <span aria-hidden="true">&times;</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center">
                        <h3>Espera un momento...</h3>
                        {/* Puedes agregar un spinner o un mensaje de carga aquí */}
                    </div>
                ) : (
                    <>
                        <div className="section" style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                            <div className="text">
                                <br />
                                <h1 style={{ margin: "0", fontSize: '24px' }}>{dataA.NombreAncheta}</h1>
                                <p style={{ marginRight: "10px", fontSize: '15px' }}>{dataA.Descripcion}</p>
                            </div>
                            <img src={`${apiUrl}/anchetas/` + dataA.image} alt="" style={{ marginTop: "30px", maxWidth: "300px" }} />
                        </div>
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
                                                <th scope="row">{insumos.ID_Insumos_Ancheta}</th>
                                                <td>{insumos.NombreInsumo}</td>
                                                <td>{insumos.Cantidad}</td>
                                                <td>{formatPrice(insumos.Total)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Modal.Footer>
                            <h4>Total: {formatPrice(dataA.PrecioUnitario)}</h4>
                        </Modal.Footer>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}

export { VerInsumos };
