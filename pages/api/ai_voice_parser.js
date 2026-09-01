export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { transcript, mode } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ message: 'Transcription audio manquante' });
    }

    const text = transcript.toLowerCase();

    if (mode === 'inventaire') {
      // Analyse intelligente du texte pour l'inventaire
      const parsed = {
        nom: '',
        categorie: 'mobilier',
        quantite: 1,
        etat: 'bon',
        localisation: '',
        prix_acquisition: 0,
        notes: transcript
      };

      // Extrait de la quantité (ex: 25 chaises, 2 tondeuses, 1 groupe)
      const qtyMatch = text.match(/(\d+)\s*(unités|unité|pièces|pièce|chaises|matelas|tables|extincteurs|tondeuses|climatiseurs)?/i);
      if (qtyMatch && parseInt(qtyMatch[1], 10) > 0) {
        parsed.quantite = parseInt(qtyMatch[1], 10);
      }

      // Extrait du prix (ex: 15000 fcfa, 50000 francs, 15 000 f)
      const priceMatch = text.match(/(\d[\d\s\.]*)\s*(fcfa|francs|franc|f)/i);
      if (priceMatch) {
        const rawPrice = priceMatch[1].replace(/[\s\.]/g, '');
        if (parseInt(rawPrice, 10) > 0) {
          parsed.prix_acquisition = parseInt(rawPrice, 10);
        }
      }

      // Extrait de l'état
      if (text.includes('neuf') || text.includes('neuve')) parsed.etat = 'neuf';
      else if (text.includes('usagé') || text.includes('usagée') || text.includes('vieux') || text.includes('vieille')) parsed.etat = 'usage';
      else if (text.includes('réparer') || text.includes('panne') || text.includes('anomalie')) parsed.etat = 'a_reparer';
      else if (text.includes('hors service') || text.includes('grillé') || text.includes('cassé')) parsed.etat = 'hors_service';
      else parsed.etat = 'bon';

      // Extrait de la catégorie
      if (text.includes('chaise') || text.includes('table') || text.includes('lit') || text.includes('armoire') || text.includes('bureau')) parsed.categorie = 'mobilier';
      else if (text.includes('tondeuse') || text.includes('jardin') || text.includes('plantes') || text.includes('gazon')) parsed.categorie = 'jardinage';
      else if (text.includes('groupe') || text.includes('clim') || text.includes('câble') || text.includes('électrique')) parsed.categorie = 'electricite';
      else if (text.includes('pompe') || text.includes('eau') || text.includes('tuyau') || text.includes('robinet')) parsed.categorie = 'plomberie';
      else if (text.includes('matelas') || text.includes('drap') || text.includes('oreiller') || text.includes('couverture')) parsed.categorie = 'literie';
      else if (text.includes('fourneau') || text.includes('cuisine') || text.includes('marmite') || text.includes('frigo')) parsed.categorie = 'cuisine';
      else if (text.includes('autel') || text.includes('croix') || text.includes('statue') || text.includes('chapelle')) parsed.categorie = 'liturgique';
      else if (text.includes('extincteur') || text.includes('sécurité') || text.includes('alarme')) parsed.categorie = 'securite';
      else if (text.includes('enceinte') || text.includes('micro') || text.includes('sonorisation') || text.includes('ordi')) parsed.categorie = 'informatique';
      else parsed.categorie = 'autre';

      // Extrait de la localisation (ex: dans le garage, au dortoir A, à la cuisine)
      const locMatch = text.match(/(dans le|dans la|au|à la|aux|en)\s+([a-zàâéèêëîïôùûüç\s]+?)(,|\.|$|prix|état|quantité)/i);
      if (locMatch && locMatch[2]) {
        parsed.localisation = locMatch[2].trim();
      }

      // Nom du matériel (Nettoyage de la phrase)
      let cleanedTitle = transcript
        .replace(/ajouter/i, '')
        .replace(/créer/i, '')
        .replace(/nouveau/i, '')
        .replace(/matériel/i, '')
        .replace(/équipement/i, '')
        .trim();
      parsed.nom = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);

      return res.status(200).json({ success: true, parsed });
    }

    if (mode === 'entretien') {
      // Analyse intelligente du texte pour l'entretien
      const parsed = {
        titre: '',
        categorie: 'entretien',
        priorite: 'normale',
        statut: 'planifie',
        description: transcript,
        cout_estime: 0,
        cout_reel: 0,
        responsable: '',
        fournisseur: '',
        notes: transcript
      };

      // Extrait de la priorité
      if (text.includes('urgent') || text.includes('urgente') || text.includes('asap') || text.includes('immédiat')) parsed.priorite = 'urgente';
      else if (text.includes('haute') || text.includes('important')) parsed.priorite = 'haute';
      else if (text.includes('basse') || text.includes('mineur')) parsed.priorite = 'basse';
      else parsed.priorite = 'normale';

      // Extrait du statut
      if (text.includes('en cours') || text.includes('commencé')) parsed.statut = 'en_cours';
      else if (text.includes('terminé') || text.includes('fait') || text.includes('réglé')) parsed.statut = 'termine';
      else if (text.includes('annulé')) parsed.statut = 'annule';
      else parsed.statut = 'planifie';

      // Extrait du coût estimé
      const costMatch = text.match(/(\d[\d\s\.]*)\s*(fcfa|francs|franc|f)/i);
      if (costMatch) {
        const rawCost = costMatch[1].replace(/[\s\.]/g, '');
        if (parseInt(rawCost, 10) > 0) {
          parsed.cout_estime = parseInt(rawCost, 10);
        }
      }

      // Extrait de la catégorie
      if (text.includes('réparation') || text.includes('panne') || text.includes('fuite') || text.includes('cassé')) parsed.categorie = 'reparation';
      else if (text.includes('rénovation') || text.includes('peinture') || text.includes('toiture')) parsed.categorie = 'renovation';
      else if (text.includes('achat') || text.includes('acheter')) parsed.categorie = 'achat';
      else if (text.includes('construction') || text.includes('bâtiment')) parsed.categorie = 'construction';
      else parsed.categorie = 'entretien';

      // Extrait du responsable / artisan (ex: par l'artisan kouassi, avec gaston)
      const vendorMatch = text.match(/(par l'artisan|par|entreprise|prestataire|artisan)\s+([a-zàâéèêëîïôùûüç\s]+?)(,|\.|$|pour|montant)/i);
      if (vendorMatch && vendorMatch[2]) {
        parsed.fournisseur = vendorMatch[2].trim();
      }

      const respMatch = text.match(/(par le père|avec|responsable|suivi par)\s+([a-zàâéèêëîïôùûüç\s]+?)(,|\.|$|par|montant)/i);
      if (respMatch && respMatch[2]) {
        parsed.responsable = respMatch[2].trim();
      }

      let cleanedTitle = transcript
        .replace(/nouveau devis/i, '')
        .replace(/nouvel entretien/i, '')
        .replace(/ajouter/i, '')
        .replace(/créer/i, '')
        .trim();
      parsed.titre = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);

      return res.status(200).json({ success: true, parsed });
    }

    if (mode === 'reservation') {
      // Analyse intelligente pour la création de réservation par la voix
      const now = new Date();
      const nextWeekFrom = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const nextWeekTo = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      const parsed = {
        names: '',
        community: '',
        phone_number: '',
        email: '',
        participants: 10,
        individual_room_participants: 0,
        type_reservation: 'retraite',
        date_from: nextWeekFrom.toISOString().split('T')[0],
        date_to: nextWeekTo.toISOString().split('T')[0],
        montant_total: 0,
        montant_avance: 0,
        message: transcript
      };

      // Extrait du nombre de participants
      const partMatch = text.match(/(\d+)\s*(personnes|participants|pèlerins|membres|retraitants|fidèles)/i);
      if (partMatch) {
        parsed.participants = parseInt(partMatch[1], 10);
      }

      // Extrait du nombre de chambres individuelles
      const indMatch = text.match(/(\d+)\s*(chambres individuelles|chambre individuelle|chambres ind|chambre ind)/i);
      if (indMatch) {
        parsed.individual_room_participants = parseInt(indMatch[1], 10);
      }

      // Extrait du téléphone (ex: 07 09 36 06 72 ou 0709360672)
      const phoneMatch = text.match(/(0\d[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2})/);
      if (phoneMatch) {
        parsed.phone_number = phoneMatch[1].replace(/[\s\.]/g, '');
      }

      // Extrait du type de séjour
      if (text.includes('individuel') || text.includes('seul')) parsed.type_reservation = 'individuel';
      else if (text.includes('prière') || text.includes('veillée') || text.includes('recollection')) parsed.type_reservation = 'pray';
      else if (text.includes('mariage') || text.includes('baptême') || text.includes('conférence')) parsed.type_reservation = 'celebration';
      else if (text.includes('repos') || text.includes('détente')) parsed.type_reservation = 'repos';
      else parsed.type_reservation = 'retraite';

      // Extrait des montants (ex: total 150000 fcfa, avance 50000 fcfa)
      const totalMatch = text.match(/(total|montant total|prix total|pour un total de)\s*(\d[\d\s\.]*)\s*(fcfa|francs|f)?/i);
      if (totalMatch) {
        parsed.montant_total = parseInt(totalMatch[2].replace(/[\s\.]/g, ''), 10);
      }

      const avanceMatch = text.match(/(avance|acompte|déjà payé)\s*(\d[\d\s\.]*)\s*(fcfa|francs|f)?/i);
      if (avanceMatch) {
        parsed.montant_avance = parseInt(avanceMatch[2].replace(/[\s\.]/g, ''), 10);
      }

      // Extrait du nom et communauté
      const commMatch = text.match(/(communauté|paroisse|groupe|légion|mouvement)\s+([a-zàâéèêëîïôùûüç\s]+?)(,|\.|$|pour|avec|téléphone)/i);
      if (commMatch && commMatch[2]) {
        parsed.community = commMatch[2].trim().toUpperCase();
      }

      const nameMatch = text.match(/(monsieur|madame|père|frère|sœur|m\.|mme|du responsable|par)\s+([a-zàâéèêëîïôùûüç\s]+?)(,|\.|$|téléphone|communauté|pour)/i);
      if (nameMatch && nameMatch[2]) {
        parsed.names = nameMatch[2].trim();
      } else {
        parsed.names = transcript.split('.')[0].slice(0, 40);
      }

      return res.status(200).json({ success: true, parsed });
    }

    return res.status(400).json({ message: 'Mode invalide' });
  } catch (error) {
    console.error('Erreur API Voice Parser:', error);
    return res.status(500).json({ message: 'Erreur lors du traitement LLM de la voix', error: error.message });
  }
}
