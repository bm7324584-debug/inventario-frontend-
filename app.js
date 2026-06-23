const API_URL = "https://inventario-backend-tnot.onrender.com/productos";

async function obtenerProductos() {

    try {

        const res = await fetch(API_URL);
        const datos = await res.json();

        const tabla = document.getElementById("tabla");

        tabla.innerHTML = "";

        datos.forEach(prod => {

            tabla.innerHTML += `
            <tr>
                <td>${prod.nombre}</td>
                <td>$${prod.precio}</td>
                <td>${prod.existencia} pzas</td>

                <td>
                    <button
                        class="btn-editar"
                        onclick="editarProducto('${prod._id}','${prod.nombre}',${prod.precio},${prod.existencia})">
                        Editar
                    </button>
                </td>

                <td>
                    <button
                        class="btn-eliminar"
                        onclick="eliminarProducto('${prod._id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
            `;
        });

    } catch (err) {
        console.error("Error al traer datos:", err);
    }
}

document.getElementById("formProducto").addEventListener("submit", async (e) => {

    e.preventDefault();

    const id = document.getElementById("productoId").value;

    const producto = {
        nombre: document.getElementById("nombre").value,
        precio: Number(document.getElementById("precio").value),
        existencia: Number(document.getElementById("existencia").value)
    };

    try {

        let res;

        if(id){

            res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(producto)
            });

            alert("Producto actualizado correctamente");

        } else {

            res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(producto)
            });

            alert("Producto guardado correctamente");
        }

        if(res.ok){

            document.getElementById("formProducto").reset();
            document.getElementById("productoId").value = "";

            obtenerProductos();
        }

    } catch(err){

        console.error("Error:", err);
    }

});

function editarProducto(id, nombre, precio, existencia){

    document.getElementById("productoId").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("existencia").value = existencia;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function eliminarProducto(id){

    const confirmar = confirm("¿Deseas eliminar este producto?");

    if(!confirmar) return;

    try {

        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if(res.ok){

            alert("Producto eliminado correctamente");
            obtenerProductos();
        }

    } catch(err){

        console.error("Error al eliminar:", err);
    }
}

obtenerProductos();