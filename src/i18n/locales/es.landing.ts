import type { LandingStrings } from '../types.landing';

export const meta = {
  code: 'es',
  nativeName: 'Español',
};

const ES_LANDING: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'Iniciar sesión',
    joinFree: 'Únete gratis',
    backToLogin: '← Volver al inicio de sesión',
    backToHome: '← Volver al inicio',
  },
  hero: {
    badge: 'Horarios escolares en tiempo real',
    headlinePrefix: 'Tu día escolar,',
    headlineSuffix: 'por fin en un solo lugar.',
    subtitle:
      'Thesdel es una capa de horarios y asistencia en tiempo real creada para escuelas. Detecta cambios de aula, sigue las cancelaciones y protege tu registro de asistencia, sin el ruido de los chats grupales.',
    ctaPrimary: 'Crear cuenta',
    ctaSecondary: 'Iniciar sesión',
    replacesWords: ['WhatsApp', 'Telegram', 'Discord'],
  },
  features: {
    sectionLabel: 'Cómo funciona',
    sectionTitle: 'Diseñado alrededor de tu día escolar.',
    step1Title: 'Horario centralizado',
    step1Body:
      'Los representantes publican las materias activas, fechas y horarios. Ya no tendrás que revisar el historial de chats fijados en busca de PDFs.',
    step2Title: 'Alertas instantáneas de aula',
    step2Body:
      '¿Tu clase cambió de aula o fue cancelada? Las alertas en tiempo real te avisan antes de que comience la sesión, evitando viajes innecesarios.',
    step3Title: 'Protección de rachas',
    step3Body:
      'Registra tus actividades diarias y el número de clases. Protege automáticamente tu registro de asistencia, con verificación integrada.',
  },
  footer: {
    builtBy: 'Creado por Litheral',
    terms: 'Términos de servicio',
    privacy: 'Política de privacidad',
    about: 'Acerca de',
    linksTagline: 'Tu horario escolar, organizado.',
    brandMark: 'THESDEL',
    descriptor: 'Capa de Intercambio Digital para Estudiantes',
  },
  login: {
    topMarker: 'THESDEL / ACCESO',
    title: 'Bienvenido de nuevo.',
    subtitle:
      'Inicia sesión para continuar con tu espacio escolar, horario y clases.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Introduce tu contraseña',
    forgotLink: '¿Olvidaste?',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    submitIdle: 'Continuar',
    submitLoading: 'Iniciando sesión',
    newTo: '¿Nuevo en THESDEL?',
    createAccount: 'Crear una cuenta',
    footnote: 'Capa de Intercambio Digital para Estudiantes',
    emptyFieldsError:
      'Introduce tu correo electrónico y contraseña.',
    fallbackProfileError:
      'No se pudo cargar tu perfil. Ponte en contacto con soporte.',
    genericError: 'Se produjo un error al iniciar sesión.',
    close: 'Cerrar',
  },
  forgot: {
    topMarker: 'THESDEL / RECUPERACIÓN',
    title: 'Restablece tu contraseña.',
    subtitle:
      'Introduce el correo electrónico asociado a tu cuenta y te enviaremos un enlace seguro para restablecerla.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'you@example.com',
    submitIdle: 'Enviar enlace',
    submitLoading: 'Enviando',
    backToSignIn: 'Volver a iniciar sesión',
    successTitle: 'Enlace de restablecimiento enviado',
    successBodyPrefix: 'Revisa',
    successBodySuffix:
      'para obtener instrucciones para crear una nueva contraseña.',
    returnToSignIn: 'Volver a iniciar sesión',
    footnote: 'Recuperación segura de la cuenta',
    emptyEmailError: 'Introduce tu correo electrónico.',
    genericError:
      'Se produjo un error al solicitar el restablecimiento de contraseña.',
    close: 'Cerrar',
  },
  signup: {
    topMarker: 'THESDEL / CREAR CUENTA',
    title: 'Crea tu cuenta.',
    subtitle:
      'Configura tu perfil de THESDEL y únete a tu comunidad escolar.',
    sectionIdentity: '01 / Identidad',
    sectionContact: '02 / Contacto',
    sectionRole: '03 / Rol',
    sectionSecurity: '04 / Seguridad',
    nameLabel: 'Nombre completo',
    namePlaceholder: 'Tu nombre completo',
    usernameLabel: 'Nombre de usuario',
    usernamePlaceholder: 'elige_un_nombre_de_usuario',
    usernameChecking: 'Comprobando disponibilidad...',
    usernameAvailable: 'Nombre de usuario disponible',
    usernameUnavailable: 'Nombre de usuario no disponible',
    usernameHint: '3–20 caracteres',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'you@example.com',
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: 'Número de teléfono',
    phoneHint:
      'Se utiliza para comunicaciones relacionadas con la cuenta y recordatorios cuando estén habilitados.',
    phoneChecking: 'Comprobando número de teléfono...',
    phoneAvailable: 'Número de teléfono disponible',
    phoneUnavailable: 'El número de teléfono ya está en uso',
    roleQuestion: '¿Cómo utilizarás THESDEL?',
    roleStudentTitle: 'Estudiante',
    roleStudentBody:
      'Únete a clases y gestiona tu horario escolar.',
    roleRepTitle: 'Representante',
    roleRepBody:
      'Crea y gestiona los horarios de tu clase.',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Crea una contraseña',
    passwordHint: 'Mínimo 6 caracteres',
    passwordProtected: 'Protegida',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    termsPrefix: 'Acepto los',
    termsOfService: 'Términos de servicio',
    termsConjunction: 'y la',
    privacyPolicy: 'Política de privacidad',
    termsSuffix: '.',
    submitIdle: 'Crear cuenta',
    submitLoading: 'Creando cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar sesión',
    footnote: 'Capa de Intercambio Digital para Estudiantes',
    errorAllRequired: 'Todos los campos son obligatorios.',
    errorUsernameFormat:
      'El nombre de usuario debe tener entre 3 y 20 caracteres (solo letras, números y guiones bajos).',
    errorUsernameTaken:
      'El nombre de usuario ya está en uso. Elige otro.',
    errorPhoneInvalid:
      'Introduce un número de teléfono válido.',
    errorPhoneTaken:
      'Este número de teléfono ya está registrado. Utiliza otro.',
    errorTermsRequired:
      'Debes aceptar los Términos de servicio y la Política de privacidad.',
    errorEmailRegistered:
      'Este correo electrónico ya está registrado. Inicia sesión o utiliza otro correo.',
    errorProfileCreate:
      'No se pudo crear el perfil. Inténtalo de nuevo.',
    errorDuplicate:
      'El nombre de usuario o el correo electrónico ya están en uso. Inténtalo de nuevo.',
    errorGenericRegistration:
      'Se produjo un error durante el registro.',
    captchaLabel: 'Verificación',
    captchaQuestion: (a, b) => `Resuelve: ${a} + ${b} = ?`,
    captchaPlaceholder: 'Respuesta',
    captchaNewQuestion: 'Nueva pregunta',
    errorCaptchaRequired:
      'Responde a la pregunta de verificación.',
    errorCaptchaIncorrect:
      'Respuesta incorrecta. Inténtalo de nuevo.',
    errorRateLimited:
      'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.',
  },
  legal: {
    terms: {
      eyebrow: 'Términos de servicio',
      title: 'Cómo funciona THESDEL.',
      description:
        'Estos términos explican las reglas para utilizar THESDEL, gestionar espacios escolares e interactuar con los servicios que ofrecemos.',
      footerLabel: 'THESDEL / TÉRMINOS',
      buttonLabel: 'Volver a la cuenta',
      effectiveDateLabel: 'Fecha de entrada en vigor',
      effectiveDate: '13 de julio de 2026',
      sections: [
        {
          number: '01',
          title: 'Aceptación de estos términos',
          body: 'Al crear una cuenta o utilizar THESDEL, aceptas estos Términos de servicio. Si no estás de acuerdo con ellos, no utilices la plataforma.',
        },
        {
          number: '02',
          title: 'Tu cuenta',
          body: 'Eres responsable de mantener actualizada la información de tu cuenta y de proteger tus credenciales de acceso. Las cuentas deben ser utilizadas por la persona para la que fueron creadas y no deben utilizarse para hacerse pasar por otra persona u organización.',
        },
        {
          number: '03',
          title: 'Espacios escolares y representantes',
          body: 'THESDEL puede permitir que estudiantes y representantes autorizados creen y gestionen espacios escolares. Los representantes pueden tener permisos adicionales, incluida la gestión de horarios, miembros, anuncios u otra información compartida dentro de su espacio asignado.',
        },
        {
          number: '04',
          title: 'Horarios e información compartida',
          body: 'THESDEL ayuda a organizar horarios e información escolar, pero no constituye la fuente oficial de información de tu escuela. Verifica siempre las fechas importantes, aulas, evaluaciones y demás información oficial con la autoridad escolar correspondiente.',
        },
        {
          number: '05',
          title: 'Notificaciones y servicios externos',
          body: 'Algunas funciones de THESDEL pueden utilizar servicios externos para enviar notificaciones u ofrecer otras funcionalidades. La disponibilidad puede depender de dichos servicios, las condiciones de la red, la configuración del dispositivo y las normativas aplicables.',
        },
        {
          number: '06',
          title: 'Uso aceptable',
          body: 'Aceptas no hacer un uso indebido de THESDEL, interferir con su funcionamiento, intentar obtener acceso no autorizado, distribuir contenido dañino ni utilizar la plataforma para actividades ilegales.',
        },
        {
          number: '07',
          title: 'Disponibilidad y responsabilidad',
          body: 'THESDEL se proporciona “tal como está disponible”. Trabajamos para mantener la plataforma fiable, pero no podemos garantizar una disponibilidad ininterrumpida. Los usuarios siguen siendo responsables de actuar sobre información escolar importante y fechas límite.',
        },
        {
          number: '08',
          title: 'Propiedad intelectual',
          body: 'THESDEL, incluida su marca, interfaz, software y contenido original, pertenece a THESDEL o a sus respectivos titulares de derechos. No puedes copiar, modificar, distribuir ni explotar comercialmente las partes protegidas de la plataforma sin permiso.',
        },
        {
          number: '09',
          title: 'Cambios en estos términos',
          body: 'Podemos actualizar estos términos a medida que THESDEL evolucione. Cuando se realicen cambios importantes, la versión actualizada se publicará a través de la plataforma. El uso continuado de THESDEL después de una actualización significa que aceptas los términos revisados.',
        },
      ],
    },
    privacy: {
      eyebrow: 'Política de privacidad',
      title: 'Tu información importa.',
      description:
        'Esta política explica qué información recopila THESDEL, por qué la utilizamos y qué opciones tienes disponibles.',
      footerLabel: 'THESDEL / PRIVACIDAD',
      buttonLabel: 'Volver a la cuenta',
      effectiveDateLabel: 'Fecha de entrada en vigor',
      effectiveDate: '13 de julio de 2026',
      sections: [
        {
          number: '01',
          title: 'Información que recopilamos',
          body: 'Cuando creas una cuenta, podemos recopilar información como tu nombre, nombre de usuario, correo electrónico, número de teléfono, rol de cuenta y otra información que decidas proporcionar.',
        },
        {
          number: '02',
          title: 'Cómo utilizamos tu información',
          body: 'Utilizamos la información de la cuenta para proporcionar las funciones de THESDEL, gestionar espacios escolares, autenticar usuarios, comunicarnos contigo, mantener la seguridad de la cuenta y mejorar la fiabilidad de la plataforma.',
        },
        {
          number: '03',
          title: 'Datos escolares y compartidos',
          body: 'Información como horarios, detalles de las clases, anuncios y otro contenido compartido puede ser visible para los miembros del espacio escolar correspondiente, según los permisos asociados a dicho espacio.',
        },
        {
          number: '04',
          title: 'Seguridad',
          body: 'Utilizamos medidas técnicas y organizativas razonables para proteger la información almacenada y procesada mediante THESDEL. Ningún servicio en línea puede garantizar una seguridad absoluta, por lo que los usuarios también deben proteger sus contraseñas y el acceso a sus cuentas.',
        },
        {
          number: '05',
          title: 'Cookies y almacenamiento local',
          body: 'THESDEL puede utilizar cookies, almacenamiento local y tecnologías similares para mantener las sesiones, recordar preferencias y permitir funciones esenciales. Estas tecnologías ayudan a que la aplicación funcione de forma coherente entre sesiones.',
        },
        {
          number: '06',
          title: 'Servicios de terceros',
          body: 'THESDEL puede depender de proveedores de servicios de confianza para infraestructura, autenticación, mensajería, análisis u otras funciones técnicas. Estos proveedores pueden procesar información únicamente cuando sea necesario para prestar sus servicios.',
        },
        {
          number: '07',
          title: 'Tus opciones',
          body: 'Dependiendo de la función y de la legislación aplicable, puedes tener la posibilidad de acceder, corregir, actualizar o solicitar la eliminación de la información asociada a tu cuenta.',
        },
        {
          number: '08',
          title: 'Actualizaciones de la política',
          body: 'A medida que THESDEL evolucione, esta política puede cambiar. Las versiones actualizadas se publicarán a través de la plataforma con una nueva fecha de entrada en vigor.',
        },
      ],
    },
    about: {
      eyebrow: 'Acerca de THESDEL',
      title: 'Creado para la vida escolar.',
      description:
        'THESDEL es una capa digital diseñada para hacer que la coordinación escolar diaria sea más sencilla, clara y fácil de gestionar.',
      footerLabel: 'THESDEL / ACERCA DE',
      buttonLabel: 'Volver a THESDEL',
      sections: [
        {
          number: '01',
          title: 'La idea',
          body: 'La vida escolar implica mucho más que clases. Los estudiantes se mueven entre horarios, personas, anuncios, fechas límite, recursos y tareas de coordinación diaria. THESDEL reúne todas esas piezas en un entorno conectado.',
        },
        {
          number: '02',
          title: 'Un solo lugar para el día escolar',
          body: 'THESDEL está diseñado alrededor de la forma en que los estudiantes realmente viven su día. Horarios, clases, anuncios, actividades de estudio, recursos compartidos y otras herramientas escolares pueden convivir en un mismo lugar en vez de estar dispersos entre distintas plataformas.',
        },
        {
          number: '03',
          title: 'Construido alrededor de comunidades',
          body: 'Las escuelas son comunidades, no solo conjuntos de usuarios individuales. THESDEL ofrece a los grupos un espacio compartido donde sus miembros pueden mantenerse coordinados mientras los representantes autorizados ayudan a organizar la información.',
        },
        {
          number: '04',
          title: 'Diseñado para condiciones reales',
          body: 'Los entornos escolares pueden tener conectividad irregular, horarios cambiantes y grandes cantidades de usuarios. THESDEL está diseñado teniendo en cuenta la fiabilidad, la claridad y el acceso eficiente.',
        },
        {
          number: '05',
          title: 'Nuestro enfoque',
          body: 'Creemos que la tecnología escolar debe reducir las dificultades en lugar de crear más. Por eso buscamos mantener una experiencia enfocada, útil y respetuosa con las personas que dependen de ella cada día.',
        },
      ],
    },
  },
};

export default ES_LANDING;