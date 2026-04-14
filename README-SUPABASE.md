# Configuration Supabase (PostgreSQL en ligne gratuit)

## Pourquoi Supabase ?

- **100% gratuit** pour les projets personnels
- **PostgreSQL natif** (base de données professionnelle)
- **Pas de configuration serveur** nécessaire
- **Interface web** pour gérer la base de données
- **API automatique** générée
- **Stockage de fichiers** inclus
- **Temps réel** (real-time)

## Étapes de configuration

### 1. Créer un compte Supabase
1. Allez sur https://supabase.com
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub ou Google
4. Choisissez "Free plan" (gratuit)

### 2. Créer un nouveau projet
1. **Nom du projet** : `birthday-app`
2. **Mot de passe base de données** : choisissez un mot de passe solide
3. **Région** : choisissez la plus proche de vous (Europe: `EU West`)
4. **Cliquez sur "Create new project"**

### 3. Obtenir les clés API
Une fois le projet créé :
1. **Allez dans Settings** (icône engrenage)
2. **Cliquez sur "API"**
3. **Copiez ces deux informations** :
   - **Project URL** (ex: `https://xxxxxxxx.supabase.co`)
   - **anon public key** (commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Configurer le code
Dans `src/services/supabaseService.ts` :
```typescript
const SUPABASE_URL = 'https://votre-projet.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5. Créer la table dans Supabase
1. **Allez dans "Table Editor"**
2. **Cliquez sur "Create a new table"**
3. **Configuration de la table** :
   - **Name** : `birthday_photos`
   - **Enable Row Level Security** : décochez pour l'instant

4. **Colonnes à créer** :
   ```
   id (bigint) - Primary Key - Default: auto increment
   image_data (text) - nullable
   image_url (text) - nullable  
   description (text) - nullable
   original_name (text) - nullable
   file_size (bigint) - nullable
   mime_type (text) - nullable
   storage_path (text) - nullable
   created_at (timestamp) - Default: now()
   updated_at (timestamp) - nullable
   ```

### 6. Configurer le Storage (pour les fichiers)
1. **Allez dans "Storage"**
2. **Cliquez sur "New bucket"**
3. **Nom du bucket** : `birthday-photos`
4. **Public bucket** : cochez
5. **Cliquez sur "Save"**

### 7. Activer les permissions
Dans "Authentication" > "Policies" :
1. **Pour la table `birthday_photos`** :
   - **Enable RLS** (Row Level Security)
   - **Créez une policy** :
     - Name: `Allow all operations`
     - Using: `true`
     - Check: `true`

2. **Pour le bucket `birthday-photos`** :
   - **Créez une policy** :
     - Name: `Allow all uploads`
     - Using: `bucket.id = 'birthday-photos'`
     - Check: `true`

### 8. Mettre à jour le composant Birthday
Modifiez `src/pages/Birthday.tsx` pour utiliser Supabase :

```typescript
import { SupabaseService } from '../services/supabaseService';

// Remplacer PostgresService par SupabaseService
const photos = await SupabaseService.getAllPhotos();
const uploadedPhoto = await SupabaseService.uploadPhotoFile(file, description);
await SupabaseService.deletePhoto(photoId);
```

## Limites du plan gratuit Supabase

- **Base de données** : 500 Mo
- **Stockage** : 1 Go
- **Bandwidth** : 2 Go par mois
- **Utilisateurs authentifiés** : 50 000
- **Connexions simultanées** : 60

**Pour votre usage personnel : largement suffisant !**

## Avantages de Supabase

- **Zéro configuration serveur**
- **Interface web intuitive**
- **API REST automatique**
- **Real-time WebSocket**
- **Authentification intégrée**
- **Fonctions Edge** (serverless)
- **Backup automatique**

## Alternative: Railway

Si vous préférez un VPS avec PostgreSQL pur :

1. **Créez un compte Railway** (https://railway.app)
2. **Ajoutez un service PostgreSQL**
3. **Déployez votre backend Node.js**
4. **Configurez les variables d'environnement**

## Test rapide

Une fois configuré, testez avec ce code dans la console du navigateur :

```javascript
import { supabase } from './services/supabaseService';

// Test de connexion
const { data, error } = await supabase
  .from('birthday_photos')
  .select('count');
  
console.log('Test connexion:', data, error);
```

## Déploiement

Votre application avec Supabase est prête à être déployée sur :
- **Vercel** (recommandé pour React)
- **Netlify**
- **GitHub Pages**
- **N'importe quel hébergeur statique**

**L'API Supabase fonctionne depuis n'importe quel frontend !**
