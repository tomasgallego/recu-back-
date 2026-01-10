import { query } from "../db.js";
import artistas from "./artistas.js";

const getAlbumes = async (_, res) => {
    // Completar con la consulta que devuelve todos los albumes
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:

    /*
        [
            {
                "id": 1,
                "nombre": "Nombre del album",
                "nombre_artista": "Nombre del artista"
            },
            {
                "id": 2,
                "nombre": "Nombre del album",
                "nombre_artista": "Nombre del artista"
            },
            ...
        ]
    */

        try {
            const result = await query("SELECT albumes.nombre, albumes.id, artistas.nombre AS nombre_artista FROM albumes JOIN artistas ON albumes.artista = artistas.id");
            res.json(result.rows);
        } catch (error) {
            console.error("Error fetching alumbs:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
};

const getAlbum = async (req, res) => {
    // Completar con la consulta que devuelve un album por id
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        {
            "id": 1,
            "nombre": "Nombre del album",
            "nombre_artista": "Nombre del artista"
        }
    */
   try {
        const result = await query("SELECT albumes.nombre, albumes.id, artistas.nombre AS nombre_artista FROM albumes JOIN artistas ON albumes.artista = artistas.id WHERE albumes.id = $1", [
        req.params.id,
        ]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching album:", error);
        res.status(500).json({ error: "Internal Server Error" });
   }      
};

const createAlbum = async (req, res) => {
    // Completar con la consulta que crea un album
    // Recordar que los parámetros de una consulta POST se encuentran en req.body
    // Deberían recbir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre del album",
            "artista": "Id del artista"
        }
    */
   try {
       const { nombre, artista } = req.body;
       await query("INSERT INTO albumes (nombre, artista) VALUES ($1, $2)", [nombre, artista]);
       res.status(201).json({nombre, artista})
   } catch (error) {
        console.error("Error creating artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
   }
};

const updateAlbum = async (req, res) => {
    // Completar con la consulta que actualiza un album
    // Recordar que en este caso tienen parámetros en req.params (el id) y en req.body (los demás datos)
    // Deberían recbir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre del album",
            "artista": "Id del artista"
        }
    */

    try {
        const { nombre, artista } = req.body;
        await query("UPDATE albumes SET nombre = $1, artista = $2 WHERE id = $3", [nombre, artista, req.params.id]);
        res.status(200).json({nombre, artista});
    } catch (error) {
        console.error("Error updating artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteAlbum = async (req, res) => {
    // Completar con la consulta que elimina un album
    // Recordar que los parámetros de una consulta DELETE se encuentran en req.params

    try {
        const songs = parseInt((await query("SELECT COUNT(*) FROM canciones WHERE album = $1;", [req.params.id])).rows[0].count);

        if (songs === 0) {
            const deletedRows = await query("SELECT * FROM albumes WHERE id = $1", [req.params.id]);
            await query("DELETE FROM albumes WHERE id = $1", [req.params.id]);
            res.status(204).json(deletedRows.rows);
        }
        else {
            res.status(400).send("Imposible eliminar album con canciones");
        }
    } catch (error) {
        console.error("Error deleting album:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getCancionesByAlbum = async (req, res) => {
    // Completar con la consulta que devuelve las canciones de un album
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la misma forma que getCanciones

    try {
        const result = await query("SELECT c.duracion, c.id, c.nombre, c.reproducciones, al.nombre AS nombre_album, ar.nombre AS nombre_artista FROM albumes al JOIN artistas ar ON ar.id = al.artista JOIN canciones c ON c.album = al.id WHERE al.id = $1", [req.params.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error selecting album's songs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const albumes = {
    getAlbumes,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getCancionesByAlbum,
};

export default albumes;
