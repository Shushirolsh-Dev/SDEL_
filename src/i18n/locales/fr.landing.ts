import type { LandingStrings } from '../types.landing';

export const meta = {
  code: 'fr',
  nativeName: 'Français',
};

const FR_LANDING: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'Se connecter',
    joinFree: 'Créer un compte',
    backToLogin: '← Retour à la connexion',
    backToHome: '← Retour à l’accueil',
  },

  hero: {
    badge: 'Emplois du temps scolaires en temps réel',
    headlinePrefix: 'Votre journée scolaire,',
    headlineSuffix: 'enfin au même endroit.',
    subtitle:
      'THESDEL est une couche de gestion des emplois du temps et des présences en temps réel, conçue pour les écoles. Repérez les changements de salle, suivez les annulations et protégez votre assiduité — sans le bruit des discussions de groupe.',
    ctaPrimary: 'Créer un compte',
    ctaSecondary: 'Se connecter',
    replacesWords: ['WhatsApp', 'Telegram', 'Discord'],
  },

  features: {
    sectionLabel: 'Comment ça marche',
    sectionTitle: 'Conçu autour de votre journée scolaire.',
    step1Title: 'Emploi du temps centralisé',
    step1Body:
      'Les représentants publient les cours, les dates et les horaires actifs. Plus besoin de parcourir l’historique des discussions à la recherche de PDF.',
    step2Title: 'Alertes de salle instantanées',
    step2Body:
      'Votre cours a changé de salle ou a été annulé ? Les alertes en direct vous préviennent avant le début du cours et vous évitent des déplacements inutiles.',
    step3Title: 'Protection des séries',
    step3Body:
      'Suivez vos présences quotidiennes et vos cours. Protégez automatiquement votre dossier de présence grâce à une vérification intégrée.',
  },

  footer: {
    builtBy: 'Créé par Litheral',
    terms: 'Conditions d’utilisation',
    privacy: 'Politique de confidentialité',
    about: 'À propos',
    linksTagline: 'Votre emploi du temps scolaire, organisé.',
    brandMark: 'THESDEL',
    descriptor: 'Student Digital Exchange Layer',
  },

  login: {
    topMarker: 'THESDEL / ACCÈS',
    title: 'Bon retour.',
    subtitle:
      'Connectez-vous pour accéder à votre espace scolaire, votre emploi du temps et vos classes.',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    forgotLink: 'Oublié ?',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    submitIdle: 'Continuer',
    submitLoading: 'Connexion',
    newTo: 'Nouveau sur THESDEL ?',
    createAccount: 'Créer un compte',
    footnote: 'Student Digital Exchange Layer',
    emptyFieldsError:
      'Veuillez saisir votre adresse e-mail et votre mot de passe.',
    fallbackProfileError:
      'Impossible de charger votre profil. Veuillez contacter le support.',
    genericError:
      'Une erreur est survenue lors de la connexion.',
    close: 'Fermer',
  },

  forgot: {
    topMarker: 'THESDEL / RÉCUPÉRATION',
    title: 'Réinitialisez votre mot de passe.',
    subtitle:
      'Saisissez l’adresse e-mail associée à votre compte et nous vous enverrons un lien sécurisé de réinitialisation.',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    submitIdle: 'Envoyer le lien',
    submitLoading: 'Envoi',
    backToSignIn: 'Retour à la connexion',
    successTitle: 'Lien de réinitialisation envoyé',
    successBodyPrefix: 'Consultez',
    successBodySuffix:
      'pour obtenir les instructions permettant de créer un nouveau mot de passe.',
    returnToSignIn: 'Retour à la connexion',
    footnote: 'Récupération sécurisée du compte',
    emptyEmailError:
      'Veuillez saisir votre adresse e-mail.',
    genericError:
      'Une erreur est survenue lors de la demande de réinitialisation du mot de passe.',
    close: 'Fermer',
  },

  signup: {
    topMarker: 'THESDEL / CRÉER UN COMPTE',
    title: 'Créez votre compte.',
    subtitle:
      'Configurez votre profil THESDEL et rejoignez votre communauté scolaire.',
    sectionIdentity: '01 / Identité',
    sectionContact: '02 / Contact',
    sectionRole: '03 / Rôle',
    sectionSecurity: '04 / Sécurité',
    nameLabel: 'Nom complet',
    namePlaceholder: 'Votre nom complet',
    usernameLabel: 'Nom d’utilisateur',
    usernamePlaceholder: 'choisir_un_nom',
    usernameChecking: 'Vérification de la disponibilité...',
    usernameAvailable: 'Nom d’utilisateur disponible',
    usernameUnavailable: 'Nom d’utilisateur indisponible',
    usernameHint: '3–20 caractères',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: 'Numéro de téléphone',
    phoneHint:
      'Utilisé pour les communications liées au compte et les rappels lorsqu’ils sont activés.',
    phoneChecking:
      'Vérification du numéro de téléphone...',
    phoneAvailable: 'Numéro de téléphone disponible',
    phoneUnavailable:
      'Numéro de téléphone déjà utilisé',
    roleQuestion: 'Comment allez-vous utiliser THESDEL ?',
    roleStudentTitle: 'Étudiant',
    roleStudentBody:
      'Rejoignez des classes et gérez votre emploi du temps scolaire.',
    roleRepTitle: 'Représentant',
    roleRepBody:
      'Créez et gérez les emplois du temps de votre classe.',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Créez un mot de passe',
    passwordHint: 'Minimum 6 caractères',
    passwordProtected: 'Protégé',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    termsPrefix: 'J’accepte les',
    termsOfService: 'Conditions d’utilisation',
    termsConjunction: 'et la',
    privacyPolicy: 'Politique de confidentialité',
    termsSuffix: '.',
    submitIdle: 'Créer le compte',
    submitLoading: 'Création du compte',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    footnote: 'Student Digital Exchange Layer',
    errorAllRequired:
      'Tous les champs sont obligatoires.',
    errorUsernameFormat:
      'Le nom d’utilisateur doit contenir 3 à 20 caractères (lettres, chiffres et underscore uniquement).',
    errorUsernameTaken:
      'Ce nom d’utilisateur est déjà pris. Veuillez en choisir un autre.',
    errorPhoneInvalid:
      'Veuillez saisir un numéro de téléphone valide.',
    errorPhoneTaken:
      'Ce numéro de téléphone est déjà enregistré. Veuillez en utiliser un autre.',
    errorTermsRequired:
      'Vous devez accepter les Conditions d’utilisation et la Politique de confidentialité.',
    errorEmailRegistered:
      'Cette adresse e-mail est déjà enregistrée. Connectez-vous ou utilisez une autre adresse.',
    errorProfileCreate:
      'Impossible de créer le profil. Veuillez réessayer.',
    errorDuplicate:
      'Le nom d’utilisateur ou l’adresse e-mail est déjà utilisé. Veuillez réessayer.',
    errorGenericRegistration:
      'Une erreur est survenue lors de l’inscription.',
    captchaLabel: 'Vérification',
    captchaQuestion: (a, b) =>
      `Résolvez : ${a} + ${b} = ?`,
    captchaPlaceholder: 'Réponse',
    captchaNewQuestion: 'Nouvelle question',
    errorCaptchaRequired:
      'Veuillez répondre à la question de vérification.',
    errorCaptchaIncorrect:
      'Réponse incorrecte. Veuillez réessayer.',
    errorRateLimited:
      'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.',
  },

  legal: {
    terms: {
      eyebrow: 'Conditions d’utilisation',
      title: 'Comment fonctionne THESDEL.',
      description:
        'Ces conditions expliquent les règles d’utilisation de THESDEL, de gestion des espaces scolaires et d’interaction avec les services que nous proposons.',
      footerLabel: 'THESDEL / CONDITIONS',
      buttonLabel: 'Retour au compte',
      effectiveDateLabel: 'Date d’entrée en vigueur',
      effectiveDate: '13 juillet 2026',
      sections: [
        {
          number: '01',
          title: 'Acceptation des conditions',
          body:
            'En créant un compte ou en utilisant THESDEL, vous acceptez les présentes Conditions d’utilisation. Si vous n’êtes pas d’accord, veuillez ne pas utiliser la plateforme.',
        },
        {
          number: '02',
          title: 'Votre compte',
          body:
            'Vous êtes responsable de l’exactitude des informations de votre compte et de la protection de vos identifiants de connexion. Les comptes doivent être utilisés par la personne pour laquelle ils ont été créés et ne doivent pas servir à usurper l’identité d’une autre personne ou organisation.',
        },
        {
          number: '03',
          title: 'Espaces scolaires et représentants',
          body:
            'THESDEL peut permettre aux étudiants et aux représentants autorisés de créer et de gérer des espaces scolaires. Les représentants peuvent disposer de permissions supplémentaires, notamment pour gérer les emplois du temps, les membres, les annonces ou d’autres informations partagées au sein de leur espace.',
        },
        {
          number: '04',
          title: 'Emplois du temps et informations partagées',
          body:
            'THESDEL aide à organiser les emplois du temps et les informations scolaires, mais ne constitue pas la source officielle de référence de votre établissement. Vérifiez toujours les dates, salles, évaluations et autres informations importantes auprès de l’autorité scolaire compétente.',
        },
        {
          number: '05',
          title: 'Notifications et services externes',
          body:
            'Certaines fonctionnalités de THESDEL peuvent utiliser des services externes pour envoyer des notifications ou fournir d’autres fonctionnalités. Leur disponibilité peut dépendre de ces services, des conditions réseau, des paramètres de l’appareil et des réglementations applicables.',
        },
        {
          number: '06',
          title: 'Utilisation acceptable',
          body:
            'Vous acceptez de ne pas utiliser THESDEL de manière abusive, de ne pas perturber son fonctionnement, de ne pas tenter d’obtenir un accès non autorisé, de ne pas diffuser de contenu nuisible et de ne pas utiliser la plateforme pour des activités illégales.',
        },
        {
          number: '07',
          title: 'Disponibilité et responsabilité',
          body:
            'THESDEL est fourni « en l’état » et selon sa disponibilité. Nous nous efforçons de maintenir une plateforme fiable, mais une disponibilité ininterrompue ne peut être garantie. Les utilisateurs restent responsables de prendre en compte les informations et échéances scolaires importantes.',
        },
        {
          number: '08',
          title: 'Propriété intellectuelle',
          body:
            'THESDEL, y compris sa marque, son interface, ses logiciels et ses contenus originaux, appartient à THESDEL ou à leurs détenteurs de droits respectifs. Vous ne pouvez pas copier, modifier, distribuer ou exploiter commercialement les éléments protégés de la plateforme sans autorisation.',
        },
        {
          number: '09',
          title: 'Modifications des conditions',
          body:
            'Nous pouvons mettre à jour ces conditions à mesure que THESDEL évolue. Lorsque des modifications importantes sont apportées, la version mise à jour sera publiée sur la plateforme. La poursuite de l’utilisation de THESDEL après une mise à jour signifie que vous acceptez les conditions révisées.',
        },
      ],
    },

    privacy: {
      eyebrow: 'Politique de confidentialité',
      title: 'Vos informations comptent.',
      description:
        'Cette politique explique quelles informations THESDEL collecte, pourquoi nous les utilisons et quels choix s’offrent à vous.',
      footerLabel: 'THESDEL / CONFIDENTIALITÉ',
      buttonLabel: 'Retour au compte',
      effectiveDateLabel: 'Date d’entrée en vigueur',
      effectiveDate: '13 juillet 2026',
      sections: [
        {
          number: '01',
          title: 'Informations que nous collectons',
          body:
            'Lorsque vous créez un compte, nous pouvons collecter des informations telles que votre nom, votre nom d’utilisateur, votre adresse e-mail, votre numéro de téléphone, votre rôle et d’autres informations que vous choisissez de fournir.',
        },
        {
          number: '02',
          title: 'Comment nous utilisons vos informations',
          body:
            'Nous utilisons les informations du compte pour fournir les fonctionnalités de THESDEL, gérer les espaces scolaires, authentifier les utilisateurs, communiquer avec vous, assurer la sécurité des comptes et améliorer la fiabilité de la plateforme.',
        },
        {
          number: '03',
          title: 'Données scolaires et données partagées',
          body:
            'Les informations telles que les emplois du temps, les détails des classes, les annonces et autres contenus partagés peuvent être visibles par les membres de l’espace scolaire concerné, selon les autorisations associées à cet espace.',
        },
        {
          number: '04',
          title: 'Sécurité',
          body:
            'Nous utilisons des mesures techniques et organisationnelles raisonnables pour protéger les informations stockées et traitées via THESDEL. Aucun service en ligne ne peut garantir une sécurité absolue ; les utilisateurs doivent donc également protéger leurs mots de passe et l’accès à leur compte.',
        },
        {
          number: '05',
          title: 'Cookies et stockage local',
          body:
            'THESDEL peut utiliser des cookies, le stockage local et des technologies similaires pour maintenir les sessions, mémoriser les préférences et assurer les fonctionnalités essentielles. Ces technologies permettent à l’application de fonctionner de manière cohérente entre les sessions.',
        },
        {
          number: '06',
          title: 'Services tiers',
          body:
            'THESDEL peut s’appuyer sur des prestataires de confiance pour l’infrastructure, l’authentification, la messagerie, l’analyse ou d’autres fonctions techniques. Ces prestataires peuvent traiter les informations uniquement dans la mesure nécessaire à la fourniture de leurs services.',
        },
        {
          number: '07',
          title: 'Vos choix',
          body:
            'Selon la fonctionnalité concernée et la législation applicable, vous pouvez être en mesure d’accéder aux informations associées à votre compte, de les corriger, de les mettre à jour ou d’en demander la suppression.',
        },
        {
          number: '08',
          title: 'Mises à jour de la politique',
          body:
            'À mesure que THESDEL évolue, cette politique peut être modifiée. Les versions mises à jour seront publiées sur la plateforme avec une nouvelle date d’entrée en vigueur.',
        },
      ],
    },

    about: {
      eyebrow: 'À propos de THESDEL',
      title: 'Conçu pour la vie scolaire.',
      description:
        'THESDEL est une couche numérique conçue pour rendre la coordination scolaire quotidienne plus simple, plus claire et plus facile à gérer.',
      footerLabel: 'THESDEL / À PROPOS',
      buttonLabel: 'Retour à THESDEL',
      sections: [
        {
          number: '01',
          title: 'L’idée',
          body:
            'La vie scolaire ne se résume pas aux cours. Les étudiants passent entre emplois du temps, personnes, annonces, échéances, ressources et tâches de coordination quotidiennes. THESDEL rassemble ces éléments dans un environnement connecté.',
        },
        {
          number: '02',
          title: 'Un seul endroit pour la journée scolaire',
          body:
            'THESDEL est conçu autour de la manière dont les étudiants vivent réellement leur journée. Emplois du temps, classes, annonces, activités d’étude, ressources partagées et autres outils scolaires peuvent coexister au même endroit au lieu d’être dispersés sur différentes plateformes.',
        },
        {
          number: '03',
          title: 'Conçu autour des communautés',
          body:
            'Les établissements scolaires sont des communautés, pas seulement des ensembles d’utilisateurs individuels. THESDEL offre aux groupes un espace partagé où les membres peuvent rester coordonnés, tandis que les représentants autorisés peuvent contribuer à organiser les informations.',
        },
        {
          number: '04',
          title: 'Conçu pour les conditions réelles',
          body:
            'Les environnements scolaires peuvent être confrontés à une connectivité irrégulière, à des changements d’emploi du temps et à un grand nombre d’utilisateurs. THESDEL est conçu en privilégiant la fiabilité, la clarté et un accès efficace.',
        },
        {
          number: '05',
          title: 'Notre approche',
          body:
            'Nous pensons que la technologie scolaire doit réduire les frictions plutôt que d’en créer davantage. L’expérience doit donc rester ciblée, utile et respectueuse des personnes qui en dépendent chaque jour.',
        },
      ],
    },
  },
};

export default FR_LANDING;