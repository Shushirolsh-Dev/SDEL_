import type { AppStrings } from '../types.app';

export const meta = {
  code: 'fr',
  nativeName: 'Français',
};

const FR: AppStrings = {
  header: {
    brand: 'THESDEL',
    syncSynced: 'SYNCHRONISÉ',
    syncPending: 'SYNCHRONISATION EN ATTENTE :',
    console: 'Console',
  },
  nav: {
    today: "Aujourd'hui",
    timetable: 'Emploi du temps',
    attendance: 'Présence',
    class: 'Classe',
    profile: 'Profil',
  },
  toast: {
    classCodeNotFound: (code) =>
      `Code de classe "${code}" introuvable.`,
    alreadyJoined:
      'Vous avez déjà rejoint cette classe ou demandé à la rejoindre.',
    errorJoining: (message) =>
      `Erreur lors de la tentative de rejoindre la classe : ${message}`,
    requestSubmitted:
      "Votre demande d'inscription a été envoyée pour approbation.",
    enrolledSuccess: (className) =>
      `Inscription réussie dans "${className}" !`,
    joinApproved: "Demande d'inscription de l'étudiant approuvée !",
    joinDenied: "Demande d'inscription de l'étudiant refusée.",
    removalRequestSent:
      'Demande de retrait envoyée au représentant de la classe.',
    memberRemoved: 'Membre supprimé avec succès.',
    removalApproved: 'Suppression du membre approuvée.',
    removalRejected: 'Suppression du membre refusée.',
    codeChanged: (code) =>
      `Le code de classe a été modifié : ${code}`,
    attendanceMarked: 'Présence enregistrée !',
    timetableAdded: 'Cours ajouté à l’emploi du temps !',
    timetableUpdated: 'Cours mis à jour dans l’emploi du temps !',
    timetableDeleted: 'Cours supprimé de l’emploi du temps.',
    memberPromoted: 'Membre promu au rang d’assistant !',
    assistantDemoted: 'Assistant rétrogradé au rang de membre.',
    classDeleted: 'Classe supprimée avec succès.',
    mustBeLoggedIn:
      'Vous devez être connecté pour quitter une classe.',
    cannotLeaveAsRep:
      'Vous êtes le représentant de la classe. Vous devez supprimer la classe ou promouvoir quelqu’un au rang d’assistant avant de partir.',
    selectAssistantToTransfer:
      'Veuillez sélectionner un assistant à qui transférer la propriété.',
    leaveFailed:
      'Impossible de quitter la classe. Veuillez réessayer.',
    leftClass: 'Vous avez quitté la classe avec succès.',
    transferFailed:
      'Impossible de transférer la propriété. Veuillez réessayer.',
    roleUpdateFailed:
      'Impossible de mettre à jour le rôle. Veuillez réessayer.',
    roleUpdateFailedSelf:
      'Impossible de mettre à jour votre rôle. Veuillez réessayer.',
    ownershipTransferred: (name) =>
      `La propriété a été transférée à ${name}. Vous êtes maintenant membre.`,
    leaveAfterTransferFailed:
      'La propriété a été transférée, mais la sortie a échoué. Veuillez réessayer de quitter la classe.',
    leftAfterTransfer:
      'Vous avez quitté la classe avec succès après avoir transféré la propriété.',
  },
  confirm: {
    transferOwnershipToOne: (name) =>
      `Vous êtes le représentant de la classe. Transférer la propriété à ${name} et quitter la classe ?`,
  },
  broadcast: {
    classRepMarker: 'Représentant de classe',
    classCreated: (name, author, code) =>
      `La classe "${name}" a été créée par le représentant ${author} avec le code unique : ${code}`,
    entryAdded: (subject, day, startTime) =>
      `Emploi du temps ajouté : ${subject} le ${day} à ${startTime}.`,
    venueChanged: (subject, from, to) =>
      `La salle de ${subject} a été déplacée de ${from} à ${to}. `,
    classCancelled: (subject) =>
      `Le cours de ${subject} est officiellement ANNULÉ (streak protégée). `,
    cancellationReverted: (subject) =>
      `L'annulation du cours de ${subject} a été annulée. `,
    entryDeleted: (subject) =>
      `Le cours de ${subject} a été définitivement supprimé de l'emploi du temps.`,
    dayNames: [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ],
  },
  profile: {
    roleFallback: 'Étudiant',
    studentFallback: 'Étudiant',
    settingsButton: 'Paramètres',
    logoutButton: 'Se déconnecter',
  },
  notifications: {
    header: {
      backTitle: 'Retour',
      title: 'Notifications',
      subtitle: 'Annonces et mises à jour de la classe',
      refreshButton: 'Actualiser',
      refreshingButton: 'Actualisation',
    },
    empty: {
      title: 'Rien de nouveau',
      subtitle:
        'Les annonces officielles et les mises à jour importantes de la classe apparaîtront ici.',
    },
    card: {
      labelCancelled: 'ANNULÉ',
      labelUrgent: 'URGENT',
      labelVenueChanged: 'SALLE MODIFIÉE',
      labelInfo: 'INFO',
      labelSponsored: 'SPONSORISÉ',
      labelAdSpace: 'ESPACE PUBLICITAIRE',
      sponsoredSpotlight: 'À la une sponsorisée',
      byLabel: 'Par',
      teamLabel: 'ÉQUIPE THESDEL',
      agreedButton: (count) => `D'accord · ${count}`,
      agreeButton: (count) => `D'accord · ${count}`,
      adLearnMore: 'En savoir plus',
      pollSectionLabel: 'Sondage de la classe',
      pollResponseRegistered: 'Réponse enregistrée',
      pollResponseRecorded: 'Votre réponse a été enregistrée.',
      pollSelected: 'Sélectionné :',
      pollYourResponse: 'Votre réponse',
      pollLineCounter: (current, max) =>
        `${current}/${max} lignes`,
      pollTextareaPlaceholder: 'Écrivez votre réponse...',
      pollSubmitResponse: 'Envoyer la réponse',
      pollSubmitAnswer: 'Envoyer la réponse',
      pollDefaultYes: 'Oui',
      pollDefaultNo: 'Non',
    },
    rep: {
      title: 'Annonce du représentant',
      subtitle: 'Envoyez une mise à jour officielle à votre classe',
      textareaPlaceholder:
        'Partagez un conseil d’étude, un rappel, un changement d’emploi du temps ou une information importante...',
      counterLabel: (current, max) => `${current}/${max}`,
      visibleToMembers: 'Visible par les membres de la classe',
      postButton: 'Publier l’annonce',
      postingButton: 'Publication',
      successMessage: 'Annonce publiée avec succès',
    },
  },
  home: {
    header: {
      todayLabel: "Aujourd'hui",
      greetingMorning: 'Bonjour',
      greetingAfternoon: 'Bon après-midi',
      greetingEvening: 'Bonsoir',
      nameFallback: 'Étudiant',
      openNotifications: 'Ouvrir les notifications',
    },
    nextClass: {
      liveClassLabel: 'Cours en direct',
      nextClassLabel: 'Prochain cours',
      fallbackClassName: 'Cours',
      noMoreClassesTitle: 'Plus aucun cours',
      noMoreClassesSubtitle: 'Votre journée universitaire est libre.',
      liveCountdown: (minutes) =>
        `EN DIRECT · ${minutes} min restantes`,
      startsInHours: (hours, minutes) =>
        `Commence dans ${hours} h ${minutes} min`,
      startsInMinutes: (minutes) =>
        `Commence dans ${minutes} min`,
      noMoreClassesToday: "Plus aucun cours aujourd'hui",
    },
    schedule: {
      sectionTitle: "Aujourd'hui",
      sectionSubtitle: 'Votre emploi du temps',
      refreshing: 'Actualisation...',
      refresh: 'Actualiser',
      emptyTitle: "Aucun cours aujourd'hui",
      emptySubtitle:
        'Profitez de votre temps libre ou prenez de l’avance.',
      fallbackClassName: 'Cours',
      liveBadge: 'EN DIRECT',
      cancelledBadge: 'ANNULÉ',
      presentButton: 'Présent',
      markButton: 'Marquer',
    },
    attendance: {
      sectionLabel: 'Présence',
      attendedCount: (count) => `${count} présents`,
      totalCount: (count) => `${count} au total`,
    },
    updates: {
      sectionTitle: 'Mises à jour',
      showLess: 'Afficher moins',
      viewAll: 'Tout afficher',
      noUpdates: 'Aucune mise à jour pour le moment.',
      reacted: 'Réagi',
      acknowledge: 'Accuser réception',
      labelCancelled: 'ANNULÉ',
      labelVenueChanged: 'SALLE MODIFIÉE',
      labelGlobal: 'GLOBAL',
      labelClassUpdate: 'MISE À JOUR DE LA CLASSE',

      edited: 'Modifié',
      editBroadcast: 'Modifier l’annonce',
      deleteBroadcast: 'Supprimer l’annonce',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      deleteBroadcastTitle: 'Supprimer cette annonce ?',
      deleteBroadcastMessage: 'Cette action est irréversible.',
      dateLocale: 'fr-FR',
    },
    rep: {
      title: 'Représentant de classe',
      subtitle: 'Envoyez une annonce à votre classe.',
      textareaPlaceholder: 'Écrivez une annonce...',
      sending: 'Envoi...',
      broadcast: 'Annonce',
      successMessage: 'Annonce envoyée avec succès.',
    },
    ad: {
      sponsoredLabel: 'Sponsorisé',
      altFallback: 'Sponsorisé',
    },
  },
  timetable: {
    header: {
      sectionLabel: 'Emploi du temps académique',
      title: 'Emploi du temps',
      noClassSelected: 'Aucune classe sélectionnée',
      weekButton: 'Semaine',
      addClassButton: 'Ajouter un cours',
    },

    permission: {
      managerPrefix: 'Vous disposez des',
      managerSuffix:
        'privilèges. Vous pouvez gérer l’emploi du temps partagé.',
      memberPrefix:
        'Vous consultez cet emploi du temps en tant que',
      memberMiddle: 'membre',
      memberSuffix:
        '. Seuls les gestionnaires de classe peuvent modifier les entrées.',
    },

    empty: {
      noClassTitle: 'Aucune classe',
      noClassSubtitle:
        'Rejoignez ou créez une classe pour commencer à consulter son emploi du temps partagé.',
      emptyTitle: 'L’emploi du temps est vide',
      emptySubtitle:
        'Aucun cours n’est encore programmé pour ce groupe de classe.',
      addFirstClassButton: 'Ajouter le premier cours',
      nothingScheduledTitle: 'Rien de programmé',
      nothingScheduledSubtitle:
        'Aucun cours n’est programmé pour ce jour.',
    },

    days: {
      labels: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
      ],
      short: [
        'Lun',
        'Mar',
        'Mer',
        'Jeu',
        'Ven',
        'Sam',
        'Dim',
      ],
    },

    entryCard: {
      cancelledBadge: 'Annulé',
      roomShiftedBadge: 'Salle modifiée',
      originallyLabel: 'À l’origine :',
      minutesSuffix: 'min',
      editButton: 'Modifier',
      deleteButton: 'Supprimer',
    },

    form: {
      newClassEyebrow: 'Nouveau cours',
      editClassEyebrow: 'Gérer le cours',
      addTitle: 'Ajouter un cours à l’emploi du temps',
      editTitle: 'Modifier le cours',
      subjectLabel: 'Matière',
      subjectPlaceholder: 'ex. Génie logiciel',
      dayLabel: 'Jour',
      venueLabel: 'Salle',
      venuePlaceholder: 'ex. LT 1',
      startsLabel: 'Début',
      endsLabel: 'Fin',
      cancelClassTitle: 'Annuler le cours',
      cancelClassSubtitle:
        'Conserver le cours dans l’emploi du temps mais le marquer comme annulé.',
      cancelButton: 'Annuler',
      saveChangesButton: 'Enregistrer les modifications',
      addClassButton: 'Ajouter un cours',
      errorSubjectRequired:
        'Le nom de la matière est obligatoire.',
      errorVenueRequired: 'La salle est obligatoire.',
      errorTimeOrder:
        'L’heure de début doit être antérieure à l’heure de fin.',
    },

    deleteDialog: {
      title: 'Supprimer ce cours ?',
      descriptionPrefix:
        'Vous êtes sur le point de supprimer',
      descriptionSuffix:
        'de l’emploi du temps partagé. Cette action est irréversible.',
      keepButton: 'Conserver le cours',
      removeButton: 'Supprimer',
    },
  },

  attendance: {
    header: {
      sectionLabel: 'Dossier académique',
      title: 'Présence',
      subtitle:
        'Suivez votre présence, vos séries et vos cours terminés.',
    },

    statusSafe: 'Présence correcte',
    statusNeedsAttention: 'Attention requise',

    summary: {
      attendanceLabel: 'Présence',
      targetLabel: 'Objectif : 75 %+',
      attendedLabel: 'Présent',
      attendedSubtitle:
        'Cours terminés auxquels vous avez assisté',
      missedLabel: 'Absent',
      missedSubtitle: 'Cours terminés manqués',
      cancelledLabel: 'Annulé',
      cancelledSubtitle: 'Exclus des statistiques',
    },

    streak: {
      sectionTitle: 'Série de présence',
      currentStreakLabel: 'Série actuelle',
      consecutiveSuffix: 'cours consécutifs',
      explanation:
        'Assistez à chaque cours prévu pour maintenir votre série. Les cours annulés ne la rompent pas. Une absence à un cours prévu la réinitialise.',
      currentRow: 'Actuelle',
      longestRow: 'Plus longue',
      classesSuffix: 'cours',
      statusRow: 'Statut',
      statusSafe: 'Sûre',
      statusLow: 'Faible',
    },

    week: {
      sectionTitle: 'Présence hebdomadaire',
      sectionSubtitle:
        'Examinez chaque cours prévu pour la semaine sélectionnée.',
      todayBadge: "Aujourd'hui",
      noClassesScheduled: 'Aucun cours programmé',
      showLess: 'Afficher moins',
      showWeekend: (count) =>
        `Afficher le week-end · ${count} jours supplémentaires`,
    },

    weekDaysLong: [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ],

    weekDaysShort: [
      'Lun',
      'Mar',
      'Mer',
      'Jeu',
      'Ven',
      'Sam',
      'Dim',
    ],

    status: {
      cancelledSafe: 'Annulé · Sûr',
      attended: 'Présent',
      missed: 'Absent',
      upcoming: 'À venir',
    },

    empty: {
      noClassesTitle: 'Aucun cours',
      noClassesSubtitle:
        'Rejoignez une classe pour commencer à suivre votre présence.',
    },
  },

  class: {
    header: {
      eyebrow: 'Espaces de classe',
      title: 'Vos classes',
      subtitle:
        'Gérez vos espaces de classe, les membres, les accès et les codes de classe.',
    },

    tabMyClasses: 'Mes classes',
    tabCreateClass: 'Créer une classe',

    emptyTitle: 'Aucune classe',
    emptySubtitle:
      'Rejoignez une classe existante avec un code de classe ou créez un nouvel espace.',
    emptyJoinButton: 'Rejoindre une classe',
    emptyCreateButton: 'Créer une classe',

    sidebar: {
      sectionLabel: 'Classes',
      membersSuffix: 'membres',
      joinAnother: 'Rejoindre une autre classe',
    },

    overview: {
      badgeClassSpace: 'Espace de classe',
      badgeRepresentative: 'Représentant',
      noDescription:
        'Aucune description de classe n’a encore été ajoutée.',
      visibilityPublic: 'Publique',
      visibilityPrivate: 'Privée',
      classCodeLabel: 'Code de classe',
      copyCodeTitle: 'Copier le code de classe',
      membersLabel: 'Membres',
      studentsSubtitle: 'étudiants dans cette classe',
    },

    requests: {
      joinRequestsTitle: 'Demandes d’adhésion',
      joinRequestsSubtitle:
        'Examinez les étudiants en attente d’accès à cette classe.',
      waitingForApproval: 'En attente d’approbation',
      approveButton: 'Approuver',
      denyButton: 'Refuser',
      removalRequestsTitle: 'Demandes de retrait',
      removalRequestsSubtitle:
        'Examinez les demandes de retrait de membres.',
      memberRemovalRequested: 'Retrait d’un membre demandé',
      rejectButton: 'Rejeter',
    },

    members: {
      title: 'Membres',
      subtitle: 'Étudiants actuellement dans cette classe.',
      youBadge: 'Vous',
      roleRepresentative: 'Représentant',
      roleAssistant: 'Assistant',
      roleMember: 'Membre',
      demoteButton: 'Rétrograder',
      promoteButton: 'Nommer assistant',
      removeButton: 'Supprimer',
      requestRemovalButton: 'Demander le retrait',
      emptyMessage: 'Aucun membre pour le moment.',
    },

    management: {
      title: 'Gestion de la classe',
      subtitle: 'Gérez les accès, la propriété et cette classe.',
      classCodeTitle: 'Code de classe',
      classCodeSubtitle:
        'Régénérez le code s’il a été trop largement partagé.',
      regenerateButton: 'Régénérer',
      transferTitle: 'Transférer la propriété',
      transferSubtitle:
        'Donnez à un autre administrateur la propriété de cette classe.',
      transferButton: 'Transférer',
      leaveTitle: 'Quitter la classe',
      leaveSubtitle: 'Vous retirer de cette classe.',
      leavingButton: 'Départ...',
      leaveButton: 'Quitter',
      deleteTitle: 'Supprimer la classe',
      deleteSubtitle:
        'Supprimer définitivement cette classe et ses membres.',
      deleteButton: 'Supprimer',
    },

    modals: {
      loadingCreating: 'Création de la classe',
      loadingJoining: 'Rejoindre la classe',
      loadingUpdating: 'Mise à jour',
      loadingFallback: 'Veuillez patienter...',
      transferTitle: 'Transférer la propriété',
      transferSubtitle:
        'Sélectionnez un assistant qui deviendra le nouveau propriétaire.',
      cancelButton: 'Annuler',
      transferConfirmButton: 'Transférer',
      confirmDeleteTitle: 'Supprimer la classe ?',
      confirmRegenerateTitle: 'Régénérer le code de classe ?',
      confirmRejectJoinTitle:
        'Refuser la demande d’adhésion ?',
      confirmRemoveMemberTitle: 'Supprimer le membre ?',
      confirmRequestRemovalTitle:
        'Demander le retrait du membre ?',
      confirmDeleteBody: (className) =>
        `Cela supprimera définitivement "${className}". Cette action est irréversible.`,
      confirmRegenerateBody: (className) =>
        `Le code actuel de "${className}" cessera de fonctionner et un nouveau code sera généré.`,
      confirmRejectJoinBody: (userName) =>
        `La demande de ${userName} pour rejoindre cette classe sera refusée.`,
      confirmRemoveMemberBody: (memberName) =>
        `${memberName} sera retiré de cette classe.`,
      confirmRequestRemovalBody: (memberName) =>
        `${memberName} recevra une demande de retrait de cette classe.`,
      confirmDeleteButton: 'Supprimer',
      confirmRegenerateButton: 'Régénérer',
      confirmRejectButton: 'Refuser',
      confirmRemoveButton: 'Supprimer',
      confirmRequestRemovalButton: 'Demander le retrait',
    },

    join: {
      eyebrow: 'Rejoindre une classe',
      title: 'Saisissez un code de classe',
      subtitle:
        'Utilisez le code fourni par le propriétaire ou le représentant de la classe.',
      classCodeLabel: 'Code de classe',
      classCodePlaceholder: 'Saisissez le code de classe',
      verificationLabel: 'Vérification',
      captchaQuestion: (a, b) =>
        `Résolvez : ${a} + ${b} = ?`,
      captchaPlaceholder: 'Réponse',
      newQuestionButton: 'Nouvelle question',
      emptyCodeError: 'Saisissez un code de classe.',
      incorrectCaptchaError: 'Réponse incorrecte.',
      joiningButton: 'Connexion...',
      joinButton: 'Rejoindre la classe',
    },

    create: {
      eyebrow: 'Créer une classe',
      title: 'Créer une nouvelle classe',
      subtitle:
        'Créez un espace pour votre classe, votre département ou votre groupe d’étude.',
      nameLabel: 'Nom de la classe',
      namePlaceholder: 'ex. MTH 102',
      descriptionLabel: 'Description',
      descriptionPlaceholder:
        'À quoi sert cette classe ?',
      visibilityLabel: 'Visibilité',
      visibilityPublicTitle: 'Publique',
      visibilityPublicSubtitle:
        'Toute personne disposant du code peut demander à rejoindre.',
      visibilityPrivateTitle: 'Privée',
      visibilityPrivateSubtitle:
        'Seules les personnes que vous approuvez peuvent rejoindre.',
      verificationLabel: 'Vérification',
      captchaQuestion: (a, b) =>
        `Résolvez : ${a} + ${b} = ?`,
      captchaPlaceholder: 'Réponse',
      newQuestionButton: 'Nouvelle question',
      emptyNameError: 'Saisissez un nom de classe.',
      incorrectCaptchaError: 'Réponse incorrecte.',
      creatingButton: 'Création...',
      createButton: 'Créer la classe',
      createdWithCode: (code) =>
        `Classe créée. Code : ${code}`,
      createdSuccess: 'Classe créée avec succès.',
    },

    toast: {
      joiningClass: 'Rejoindre la classe...',
      creatingClass: 'Création de la classe...',
      generatingCode:
        'Génération d’un nouveau code de classe...',
      unableToJoin: 'Impossible de rejoindre la classe.',
      unableToCreate: 'Impossible de créer la classe.',
      unableToRegenerate:
        'Impossible de régénérer le code de classe.',
      joinApproved: 'Demande d’adhésion approuvée.',
      joinRejected: 'Demande d’adhésion refusée.',
      unableToApproveJoin:
        'Impossible d’approuver la demande d’adhésion.',
      unableToRejectJoin:
        'Impossible de refuser la demande d’adhésion.',
      unableToCopyCode:
        'Impossible de copier le code de classe.',
      leftClass: 'Vous avez quitté la classe.',
      classDeleted: 'Classe supprimée.',
      memberRemoved: (name) =>
        `${name} a été supprimé.`,
      removalRequestSubmitted:
        'Demande de retrait envoyée.',
      removalApproved: 'Retrait approuvé.',
      removalRequestRejected:
        'Demande de retrait refusée.',
      nowAssistant: (name) =>
        `${name} est maintenant assistant.`,
      nowMember: (name) =>
        `${name} est maintenant membre.`,
      ownershipTransferred: 'Propriété transférée.',
      unableToTransfer:
        'Impossible de transférer la propriété.',
    },
  },

  settings: {
    header: {
      backButton: 'Profil',
    },

    eyebrow: 'Compte',
    title: 'Paramètres',
    subtitle:
      'Gérez vos préférences et les paramètres de vos classes.',

    theme: {
      sectionLabel: 'Apparence',
      sectionTitle: 'Thème',
      systemTitle: 'Système',
      systemSubtitle:
        'Suivre les paramètres de votre appareil',
      lightTitle: 'Clair',
      lightSubtitle: 'Toujours utiliser le mode clair',
      darkTitle: 'Sombre',
      darkSubtitle: 'Toujours utiliser le mode sombre',
    },

    language: {
      sectionLabel: 'Préférences',
      title: 'Langue',
      dropdownLabel: 'Langue d’affichage',
      hint:
        'L’interface s’affichera dans cette langue dans toute l’application.',
    },

    visibility: {
      sectionLabel: 'Gestion de la classe',
      title: 'Visibilité des classes',
      subtitle:
        'Contrôlez si les étudiants peuvent rejoindre vos classes immédiatement ou doivent obtenir une approbation.',
      applyAllTitle: 'Appliquer à toutes les classes',
      applyAllSubtitle:
        'Modifiez toutes vos classes en une seule fois.',
      applyAllPublicSubtitle:
        'Toute personne disposant du code peut rejoindre instantanément',
      applyAllPrivateSubtitle:
        'Les nouveaux membres doivent être approuvés avant de rejoindre',
      publicButton: 'Publique',
      privateButton: 'Privée',
      yourClassesLabel: 'Vos classes',
      classSingular: 'classe',
      classPlural: 'classes',
      emptyTitle: 'Aucune classe possédée.',
      emptySubtitle:
        'Les classes que vous créez apparaîtront ici.',
      joinCodeLabel: 'Code de classe ·',
      updatingButton: 'Mise à jour',
      makePrivateButton: 'Rendre privée',
      makePublicButton: 'Rendre publique',
      classPublicSubtitle:
        'Toute personne disposant du code peut rejoindre instantanément',
      classPrivateSubtitle:
        'Les nouveaux membres doivent être approuvés avant de rejoindre',
      alertGlobalEmpty:
        'Vous ne possédez aucune classe pour appliquer les paramètres de visibilité globaux.',
      alertGlobalConfirm: (visibility) =>
        `Voulez-vous vraiment modifier toutes vos classes pour les rendre ${visibility} ?`,
      alertGlobalSuccess: (visibility) =>
        `Succès : toutes vos classes sont maintenant ${visibility}.`,
      alertGlobalFailed: (message) =>
        `Échec de l’application de la visibilité globale : ${message}`,
      alertToggleFailed: (message) =>
        `Échec de la mise à jour de la visibilité : ${message}`,
    },

    danger: {
      sectionLabel: 'Compte',
      title: 'Zone dangereuse',
      deleteTitle: 'Supprimer votre compte',
      deleteSubtitle:
        'Supprimez définitivement votre compte, vos classes, vos adhésions, vos présences et les données associées.',
      deleteButton: 'Supprimer le compte',
    },

    deleteModal: {
      eyebrow: 'Action permanente',
      title: 'Supprimer le compte ?',
      subtitle:
        'Cette action est irréversible. Votre compte et les données associées seront définitivement supprimés.',
      passwordLabel: 'Confirmer avec le mot de passe',
      passwordPlaceholder:
        'Saisissez votre mot de passe',
      confirmLabel:
        'Je comprends que la suppression de mon compte est permanente et irréversible.',
      cancelButton: 'Annuler',
      deleteButton: 'Supprimer définitivement',
      deletingButton: 'Suppression',
      errorPasswordRequired:
        'Veuillez saisir votre mot de passe pour autoriser cette action.',
      errorConfirmRequired:
        'Vous devez cocher la case de confirmation pour continuer.',
      errorPasswordIncorrect:
        'La vérification du mot de passe a échoué. Veuillez saisir votre mot de passe actuel correct.',
      errorProfileDelete:
        'Impossible de supprimer le profil. Veuillez contacter le support.',
      errorAuthDelete:
        'Impossible de supprimer le compte d’authentification. Veuillez contacter le support.',
      errorGeneric:
        'Une erreur inattendue est survenue lors de la suppression du compte.',
    },

    footer: {
      title: 'Paramètres',
      subtitle: 'Gérez votre compte et vos préférences.',
    },
  },
};

export default FR;