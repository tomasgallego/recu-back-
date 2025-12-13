import { query } from "../db.js";

const getAlbumes = async (_, res) => {
    try {
        const result = await query(`
            SELECT albumes.id, albumes.nombre, artistas.nombre AS nombre_artista
            FROM albumes JOIN artistas ON albumes.artista = artistas.id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching albumes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getAlbum = async (req, res) => {
    try {
        const result = await query(
            `SELECT albumes.id, albumes.nombre, artistas.nombre AS nombre_artista
             FROM albumes JOIN artistas ON albumes.artista = artistas.id
             WHERE albumes.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Álbum no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching album:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const createAlbum = async (req, res) => {
    try {
        const { nombre, artista } = req.body;
        await query("INSERT INTO albumes (nombre, artista) VALUES ($1, $2)", [nombre, artista]);
        res.status(201).json({ nombre, artista });
    } catch (error) {
        console.error("Error creating album:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateAlbum = async (req, res) => {
    try {
        const { nombre, artista } = req.body;
        await query("UPDATE albumes SET nombre = $1, artista = $2 WHERE id = $3", [
            nombre,
            artista,
            req.params.id,
        ]);
        res.json({ nombre, artista });
    } catch (error) {
        console.error("Error updating album:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        // Verificar si el álbum tiene canciones asociadas
        const canciones = await query("SELECT * FROM canciones WHERE album = $1", [req.params.id]);
        if (canciones.rows.length > 0) {
            return res.status(400).json({ error: "No puedes eliminar un álbum que tiene canciones." });
        }

        await query("DELETE FROM albumes WHERE id = $1", [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting album:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getCancionesByAlbum = async (req, res) => {
    try {
        const result = await query(
            `SELECT canciones.id, canciones.nombre, canciones.duracion, canciones.reproducciones,
                    artistas.nombre AS nombre_artista, albumes.nombre AS nombre_album
             FROM canciones
             JOIN albumes ON canciones.album = albumes.id
             JOIN artistas ON albumes.artista = artistas.id
             WHERE album = $1`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching canciones by album:", error);
        res.status(500).json({ error: "Error interno del servidor" });
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
