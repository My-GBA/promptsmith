# 🚀 Guide Rapide : Sauvegarder vos Publicités

## ❌ Problème Actuel

**Vous voyez toujours la même publicité par défaut qui ne peut pas être supprimée.**

**Pourquoi ?** Parce que vous n'avez pas encore configuré de base de données. Les publicités que vous créez ne sont pas sauvegardées et disparaissent au rechargement de la page.

## ✅ Solution en 5 Minutes

### 📋 Étape 1 : Créer un Compte Neon (Gratuit)

1. **Allez sur** : [https://console.neon.tech](https://console.neon.tech)
2. **Cliquez sur** : `Sign up`
3. **Connectez-vous avec** : GitHub ou Google (gratuit, pas de CB)

![Neon Signup](https://console.neon.tech/favicon.ico)

---

### 📦 Étape 2 : Créer un Projet

1. Une fois connecté, cliquez sur **"Create a project"**
2. **Nom du projet** : `PromptSmith`
3. **Région** : `Europe (Frankfurt)` ou `Europe (Paris)` pour la France
4. **Cliquez sur** : `Create project`

⏱️ Cela prend ~10 secondes

---

### 🔗 Étape 3 : Copier l'URL de Connexion

1. Dans la page du projet, trouvez la section **"Connection string"**
2. Sélectionnez **"Pooled connection"** (recommandé)
3. **Copiez l'URL complète** qui ressemble à :

```
postgresql://username:password@ep-random-123.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

### ⚙️ Étape 4 : Configurer l'Application

1. **Ouvrez le fichier** : `.env.local` (à la racine du projet)

2. **Trouvez cette ligne** (ligne 14) :
   ```bash
   # POSTGRES_URL="postgresql://user:password@..."
   ```

3. **Remplacez-la par** :
   ```bash
   POSTGRES_URL="postgresql://VOTRE_URL_COPIEE_ICI"
   ```
   ⚠️ **N'oubliez pas de supprimer le `#` au début !**

4. **Commentez ou supprimez** la ligne 36 :
   ```bash
   # DEFAULT_AD_ENABLED="true"
   ```
   Mettez un `#` devant ou supprimez-la complètement.

---

### 🔄 Étape 5 : Redémarrer le Serveur

1. **Arrêtez le serveur** : `Ctrl+C` dans le terminal
2. **Redémarrez** :
   ```bash
   npm run dev
   ```

---

## 🎉 C'est Fait !

Maintenant :
- ✅ Vos publicités seront **sauvegardées** dans la base de données
- ✅ Vous pouvez **créer, modifier et supprimer** des publicités
- ✅ Les publicités **restent après rechargement** de la page
- ✅ Plus d'erreur 500 !

---

## 🆘 Besoin d'Aide ?

### Problème : "NeonDbError: Server error (HTTP status 404)"

**Solution** : Vérifiez que vous avez bien :
1. Copié l'URL complète (avec `postgresql://` au début)
2. Supprimé le `#` devant `POSTGRES_URL=`
3. Redémarré le serveur avec `npm run dev`

### Problème : "Database not configured"

**Solution** : L'URL n'est pas correctement définie dans `.env.local`. Vérifiez qu'il n'y a pas d'espace avant ou après l'URL.

---

## 📚 Plus d'Infos

Pour plus de détails, consultez : [SETUP_DB.md](SETUP_DB.md)
