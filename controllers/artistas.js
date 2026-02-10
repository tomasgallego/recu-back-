import { query } from "../db.js";

const getArtistas = async (_, res) => {
    try {
        const result = await query("SELECT * FROM artistas");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching artists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getArtista = async (req, res) => {
    try {
        const result = await query("SELECT * FROM artistas WHERE id = $1", [
            req.params.id,
        ]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createArtista = async (req, res) => {
    try {
        const { nombre } = req.body;
        await query("INSERT INTO artistas (nombre) VALUES ($1)", [nombre]);
        res.status(201).json({ nombre });
    } catch (error) {
        console.error("Error creating artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateArtista = async (req, res) => {
    try {
        const { nombre } = req.body;
        await query("UPDATE artistas SET nombre = $1 WHERE id = $2", [
            nombre,
            req.params.id,
        ]);
        res.json({ nombre });
    } catch (error) {
        console.error("Error updating artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteArtista = async (req, res) => {
    try {
        // Veamos que el artista no tenga albumes asociados
        const albumes = await query("SELECT * FROM albumes WHERE artista = $1", [req.params.id]);
        if (albumes.rows.length > 0) {
            return res.status(400).json({ error: "El artista tiene albumes asociados" });
        }

        await query("DELETE FROM artistas WHERE id = $1", [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAlbumesByArtista = async (req, res) => {
    try {
        const result = await query(
            `SELECT 
            albumes.id, 
            albumes.nombre, 
            artistas.nombre AS nombre_artista 
        FROM albumes 
            JOIN artistas ON albumes.artista = artistas.id 
        WHERE artista = $1`,
            [req.params.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching albums by artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getCancionesByArtista = async (req, res) => {
    try {
        const result = await query(
            `SELECT 
                canciones.id, 
                canciones.nombre, 
                canciones.duracion,
                canciones.reproducciones, 
                artistas.nombre AS nombre_artista,
                albumes.nombre AS nombre_album
            FROM canciones 
                JOIN albumes ON albumes.id = canciones.album
                JOIN artistas ON albumes.artista = artistas.id 
            WHERE artista = $1`,
            [req.params.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching songs by artist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const artistas = {
    getArtistas,
    getArtista,
    createArtista,
    updateArtista,
    deleteArtista,
    getAlbumesByArtista,
    getCancionesByArtista,
};

export default artistas;
