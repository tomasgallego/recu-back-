import { query } from "../db.js";

const getCanciones = async (_, res) => {
    // Completar con la consulta que devuelve todas las canciones
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        [
            {
                "id": "Id de la canción",
                "nombre": "Nombre de la canción",
                "nombre_artista": "Id del artista",
                "nombre_album": "Id del album",
                "duracion": "Duración de la canción",
                "reproducciones": "Reproducciones de la canción"
            },
            {
                "id": "Id de la canción",
                "nombre": "Nombre de la canción",
                "nombre_artista": "Id del artista",
                "nombre_album": "Id del album",
                "duracion": "Duración de la canción",
                "reproducciones": "Reproducciones de la canción"
            },
            ...
        ]
    */

        try {
            const result = await query("SELECT c.duracion, c.id, c.nombre, c.reproducciones, al.nombre AS nombre_album, ar.nombre AS nombre_artista FROM albumes al JOIN artistas ar ON ar.id = al.artista JOIN canciones c ON c.album = al.id");
            res.json(result.rows);
        } catch (error) {
            console.error("Error fetching songs:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
};

const getCancion = async (req, res) => {
    // Completar con la consulta que devuelve una canción
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        {
            "id": "Id de la canción",
            "nombre": "Nombre de la canción",
            "nombre_artista": "Id del artista",
            "nombre_album": "Id del album",
            "duracion": "Duración de la canción",
            "reproducciones": "Reproducciones de la canción"
        }
    */
    try {
        const result = await query("SELECT c.duracion, c.id, c.nombre, c.reproducciones, al.nombre AS nombre_album, ar.nombre AS nombre_artista FROM albumes al JOIN artistas ar ON ar.id = al.artista JOIN canciones c ON c.album = al.id WHERE c.id = $1", [req.params.id])
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching song:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createCancion = async (req, res) => {
    // Completar con la consulta que crea una canción
    // Recordar que los parámetros de una consulta POST se encuentran en req.body
    // Deberían recibir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre de la canción",
            "album": "Id del album",
            "duracion": "Duración de la canción",
        }
    */
    // (Reproducciones se inicializa en 0)
    try {
        const { nombre, album, duracion } = req.body;
        await query("INSERT INTO canciones (nombre, album, duracion, reproducciones) VALUES ($1, $2, $3, 0)", [nombre, album, duracion]);
        res.status(201).json({nombre, album, duracion});
    } catch (error) {
     console.error("Error creating song:", error);
     res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateCancion = async (req, res) => {
    // Completar con la consulta que actualiza una canción
    // Recordar que los parámetros de una consulta PUT se encuentran en req.body
    // Deberían recibir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre de la canción",
            "album": "Id del album",
            "duracion": "Duración de la canción",
        }
    */
    // (Reproducciones no se puede modificar con esta consulta)
    try {
        const { nombre, album, duracion } = req.body;
        await query("UPDATE canciones SET nombre = $1, album = $2, duracion = $3 WHERE id = $4", 
            [nombre, album, duracion, req.params.id]
        );
        res.status(200).json({nombre, album, duracion});
    } catch (error) {
     console.error("Error updating song:", error);
     res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteCancion = async (req, res) => {
    // Completar con la consulta que elimina una canción
    // Recordar que los parámetros de una consulta DELETE se encuentran en req.params
    try {
        const deletedRows = await query("SELECT * FROM canciones WHERE id = $1", [req.params.id]);
        await query("DELETE FROM canciones WHERE id = $1", [req.params.id]); 
        res.status(204).send(deletedRows.rows[0]);
    } catch (error) {
     console.error("Error deleting song:", error);
     res.status(500).json({ error: "Internal Server Error" });
    }
};

const reproducirCancion = async (req, res) => {
    // Completar con la consulta que aumenta las reproducciones de una canción
    // En este caso es una consulta PUT, pero no recibe ningún parámetro en el body, solo en los params
    try {
        const result = await query("SELECT reproducciones FROM canciones WHERE id = $1",
             [req.params.id]
            );

        const reproducciones = result.rows[0].reproducciones;
        const newReproducciones = reproducciones + 1;

        await query("UPDATE canciones SET reproducciones = $1 WHERE id = $2", 
            [newReproducciones, req.params.id]
        );
        res.status(204).json(newReproducciones);
    } catch (error) {
     console.error("Error reproducing song:", error);
     res.status(500).json({ error: "Internal Server Error" });
    }
};

const canciones = {
    getCanciones,
    getCancion,
    createCancion,
    updateCancion,
    deleteCancion,
    reproducirCancion,
};

export default canciones;
