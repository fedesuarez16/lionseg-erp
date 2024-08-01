import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const InvoiceModal = ({ isOpen, onRequestClose }) => {
    const [formValues, setFormValues] = useState({
        descripcion: '',
        fechaFactura: '',
        fechaVencimiento: '',
        monto: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formValues); // Verifica que los datos del formulario están correctos

        const response = await fetch('/api/invoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        });

        const data = await response.json();
        console.log(data); // Verifica la respuesta del servidor

        if (response.ok) {
            // Procesa la respuesta si es correcta
            onRequestClose();
        } else {
            // Maneja errores si es necesario
            console.error('Error al subir la factura');
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>Crear Factura</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Descripción:
                    <input
                        type="text"
                        name="descripcion"
                        value={formValues.descripcion}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Fecha de Factura:
                    <input
                        type="date"
                        name="fechaFactura"
                        value={formValues.fechaFactura}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Fecha de Vencimiento:
                    <input
                        type="date"
                        name="fechaVencimiento"
                        value={formValues.fechaVencimiento}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Monto:
                    <input
                        type="number"
                        name="monto"
                        value={formValues.monto}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Crear Factura</button>
            </form>
        </Modal>
    );
};

export default InvoiceModal;
