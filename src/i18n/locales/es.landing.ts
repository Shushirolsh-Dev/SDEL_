import type { LandingStrings } from '../types.landing';

export const meta = {
  code: 'es',
  nativeName: 'Español',
};

const ES: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'Iniciar sesión',
    joinFree: 'Únete gratis',
    backToLogin: 'Volver a iniciar sesión',
    backToHome: 'Volver al inicio',
  },

  hero: {
    badge: 'Horario escolar en tiempo real',
    replacesLabel: 'Reemplaza',
    headlinePrefix: 'Tu día escolar,',
    headlineSuffix: 'por fin en un solo lugar.',
    subtitle:
      'Organiza tus clases, asistencia y actualizaciones de clase en un solo lugar.',
    ctaPrimary: 'Empezar gratis',
    ctaSecondary: 'Iniciar sesión',
    replacesWords: [
      'horarios en papel',
      'horarios dispersos en chats',
      'clases olvidadas',
      'notas desorganizadas',
    ],
  },

  features: {
    sectionLabel: 'CÓMO FUNCIONA',
    sectionTitle: 'Todo lo que necesitas para mantenerte al día.',
    step1Title: 'Crea tu horario',
    step1Body:
      'Añade tus clases y organiza tu horario académico en un solo lugar.',
    step2Title: 'Únete a tus clases',
    step2Body:
      'Conecta con tus compañeros y recibe actualizaciones de tus clases.',
    step3Title: 'Mantente al día',
    step3Body:
      'Consulta tu horario, asistencia y actualizaciones cuando las necesites.',
  },

  footer: {
    builtBy: 'Creado por',
    terms: 'Términos',
    privacy: 'Privacidad',
    about: 'Acerca de',
    linksTagline: 'Todo lo que necesitas para tu vida académica.',
    brandMark: 'THESDEL',
    descriptor: 'The Student Digital Exchange Layer',
  },

  login: {
    topMarker: 'INICIAR SESIÓN',
    title: 'Bienvenido de nuevo.',
    subtitle: 'Inicia sesión para continuar con THESDEL.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Introduce tu correo electrónico',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Introduce tu contraseña',
    forgotLink: '¿Olvidaste tu contraseña?',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    submitIdle: 'Iniciar sesión',
    submitLoading: 'Iniciando sesión...',
    newTo: '¿Nuevo en THESDEL?',
    createAccount: 'Crear una cuenta',
    footnote: 'Al continuar, aceptas nuestros términos y políticas.',
    emptyFieldsError: 'Introduce tu correo electrónico y contraseña.',
    fallbackProfileError:
      'No se pudo cargar tu perfil. Inténtalo de nuevo.',
    genericError:
      'No se pudo iniciar sesión. Comprueba tus datos e inténtalo de nuevo.',
    close: 'Cerrar',
  },

  forgot: {
    topMarker: 'RECUPERAR CONTRASEÑA',
    title: '¿Olvidaste tu contraseña?',
    subtitle:
      'Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Introduce tu correo electrónico',
    submitIdle: 'Enviar enlace',
    submitLoading: 'Enviando...',
    backToSignIn: 'Volver a iniciar sesión',
    successTitle: 'Revisa tu correo.',
    successBodyPrefix: 'Enviamos un enlace de recuperación a',
    successBodySuffix: '.',
    returnToSignIn: 'Volver a iniciar sesión',
    footnote: 'Si no recibes el correo, revisa tu carpeta de spam.',
    emptyEmailError: 'Introduce tu correo electrónico.',
    genericError:
      'No se pudo enviar el enlace. Inténtalo de nuevo.',
    close: 'Cerrar',
  },

  signup: {
    topMarker: 'CREAR CUENTA',
    title: 'Crea tu cuenta.',
    subtitle:
      'Únete a THESDEL y mantén tu vida académica organizada.',
    sectionIdentity: 'IDENTIDAD',
    sectionContact: 'CONTACTO',
    sectionRole: 'ROL',
    sectionSecurity: 'SEGURIDAD',

    nameLabel: 'Nombre completo',
    namePlaceholder: 'Introduce tu nombre completo',

    usernameLabel: 'Nombre de usuario',
    usernamePlaceholder: 'Elige un nombre de usuario',
    usernameChecking: 'Comprobando disponibilidad...',
    usernameAvailable: 'Nombre de usuario disponible',
    usernameUnavailable: 'Ese nombre de usuario ya está en uso',
    usernameHint:
      'Usa entre 3 y 20 caracteres, con letras, números o guiones bajos.',

    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Introduce tu correo electrónico',

    phoneLabel: 'Número de teléfono',
    phonePlaceholder: 'Introduce tu número de teléfono',
    phoneHint: 'Usa un número de teléfono válido.',
    phoneChecking: 'Comprobando disponibilidad...',
    phoneAvailable: 'Número disponible',
    phoneUnavailable: 'Ese número ya está en uso',

    roleQuestion: '¿Cuál es tu rol?',
    roleStudentTitle: 'Estudiante',
    roleStudentBody:
      'Únete a clases, consulta tu horario y mantente al día.',
    roleRepTitle: 'Representante de clase',
    roleRepBody:
      'Gestiona tu clase y comparte actualizaciones con tus compañeros.',

    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Crea una contraseña',
    passwordHint: 'Usa una contraseña segura que puedas recordar.',
    passwordProtected: 'Tu contraseña está protegida.',

    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',

    termsPrefix: 'Al crear una cuenta, aceptas nuestros',
    termsOfService: 'Términos de servicio',
    termsConjunction: 'y',
    privacyPolicy: 'Política de privacidad',
    termsSuffix: '.',

    submitIdle: 'Crear cuenta',
    submitLoading: 'Creando cuenta...',

    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar sesión',

    footnote: 'Tu información se mantiene segura y protegida.',

    errorAllRequired: 'Completa todos los campos obligatorios.',
    errorUsernameFormat: 'El nombre de usuario no tiene un formato válido.',
    errorUsernameTaken: 'Ese nombre de usuario ya está en uso.',
    errorPhoneInvalid: 'Introduce un número de teléfono válido.',
    errorPhoneTaken: 'Ese número de teléfono ya está en uso.',
    errorTermsRequired:
      'Debes aceptar los términos y la política de privacidad.',
    errorEmailRegistered:
      'Ya existe una cuenta con este correo electrónico.',
    errorProfileCreate:
      'No se pudo crear tu perfil. Inténtalo de nuevo.',
    errorDuplicate:
      'Ya existe una cuenta con alguno de estos datos.',
    errorGenericRegistration:
      'No se pudo crear la cuenta. Inténtalo de nuevo.',

    captchaLabel: 'Verificación',
    captchaQuestion: (a: number, b: number) => `¿Cuánto es ${a} + ${b}?`,
    captchaPlaceholder: 'Escribe la respuesta',
    captchaNewQuestion: 'Nueva pregunta',
    errorCaptchaRequired: 'Completa la verificación.',
    errorCaptchaIncorrect: 'Respuesta incorrecta.',
    errorRateLimited:
      'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  },

  legal: {
    terms: {
      eyebrow: 'TÉRMINOS',
      title: 'Términos de servicio',
      description:
        'Las reglas que rigen el uso de THESDEL.',
      footerLabel: 'Términos de servicio',
      buttonLabel: 'Volver',
      effectiveDateLabel: 'Fecha de entrada en vigor',
      effectiveDate: '13 de septiembre de 2026',
      sections: [
        {
          number: '01',
          title: 'Aceptación de los términos',
          body:
            'Al utilizar THESDEL, aceptas cumplir estos términos y todas las leyes aplicables.',
        },
        {
          number: '02',
          title: 'Uso del servicio',
          body:
            'Debes utilizar THESDEL de forma responsable y no intentar interferir con el funcionamiento del servicio.',
        },
        {
          number: '03',
          title: 'Tu cuenta',
          body:
            'Eres responsable de mantener la seguridad de tus credenciales y de toda actividad realizada desde tu cuenta.',
        },
        {
          number: '04',
          title: 'Contenido',
          body:
            'Eres responsable del contenido que publiques o compartas mediante THESDEL.',
        },
        {
          number: '05',
          title: 'Cambios',
          body:
            'Podemos actualizar estos términos cuando sea necesario. Los cambios importantes se comunicarán de forma adecuada.',
        },
      ],
    },

    privacy: {
      eyebrow: 'PRIVACIDAD',
      title: 'Política de privacidad',
      description:
        'Cómo recopilamos, utilizamos y protegemos tu información.',
      footerLabel: 'Política de privacidad',
      buttonLabel: 'Volver',
      effectiveDateLabel: 'Fecha de entrada en vigor',
      effectiveDate: '13 de septiembre de 2026',
      sections: [
        {
          number: '01',
          title: 'Información que recopilamos',
          body:
            'Recopilamos la información necesaria para crear tu cuenta y proporcionar las funciones de THESDEL.',
        },
        {
          number: '02',
          title: 'Cómo utilizamos la información',
          body:
            'Utilizamos tu información para proporcionar, mantener y mejorar THESDEL.',
        },
        {
          number: '03',
          title: 'Protección de datos',
          body:
            'Tomamos medidas razonables para proteger tu información contra accesos o usos no autorizados.',
        },
        {
          number: '04',
          title: 'Tus opciones',
          body:
            'Puedes gestionar determinada información de tu cuenta desde la configuración de THESDEL.',
        },
        {
          number: '05',
          title: 'Actualizaciones',
          body:
            'Podemos actualizar esta política cuando nuestras prácticas o servicios cambien.',
        },
      ],
    },

    about: {
      eyebrow: 'ACERCA DE',
      title: 'Acerca de THESDEL',
      description:
        'Una capa digital creada para hacer más sencilla la vida estudiantil.',
      footerLabel: 'Acerca de',
      buttonLabel: 'Volver',
      sections: [
        {
          number: '01',
          title: 'Nuestra idea',
          body:
            'THESDEL conecta a los estudiantes con sus clases, horarios y comunidades en un solo lugar.',
        },
        {
          number: '02',
          title: 'Nuestra misión',
          body:
            'Hacer que la vida académica sea más organizada, accesible y conectada.',
        },
        {
          number: '03',
          title: 'Construyendo para estudiantes',
          body:
            'THESDEL está diseñado pensando primero en las necesidades reales de los estudiantes.',
        },
      ],
    },
  },
};

export default ES;