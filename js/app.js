// Instalar JSON Server por medio de NPM y luego poner en la terminal: "json-server --watch db.json --port 4000" para simular un API

// Variables

// Objeto del cliente
let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

// Categorías de los platillos
const categorias = {
    1: 'Comida',
    2: 'Bebida',
    3: 'Postre'
}

// Selectores y eventos

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

// Funciones principales

function guardarCliente() {
    // Recuperar los valores puestos en los inputs
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Verificar si los campos están vacíos
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        // Verificar que no haya una alerta previa
        const existeAlerta = document.querySelector('.invalid-feedback');

        if (!existeAlerta) {
            // Mostrar una alerta de error
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            // Quitar la alerta luego de 3s
            setTimeout(() => alerta.remove(), 3000);
        }

        // Parar la ejecución de la función
        return;
    }

    // Rellenar los datos del objeto de cliente
    cliente = { ...cliente, mesa, hora }

    // Ocultar el modal del formulario
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    // Mostrar las secciones
    mostrarSecciones();

    // Obtener platillos de la API de JSON Server
    obtenerPlatillos();
}

function mostrarSecciones() {
    // Seleccionar las secciones con display: none y quitarles esa clase de Bootstrap
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.error(error))
}

function mostrarPlatillos(platillos) {
    // Selector donde se imprimirán los platillos
    const contenido = document.querySelector('#platillos .contenido');

    // Iterar sobre los platillos que llegan del API
    platillos.forEach(platillo => {
        // Destructuring del platillo
        const { nombre, precio, categoria, id } = platillo;

        // Scripting de los elementos HTML de cada platillo
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombreDiv = document.createElement('DIV');
        nombreDiv.classList.add('col-md-4');
        nombreDiv.textContent = nombre;
        row.appendChild(nombreDiv);

        const precioDiv = document.createElement('DIV');
        precioDiv.classList.add('col-md-3', 'fw-bold');
        precioDiv.textContent = `$${precio}`;
        row.appendChild(precioDiv);

        const categoriaDiv = document.createElement('DIV');
        categoriaDiv.classList.add('col-md-3');
        categoriaDiv.textContent = categorias[categoria];
        row.appendChild(categoriaDiv);

        // Input para seleccionar la cantidad de cada platillo
        const cantidadInput = document.createElement('INPUT');
        cantidadInput.classList.add('form-control');
        cantidadInput.id = `producto-${id}`;
        cantidadInput.type = 'number';
        cantidadInput.value = 0;
        cantidadInput.min = '0';

        // Detectar la cantidad y el platillo que se está agregando (eventListener)
        cantidadInput.onchange = () => {
            const cantidad = parseInt(cantidadInput.value);
            agregarPlatillo({ ...platillo, cantidad })
        };

        const cantidadDiv = document.createElement('DIV');
        cantidadDiv.classList.add('col-md-2');
        cantidadDiv.appendChild(cantidadInput)
        row.appendChild(cantidadDiv);

        // Insertarlo en el selector de contenido
        contenido.appendChild(row);
    });
}

function agregarPlatillo(platillo) {
    // Extraer el pedido actual
    let { pedido } = cliente;

    // Verificar que la cantidad sea mayor a 0
    if (platillo.cantidad <= 0) {
        // Si el platillo ya estaba en el pedido, eliminarlo
        const pedidoActualizado = pedido.filter(articulo => articulo.id !== platillo.id);
        cliente.pedido = [...pedidoActualizado];

        // Actualizar el resumen de consumo en el DOM
        actualizarResumen();

        return;
    }

    // Revisar si el platillo ya existe en el arreglo del pedido
    const platilloExiste = pedido.some(articulo => articulo.id === platillo.id);

    if (platilloExiste) {
        // Actualizar la cantidad del platillo
        const pedidoActualizado = pedido.map(articulo => {
            if (articulo.id === platillo.id) {
                articulo.cantidad = platillo.cantidad;
            }
            return articulo;
        });

        cliente.pedido = [...pedidoActualizado];
    } else {
        // Añadir el platillo al arreglo
        cliente.pedido = [...pedido, platillo];
    }

    // Actualizar el resumen de consumo en el DOM
    actualizarResumen();
}

