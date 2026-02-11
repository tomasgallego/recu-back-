import { query } from "../db.js";

async function add_cancion(req, res) {
  try {
    const result = await query(
      "INSERT INTO playlist (cancion_id) VALUES ($1) RETURNING *",
      [req.body.cancion_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function delete_cancion(req, res) {
    try {
        const result = await query("DELETE FROM playlist WHERE playlist_id = $1 AND cancion_id = $2 RETURNING *", [
            req.body.playlistId,
            req.body.cancionId,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Song not found in playlist" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error removing song from playlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function get_playlist(req, res) {
    try {
        const result = await query(
            "SELECT canciones.id, canciones.nombre, canciones.duracion, canciones.reproducciones FROM playlist JOIN canciones ON playlist.cancion_id = canciones.id WHERE playlist.playlist_id = $1",
            [req.params.playlistId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const playlist = {
    add_cancion,
    delete_cancion,
    get_playlist
};

export default playlist;