let DB;
const productoInput = document.querySelector('#producto');
const colaboradorInput = document.querySelector('#colaborador');
const cantidadInput = document.querySelector('#cantidad');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const comentarioInput = document.querySelector('#comentario');

// Contenedor para los productos
const contenedorCitas = document.querySelector('#citas');

// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);

// Heading
const heading = document.querySelector('#administra');


let editando = false;
let productosActuales = [];
const productosCaducados = [];

window.onload = () =>{
    eventListeners();

    crearDB();
}



// Eventos
eventListeners();
function eventListeners() {
    productoInput.addEventListener('change', datosCita);
    colaboradorInput.addEventListener('change', datosCita);
    cantidadInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    comentarioInput.addEventListener('change', datosCita);
}
const citaObj = {
    producto: '',
    colaborador: '',
    cantidad: '',
    fecha: '',
    hora:'',
    comentario: ''
}


function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI {

    constructor({citas}) {
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }

   imprimirCitas() { 
       
        this.limpiarHTML();

        


        //Leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');

        
        
        const fnTextoHeading = this.textoHeading;

        const total = objectStore.count();
        total.onsuccess = function(){
            
            fnTextoHeading(total.result);
        }


        //Esto seria como un for each de indexdb
        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                const {producto, colaborador, cantidad, fecha, hora, comentario, id } = cursor.value;

                

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;
            divCita.dataset.fecha = fecha;
            // scRIPTING DE LOS ELEMENTOS...
                

            const productoParrafo = document.createElement('h2');
            productoParrafo.classList.add('card-title', 'font-weight-bolder');
            productoParrafo.innerHTML = `${producto}`;

            const colaboradorParrafo = document.createElement('p');
            colaboradorParrafo.innerHTML = `<span class="font-weight-bolder">Colaborador: </span> ${colaborador}`;

            const cantidadParrafo = document.createElement('p');
            cantidadParrafo.innerHTML = `<span class="font-weight-bolder">Cantidad: </span> ${cantidad}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const comentarioParrafo = document.createElement('p');
            comentarioParrafo.innerHTML = `<span class="font-weight-bolder">Comentario: </span> ${comentario}`;

            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

            // Añade un botón de editar...
            const btnEditar = document.createElement('button');
            const cita = cursor.value;
            btnEditar.onclick = () => cargarEdicion(cita);

            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

            // Agregar al HTML
            divCita.appendChild(productoParrafo);
            divCita.appendChild(colaboradorParrafo);
            divCita.appendChild(cantidadParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(comentarioParrafo);
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita);
                
            //Ve al siguiente elemento
            cursor.continue();
            }
        }
    
   }

   textoHeading(resultado) {
    
        if(resultado > 0 ) {
            heading.textContent = 'Administra tus Productos'
        } else {
            heading.textContent = 'No hay Productos, comienza Añadiendo uno'
        }
    }

   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}


const administrarCitas = new Citas();

const ui = new UI(administrarCitas);
ui.mostrarCitas;

function nuevaCita(e) {
    e.preventDefault();

    const {producto, colaborador, cantidad, fecha, hora, comentario } = citaObj;

    

    // Validar
    if( producto === '' || colaborador === '' || cantidad === '' || fecha === ''  || hora === '' || comentario === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        //Edita en indexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj);

        transaction.oncomplete = () => {

        ui.imprimirAlerta('Guardado Correctamente');

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }


        

    } else {
        // Nuevo Registro

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});


        //insertar registro en idexdb
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habilitar el objectStore
        const objectStore = transaction.objectStore('citas');

        //Insertar en la base de datos
        objectStore.add(citaObj);

        transaction.oncomplete = function () {
            console.log('cita agregada');

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')
        }

        
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();
//Codigo para la base de datos
    fetch('http://localhost:3000/api/citas', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(citaObj),
})
    .then((response) => response.json())
    .then((data) => {
    console.log(data); // Puedes manejar la respuesta del servidor aquí
})
    .catch((error) => {
    console.error('Error al enviar la solicitud:', error);
});
}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.producto = '';
    citaObj.colaborador = '';
    citaObj.cantidad = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.comentario = '';
}


function eliminarCita(id) {
    
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');


    objectStore.delete(id);
    transaction.oncomplete = () => {
        console.log(`Cita ${id} eliminada...`);
        ui.imprimirCitas();
    }

    transaction.onerror = () => {
        console.log('hubo un error');
    }


    
}

function cargarEdicion(cita) {

    const {producto, colaborador, cantidad, fecha, hora, comentario, id } = cita;

    // Reiniciar el objeto
    citaObj.producto = producto;
    citaObj.colaborador = colaborador;
    citaObj.cantidad = cantidad;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.comentario = comentario;
    citaObj.id = id;

    // Llenar los Inputs
    productoInput.value = producto;
    colaboradorInput.value = colaborador;
    cantidadInput.value = cantidad;
    fechaInput.value = fecha;
    horaInput.value = hora;
    comentarioInput.value = comentario;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}

function crearDB() {
    //Crear la base de datos en version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    //Si hay un error
    crearDB.onerror = function(){
        console.log('hubo un error');
    }
    //Si todo sale bien
    crearDB.onsuccess = function () {
        console.log('base de datos creada correctamente');

        DB = crearDB.result;
        //Mostrar citas al cargar (Pero indexdb ya esta listo)
        ui.imprimirCitas();
    }

    //Definir el esquema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas',{
            keyPath: 'id',
            autoIncrement: true
        });
        //Definir todas las columnas
        objectStore.createIndex('producto', 'producto', {unique: false});
        objectStore.createIndex('colaborador', 'colaborador', {unique: false});
        objectStore.createIndex('cantidad', 'cantidad', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('comentario', 'comentario', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});
        console.log('DB creada y lista');
    }

}
// Modifica la función mostrarResultado para aceptar un mensaje y un elemento
function mostrarResultado(producto, descuento) {
    // Crea un nuevo elemento para mostrar el resultado
    const resultadoElemento = document.createElement('p');
    resultadoElemento.textContent = `${producto.querySelector('h2').textContent}: Descuento ${descuento}%`;

    // Agrega el elemento al div con ID 'resultado'
    const divResultado = document.getElementById('resultado');
    divResultado.appendChild(resultadoElemento);
    //Almacena el producto actual en la variable global
    productosActuales.push(producto);
}
//Función para determinar si un producto esta caducado o no
function esProductoCaducado(fechaCaducidad) {
    const fechaHoy = new Date();
    const diasDiferencia = Math.ceil((fechaCaducidad - fechaHoy) / (1000 * 60 * 60 * 24));
    
    return diasDiferencia < 0;
}
//Función para elimiar el producto
function eliminarProducto(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(Number(id));

    transaction.oncomplete = () => {
        console.log(`Producto ${id} eliminado de la base de datos.`);
        ui.imprimirCitas();  // Actualizar la UI después de eliminar
    };

    transaction.onerror = () => {
        console.error(`Error al eliminar el producto ${id}.`);
    };
}

//Función para filtrar productos con descuento
function filtrarProducto(descuento) {
    // Obtenemos la fecha actual
    const fechaHoy = new Date();
    // Obtenemos todos los elementos de la lista de productos
    const listaProductos = document.querySelectorAll('#citas div.cita');
    // Limpiamos el contenido actual del div resultado
    document.getElementById('resultado').innerHTML = "";
    //Creamos un objeto para almacenar los productos con descuento
    const productoConDescuento = [];
    // Iteramos sobre la lista de productos
    listaProductos.forEach((producto) => {
        const fechaCaducidad = new Date(producto.dataset.fecha);
        // Calcular la diferencia en días entre la fecha de hoy y la fecha de caducidad
        const diasDiferencia = Math.ceil((fechaCaducidad - fechaHoy) / (1000 * 60 * 60 * 24));
        // Determinar el descuento según la diferencia de días
        let productoDescuento = 0;
        if(esProductoCaducado(fechaCaducidad)){
            //Si el producto esta caducado eliminarlo de la base de datos
            eliminarProducto(producto.dataset.id);
            productosCaducados.push(producto);
        }
        if (diasDiferencia <= 60 && diasDiferencia > 30) {
            productoDescuento = 30;
        } else if (diasDiferencia <= 30 && diasDiferencia > 21) {
            productoDescuento = 50;
        } else if (diasDiferencia <= 21 && diasDiferencia > 7) {
            productoDescuento = 70;
        } else if (diasDiferencia <= 7) {
            productoDescuento = 90;
        }else if(diasDiferencia < 0){
            //El producto esta caducado
            productosCaducados.push(producto);
        }

        // Verificar si hay descuento y mostrar el resultado
        if (productoDescuento === descuento) {
            mostrarResultado(producto, productoDescuento);
            //Almacenar el producto con descuento en el array
            productoConDescuento.push(producto);
        }
    });
    
}

//Función para generar el PDF
function generarPDF(productoConDescuento) {
    //Crear un nuevo objeto jsPDF
    const doc = new jsPDF();

    //Titulo del PDF
    doc.text('Lista de Productos con Descuento', 20, 10);
    //Iterar sobre los productos con descuento y agregar al PDF
    productoConDescuento.forEach((producto, index) => {
        const nombreProducto = producto.querySelector('h2').textContent;
        const cantidadProducto = producto.querySelector('p:nth-of-type(2)').textContent.split(':')[1].trim(); // Obtener la cantidad del tercer párrafo
        const contenido = `${index + 1}. ${nombreProducto} - Cantidad: ${cantidadProducto}`;
        //Agregar cada producto al PDF en una nueva linea
        doc.text(contenido, 20, 20 + index * 10);
    });
    //Guardar el PDF como un blob y generar un enlace de descarga
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista_productos_descuento.pdf';
    a.click();
    //Limpiamos la variable de productosActuales después de generar el PDF
    productosActuales = [];
}


//Creamos el primer boton y lo asignamos a la constante boton1
const boton1 = document.getElementById("boton1");
//Añadimos la funcionalidad al boton 1 para que filtre segun nuestras necesidades
boton1.addEventListener("click", function(){
    productosActuales = [];
    filtrarProducto(30);
});
//Hacemos el mismo proceso con los otros dos botones
const boton2 = document.getElementById("boton2");
boton2.addEventListener("click", function () {
    console.log("pulsando el boton2");
    productosActuales = [];
    filtrarProducto(50);
});
//Boton 3
const boton3 = document.getElementById("boton3");
boton3.addEventListener("click", function () {
    console.log("pulsando el boton3");
    productosActuales = [];
    filtrarProducto(70);
});
//Botón 4
const boton4 = document.getElementById("boton4");
boton4.addEventListener("click", function () {
    console.log("pulsando el boton4");
    productosActuales = [];
    filtrarProducto(90);
});
const botonGenerarPDF = document.getElementById('generarPDF');
botonGenerarPDF.addEventListener('click', function(){
    generarPDF(productosActuales);
});
const btnProductosCaducados = document.getElementById('btnProductosCaducados');
btnProductosCaducados.addEventListener('click', function(){
    filtrarProducto();
    generarPDF(productosCaducados);
});

document.addEventListener('DOMContentLoaded', function () {
    const toggleCitasBtn = document.getElementById('toggleCitas');
    const citasList = document.getElementById('citas');

    toggleCitasBtn.addEventListener('click', function () {
        // Alternar la visibilidad de la lista
        citasList.style.display = citasList.style.display === 'none' ? 'block' : 'none';
        // Cambiar el texto del botón
        const buttonText = citasList.style.display === 'none' ? 'Mostrar Productos' : 'Ocultar Productos';
        toggleCitasBtn.textContent = buttonText;
    });
});