function actualizarResumen() {
    // Selector del resumen
    const contenido = document.querySelector('#resumen .contenido');

    // Limpiar el HTML previo del selector
    limpiarHTML(contenido);

    // Revisamos si el pedido quedó vacío
    if (cliente.pedido.length === 0) {
        mensajePedidoVacio(contenido);
        return;
    }

    // Scripting de los elementos HTML
    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Platillos consumidos';
    resumen.appendChild(heading);

    const mesa = document.createElement('P');
    mesa.classList.add('fw-bold');
    mesa.textContent = 'Mesa: '
    const mesaSpan = document.createElement('SPAN');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa;
    mesa.appendChild(mesaSpan);
    resumen.appendChild(mesa);

    const hora = document.createElement('P');
    hora.classList.add('fw-bold');
    hora.textContent = 'Hora: '
    const horaSpan = document.createElement('SPAN');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;
    hora.appendChild(horaSpan);
    resumen.appendChild(hora);

    // Iterar sobre el pedido y mostrar los platillos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente
    pedido.forEach(platillo => {
        const { nombre, precio, categoria, id, cantidad } = platillo;

        const li = document.createElement('LI');
        li.classList.add('list-group-item');

        const nombreLi = document.createElement('H4');
        nombreLi.classList.add('my-4');
        nombreLi.textContent = nombre;
        li.appendChild(nombreLi);

        const cantidadLi = document.createElement('P');
        cantidadLi.classList.add('fw-bold');
        cantidadLi.textContent = 'Cantidad: ';
        const cantidadLiSpan = document.createElement('SPAN');
        cantidadLiSpan.classList.add('fw-normal');
        cantidadLiSpan.textContent = cantidad;
        cantidadLi.appendChild(cantidadLiSpan);
        li.appendChild(cantidadLi);

        const precioLi = document.createElement('P');
        precioLi.classList.add('fw-bold');
        precioLi.textContent = 'Precio unitario: ';
        const precioLiSpan = document.createElement('SPAN');
        precioLiSpan.classList.add('fw-normal');
        precioLiSpan.textContent = `$${precio}`;
        precioLi.appendChild(precioLiSpan);
        li.appendChild(precioLi);

        // Calcular subtotal
        const subtotalLi = document.createElement('P');
        subtotalLi.classList.add('fw-bold');
        subtotalLi.textContent = 'Subtotal: ';
        const subtotalLiSpan = document.createElement('SPAN');
        subtotalLiSpan.classList.add('fw-normal');
        subtotalLiSpan.textContent = calcularSubtotal(precio, cantidad);
        subtotalLi.appendChild(subtotalLiSpan);
        li.appendChild(subtotalLi);

        // Botón de eliminar el producto
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido'

        // Funcionalidad de eliminar
        btnEliminar.onclick = () => {
            eliminarProducto(id);
        }

        li.appendChild(btnEliminar)

        grupo.appendChild(li);
    });

    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar formulario de propinas
    formularioPropinas();
}

function limpiarHTML(contenedor) {
    while (contenedor.firstChild) contenedor.removeChild(contenedor.firstChild);
}

function calcularSubtotal(precio, cantidad) {
    return `$${precio * cantidad}`;
}

function eliminarProducto(id) {
    // Eliminar de la lista y actualizar el DOM
    const { pedido } = cliente;
    const pedidoActualizado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...pedidoActualizado];
    actualizarResumen();

    // Regresar la cantidad del pedido a 0 en el formulario
    const inputProducto = document.querySelector(`#producto-${id}`);
    inputProducto.value = 0;
}

function mensajePedidoVacio(contenedor) {
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenedor.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const formularioDiv = document.createElement('DIV');
    formularioDiv.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-align-center');
    heading.textContent = 'Propina';
    formularioDiv.appendChild(heading);

    // Radio buttons
    for (valor of ['0', '10', '25', '50']) {
        const radioDiv = document.createElement('DIV');
        radioDiv.classList.add('form-check');

        const radioInput = document.createElement('INPUT');
        radioInput.classList.add('form-check-input');
        radioInput.type = 'radio';
        radioInput.name = 'propina';
        radioInput.value = valor;

        // Funcionalidad de calcular propina
        radioInput.onclick = calcularPropina;

        const radioLabel = document.createElement('LABEL');
        radioLabel.classList.add('form-check-label');
        radioLabel.textContent = `${valor}%`;

        radioDiv.appendChild(radioInput);
        radioDiv.appendChild(radioLabel);

        formularioDiv.appendChild(radioDiv);
    }

    formulario.appendChild(formularioDiv)
    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido } = cliente

    // Sumar todos los subtotales
    let subtotal = 0;
    pedido.forEach(articulo => subtotal += articulo.precio * articulo.cantidad);

    // Calcular rl valor de la propina
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

    // Calcular el valor total a pagar
    const total = subtotal + propina;

    // Mostrar subtotal, propina y total a pagar en el DOM
    mostrarPagos(subtotal, propina, total);
}

function mostrarPagos(subtotal, propina, total) {
    // Contenedor padre en el que se insertarán los pagos
    const formulario = document.querySelector('.formulario > div');

    // Eliminar resultados previos si ya los había
    const resultadoPrevio = document.querySelector('.total-pagar');
    if (resultadoPrevio) {
        resultadoPrevio.remove();
        return mostrarPagos(subtotal, propina, total);
    }

    // Contendedor de los pagos
    const divPagos = document.createElement('DIV');
    divPagos.classList.add('total-pagar');

    // Subtotal
    const subtotalP = document.createElement('P');
    subtotalP.classList.add('fs-5', 'fw-bold', 'mt-3');
    subtotalP.textContent = 'Subtotal Consumo: ';
    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;
    subtotalP.appendChild(subtotalSpan);
    divPagos.appendChild(subtotalP);

    // Propina
    const propinaP = document.createElement('P');
    propinaP.classList.add('fs-5', 'fw-bold', 'mt-2');
    propinaP.textContent = 'Propina: ';
    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;
    propinaP.appendChild(propinaSpan);
    divPagos.appendChild(propinaP);

    // Total
    const totalP = document.createElement('P');
    totalP.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalP.textContent = 'Total a Pagar: ';
    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;
    totalP.appendChild(totalSpan);
    divPagos.appendChild(totalP);

    // Insertar en el DOM
    formulario.appendChild(divPagos);
}