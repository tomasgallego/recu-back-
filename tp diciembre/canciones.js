import { query } from "../db.js";
//filtrat y join
const getCanciones = async (_, res) => {
    try {
        const result = await query(
            `SELECT canciones.id, canciones.nombre, canciones.duracion, canciones.reproducciones,
                    artistas.nombre AS nombre_artista, albumes.nombre AS nombre_album
             FROM canciones
             JOIN albumes ON canciones.album = albumes.id
             JOIN artistas ON albumes.artista = artistas.id`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching canciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
//getcancion
const getCancion = async (req, res) => {
    try {
        const result = await query(
            `SELECT canciones.id, canciones.nombre, canciones.duracion, canciones.reproducciones,
                    artistas.nombre AS nombre_artista, albumes.nombre AS nombre_album
             FROM canciones
             JOIN albumes ON canciones.album = albumes.id
             JOIN artistas ON albumes.artista = artistas.id
             WHERE canciones.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching cancion:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
//crear cancion
const createCancion = async (req, res) => {
    try {
        const { nombre, album, duracion } = req.body;
        await query(
            "INSERT INTO canciones (nombre, album, duracion, reproducciones) VALUES ($1, $2, $3, 0)",
            [nombre, album, duracion]
        );
        res.status(201).json({ nombre, album, duracion });
    } catch (error) {
        console.error("Error creating cancion:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateCancion = async (req, res) => {
    try {
        const { nombre, album, duracion } = req.body;
        const result = await query("UPDATE canciones SET nombre = $1, album = $2, duracion = $3 WHERE id = $4", [
            nombre,
            album,
            duracion,
            req.params.id
        ]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }
        
        res.json({ nombre, album, duracion });
    } catch (error) {
        console.error("Error updating cancion:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const deleteCancion = async (req, res) => {
    try {
        const result = await query("DELETE FROM canciones WHERE id = $1", [req.params.id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }
        
        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting cancion:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const reproducirCancion = async (req, res) => {
    try {
        const result = await query("UPDATE canciones SET reproducciones = reproducciones + 1 WHERE id = $1", [req.params.id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }
        
        res.sendStatus(204); // Asegúrate de que esto esté configurado a 204
    } catch (error) {
        console.error("Error reproducing cancion:", error);
        res.status(500).json({ error: "Error interno del servidor" });
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