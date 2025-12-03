# Configuration de la Base de Données

## Erreur "NeonDbError: Server error (HTTP status 404): Not Found"

Cette erreur signifie que la connexion à la base de données PostgreSQL (Neon) n'est pas configurée.

## Solution

### 1. Créer un compte Neon (Gratuit)

1. Allez sur [https://console.neon.tech](https://console.neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez l'URL de connexion PostgreSQL

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` et ajoutez votre URL Neon :

```env
POSTGRES_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
```

### 3. Générer le hash du mot de passe admin

```bash
npm install -g bcryptjs
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('VotreMotDePasseAdmin', 10))"
```

Ajoutez le hash dans `.env.local` :

```env
AUTH_SECRET="une-cle-secrete-aleatoire-minimum-32-caracteres"
ADMIN_PASSWORD_HASH="$2a$10$..."
ADMIN_TOTP_SECRET="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
```

### 4. Redémarrer le serveur

```bash
npm run dev
```

La table `advertisements` sera créée automatiquement au premier appel de l'API.

## Vérification

Testez la connexion en allant sur :
- [http://localhost:3000/api/ads](http://localhost:3000/api/ads)

Vous devriez voir `{"ads":[]}` au lieu d'une erreur 500.

## Alternative : Mode Sans Base de Données

Si vous ne voulez pas utiliser de base de données, vous pouvez activer la publicité par défaut dans `.env.local` :

```env
DEFAULT_AD_ENABLED="true"
```

L'application fonctionnera avec une publicité par défaut, mais vous ne pourrez pas gérer les publicités depuis l'interface admin.
