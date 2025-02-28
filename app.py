from flask import Flask, request, send_file
import pandas as pd
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def fusionner_fichiers_excel(fichiers, mots_cles):
    dataframes = []
    mots_cles_liste = [mot.strip() for mot in mots_cles.split(",")]
    
    for fichier, mot_cle in zip(fichiers, mots_cles_liste):
        df = pd.read_excel(fichier)
        df.insert(0, "Mot Clé", mot_cle)  # Ajouter la colonne "Mot Clé"
        dataframes.append(df)
    
    result_df = pd.concat(dataframes, ignore_index=True)
    resultat_path = os.path.join(UPLOAD_FOLDER, "fusion_resultats.xlsx")
    result_df.to_excel(resultat_path, index=False)
    return resultat_path


@app.route("/upload", methods=["POST"])
def upload_files():
    if "fichiers" not in request.files or "mots_cles" not in request.form:
        return {"error": "Fichiers ou mots-clés manquants"}, 400
    
    fichiers = request.files.getlist("fichiers")
    mots_cles = request.form["mots_cles"]
    fichiers_sauvegardes = []
    
    for fichier in fichiers:
        if fichier.filename == "":
            return {"error": "Un des fichiers n'a pas de nom valide"}, 400
        
        filename = secure_filename(fichier.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        fichier.save(filepath)
        fichiers_sauvegardes.append(filepath)
    
    fichier_final = fusionner_fichiers_excel(fichiers_sauvegardes, mots_cles)
    return send_file(fichier_final, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
