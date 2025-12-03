// Type pour une annonce publicitaire
export type Advertisement = {
  // Identifiant unique de l'annonce
  id: string
  // Titre/nom de la publicité
  title: string
  // Description courte de la pub
  description: string
  // Type de média: 'image' ou 'video'
  mediaType: 'image' | 'video'
  // URL de l'image ou vidéo (URL complète ou base64)
  mediaUrl: string
  // Lien vers lequel diriger au clic sur la pub
  targetLink: string
  // Texte du bouton CTA
  buttonText: string
  // Actif ou non
  isActive: boolean
  // Date de création
  createdAt: number
  // Date de dernière modification
  updatedAt: number
}

// Retourne une annonce aléatoire ou la suivante en rotation
export function getNextAdvertisement(ads: Advertisement[], currentIndex: number): { ad: Advertisement | null; nextIndex: number } {
  // Filtre les annonces actives
  const activeAds = ads.filter(ad => ad.isActive)
  
  if (activeAds.length === 0) {
    return { ad: null, nextIndex: 0 }
  }
  
  // Calcule l'index suivant
  const nextIdx = (currentIndex + 1) % activeAds.length
  
  return {
    ad: activeAds[nextIdx],
    nextIndex: nextIdx
  }
}
