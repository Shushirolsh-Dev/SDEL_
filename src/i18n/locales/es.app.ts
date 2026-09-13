import type { AppStrings } from '../types.app';

export const meta = {
  code: 'es',
  nativeName: 'Español',
};

const ES: AppStrings = {
  header: {
    brand: 'THESDEL',
    syncSynced: 'SINCRONIZADO',
    syncPending: 'SINCRONIZACIÓN PENDIENTE:',
    console: 'Consola',
  },

  nav: {
    today: 'Hoy',
    timetable: 'Horario',
    attendance: 'Asistencia',
    class: 'Clase',
    profile: 'Perfil',
  },

  toast: {
    classCodeNotFound: (code) =>
      `Código de clase "${code}" no encontrado.`,
    alreadyJoined:
      'Ya te has unido o has solicitado unirte a esta clase.',
    errorJoining: (message) =>
      `Error al unirte a la clase: ${message}`,
    requestSubmitted:
      'Tu solicitud de inscripción ha sido enviada para su aprobación.',
    enrolledSuccess: (className) =>
      `Te has inscrito correctamente en "${className}"!`,
    joinApproved: '¡Solicitud de incorporación del estudiante aprobada!',
    joinDenied: 'Solicitud de incorporación del estudiante rechazada.',
    removalRequestSent:
      'Solicitud de eliminación enviada al representante de la clase.',
    memberRemoved: 'Miembro eliminado correctamente.',
    removalApproved: 'Eliminación del miembro aprobada.',
    removalRejected: 'Eliminación del miembro rechazada.',
    codeChanged: (code) =>
      `Código de clase cambiado a: ${code}`,
    attendanceMarked: '¡Asistencia registrada!',
    timetableAdded: '¡Entrada del horario añadida!',
    timetableUpdated: '¡Entrada del horario actualizada!',
    timetableDeleted: 'Entrada del horario eliminada.',
    memberPromoted: '¡Miembro ascendido a asistente!',
    assistantDemoted: 'Asistente cambiado a miembro.',
    classDeleted: 'Clase eliminada correctamente.',
    mustBeLoggedIn:
      'Debes iniciar sesión para abandonar una clase.',
    cannotLeaveAsRep:
      'Eres el representante de la clase. Primero debes eliminar la clase o ascender a alguien a asistente.',
    selectAssistantToTransfer:
      'Selecciona un asistente al que transferir la propiedad.',
    leaveFailed:
      'No se pudo abandonar la clase. Inténtalo de nuevo.',
    leftClass: 'Has abandonado la clase correctamente.',
    transferFailed:
      'No se pudo transferir la propiedad. Inténtalo de nuevo.',
    roleUpdateFailed:
      'No se pudo actualizar el rol. Inténtalo de nuevo.',
    roleUpdateFailedSelf:
      'No se pudo actualizar tu rol. Inténtalo de nuevo.',
    ownershipTransferred: (name) =>
      `La propiedad se transfirió a ${name}. Ahora eres miembro.`,
    leaveAfterTransferFailed:
      'La propiedad se transfirió, pero no se pudo abandonar la clase. Inténtalo de nuevo.',
    leftAfterTransfer:
      'Has abandonado la clase correctamente después de transferir la propiedad.',
  },

  confirm: {
    transferOwnershipToOne: (name) =>
      `Eres el representante de la clase. ¿Transferir la propiedad a ${name} y abandonar la clase?`,
  },

  broadcast: {
    classRepMarker: 'Representante de la clase',
    classCreated: (name, author, code) =>
      `La clase "${name}" fue creada por el representante ${author} con el código único: ${code}`,
    entryAdded: (subject, day, startTime) =>
      `Horario añadido: ${subject} el ${day}s a las ${startTime}.`,
    venueChanged: (subject, from, to) =>
      `El aula de ${subject} cambió de ${from} a ${to}. `,
    classCancelled: (subject) =>
      `La clase de ${subject} ha sido oficialmente CANCELADA (Racha protegida). `,
    cancellationReverted: (subject) =>
      `La cancelación de la clase de ${subject} ha sido revertida. `,
    entryDeleted: (subject) =>
      `El horario de ${subject} fue eliminado permanentemente del horario.`,
    dayNames: [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ],
  },

  profile: {
    roleFallback: 'Estudiante',
    studentFallback: 'Estudiante',
    settingsButton: 'Configuración',
    logoutButton: 'Cerrar sesión',
  },

  notifications: {
    header: {
      backTitle: 'Atrás',
      title: 'Notificaciones',
      subtitle: 'Anuncios y actualizaciones de la clase',
      refreshButton: 'Actualizar',
      refreshingButton: 'Actualizando',
    },

    empty: {
      title: 'Nada nuevo',
      subtitle:
        'Los anuncios oficiales y las actualizaciones importantes de la clase aparecerán aquí.',
    },

    card: {
      labelCancelled: 'CANCELADO',
      labelUrgent: 'URGENTE',
      labelVenueChanged: 'AULA CAMBIADA',
      labelInfo: 'INFO',
      labelSponsored: 'PATROCINADO',
      labelAdSpace: 'ESPACIO PUBLICITARIO',
      sponsoredSpotlight: 'Contenido patrocinado',
      byLabel: 'Por',
      teamLabel: 'EQUIPO THESDEL',
      agreedButton: (count) =>
        `De acuerdo · ${count}`,
      agreeButton: (count) =>
        `Aceptar · ${count}`,
      adLearnMore: 'Más información',
      pollSectionLabel: 'Encuesta de la clase',
      pollResponseRegistered: 'Respuesta registrada',
      pollResponseRecorded:
        'Tu respuesta ha sido registrada.',
      pollSelected: 'Seleccionado:',
      pollYourResponse: 'Tu respuesta',
      pollLineCounter: (current, max) =>
        `${current}/${max} líneas`,
      pollTextareaPlaceholder:
        'Escribe tu respuesta...',
      pollSubmitResponse: 'Enviar respuesta',
      pollSubmitAnswer: 'Enviar respuesta',
      pollDefaultYes: 'Sí',
      pollDefaultNo: 'No',
    },

    rep: {
      title: 'Anuncio del representante',
      subtitle:
        'Envía una actualización oficial a tu clase',
      textareaPlaceholder:
        'Comparte un consejo de estudio, recordatorio, cambio de horario o aviso importante...',
      counterLabel: (current, max) =>
        `${current}/${max}`,
      visibleToMembers:
        'Visible para los miembros de la clase',
      postButton: 'Publicar anuncio',
      postingButton: 'Publicando',
      successMessage:
        'Anuncio publicado correctamente',
    },
  },

  home: {
    header: {
      todayLabel: 'Hoy',
      greetingMorning: 'Buenos días',
      greetingAfternoon: 'Buenas tardes',
      greetingEvening: 'Buenas noches',
      nameFallback: 'Estudiante',
      openNotifications: 'Abrir notificaciones',
    },

    nextClass: {
      liveClassLabel: 'Clase en curso',
      nextClassLabel: 'Próxima clase',
      fallbackClassName: 'Clase',
      noMoreClassesTitle: 'No hay más clases',
      noMoreClassesSubtitle:
        'Tu día académico está despejado.',
      liveCountdown: (minutes) =>
        `EN CURSO · quedan ${minutes} min`,
      startsInHours: (hours, minutes) =>
        `Comienza en ${hours} h ${minutes} min`,
      startsInMinutes: (minutes) =>
        `Comienza en ${minutes} min`,
      noMoreClassesToday:
        'No hay más clases hoy',
    },

    schedule: {
      sectionTitle: 'Hoy',
      sectionSubtitle: 'Tu horario de clases',
      refreshing: 'Actualizando...',
      refresh: 'Actualizar',
      emptyTitle: 'No hay clases hoy',
      emptySubtitle:
        'Disfruta del tiempo libre o adelanta trabajo.',
      fallbackClassName: 'Clase',
      liveBadge: 'EN CURSO',
      cancelledBadge: 'CANCELADA',
      presentButton: 'Presente',
      markButton: 'Marcar',
    },

    attendance: {
      sectionLabel: 'Asistencia',
      attendedCount: (count) =>
        `${count} asistidas`,
      totalCount: (count) =>
        `${count} en total`,
    },

    updates: {
      sectionTitle: 'Actualizaciones',
      showLess: 'Mostrar menos',
      viewAll: 'Ver todas',
      noUpdates: 'Aún no hay actualizaciones.',
      reacted: 'Reaccionaste',
      acknowledge: 'Confirmar',
      labelCancelled: 'CANCELADA',
      labelVenueChanged: 'AULA CAMBIADA',
      labelGlobal: 'GLOBAL',
      labelClassUpdate: 'ACTUALIZACIÓN DE CLASE',

      edited: 'Editado',
      editBroadcast: 'Editar anuncio',
      deleteBroadcast: 'Eliminar anuncio',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      deleteBroadcastTitle:
        '¿Eliminar este anuncio?',
      deleteBroadcastMessage:
        'Esta acción no se puede deshacer.',
      dateLocale: 'es-ES',
    },

    rep: {
      title: 'Representante de clase',
      subtitle: 'Envía un anuncio a tu clase.',
      textareaPlaceholder:
        'Escribe un anuncio...',
      sending: 'Enviando...',
      broadcast: 'Anuncio',
      successMessage:
        'Anuncio enviado correctamente.',
    },

    ad: {
      sponsoredLabel: 'Patrocinado',
      altFallback: 'Patrocinado',
    },
  },
  timetable: {
    header: {
      sectionLabel: 'Horario académico',
      title: 'Horario',
      noClassSelected: 'Ninguna clase seleccionada',
      weekButton: 'Semana',
      addClassButton: 'Añadir clase',
    },

    permission: {
      managerPrefix: 'Tienes',
      managerSuffix:
        'privilegios. Puedes gestionar el horario compartido.',
      memberPrefix:
        'Estás viendo este horario como',
      memberMiddle: 'miembro',
      memberSuffix:
        '. Solo los administradores de la clase pueden modificar las entradas.',
    },

    empty: {
      noClassTitle: 'Aún no hay ninguna clase',
      noClassSubtitle:
        'Únete o crea una clase para comenzar a ver su horario compartido.',
      emptyTitle: 'El horario está vacío',
      emptySubtitle:
        'Todavía no hay clases programadas para este grupo.',
      addFirstClassButton: 'Añadir primera clase',
      nothingScheduledTitle: 'Nada programado',
      nothingScheduledSubtitle:
        'No hay clases programadas para este día.',
    },

    days: {
      labels: [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
      ],
      short: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },

    entryCard: {
      cancelledBadge: 'Cancelada',
      roomShiftedBadge: 'Aula cambiada',
      originallyLabel: 'Originalmente:',
      minutesSuffix: 'min',
      editButton: 'Editar',
      deleteButton: 'Eliminar',
    },

    form: {
      newClassEyebrow: 'Nueva clase',
      editClassEyebrow: 'Gestionar clase',
      addTitle: 'Añadir entrada al horario',
      editTitle: 'Editar entrada del horario',
      subjectLabel: 'Asignatura',
      subjectPlaceholder: 'p. ej., Ingeniería de Software',
      dayLabel: 'Día',
      venueLabel: 'Aula',
      venuePlaceholder: 'p. ej., LT 1',
      startsLabel: 'Comienza',
      endsLabel: 'Termina',
      cancelClassTitle: 'Cancelar clase',
      cancelClassSubtitle:
        'Mantén la entrada visible, pero márcala como cancelada.',
      cancelButton: 'Cancelar',
      saveChangesButton: 'Guardar cambios',
      addClassButton: 'Añadir clase',
      errorSubjectRequired: 'El nombre de la asignatura es obligatorio.',
      errorVenueRequired: 'El aula es obligatoria.',
      errorTimeOrder:
        'La hora de inicio debe ser anterior a la hora de finalización.',
    },

    deleteDialog: {
      title: '¿Eliminar esta clase?',
      descriptionPrefix: 'Estás a punto de eliminar',
      descriptionSuffix:
        'del horario compartido. Esta acción no se puede deshacer.',
      keepButton: 'Conservar clase',
      removeButton: 'Eliminar',
    },
  },
  attendance: {
    header: {
      sectionLabel: 'Registro académico',
      title: 'Asistencia',
      subtitle:
        'Controla tu asistencia, tus rachas y las clases completadas.',
      statusSafe: 'Asistencia segura',
      statusNeedsAttention: 'Necesita atención',
    },

    summary: {
      attendanceLabel: 'Asistencia',
      targetLabel: 'Objetivo: 75%+',
      attendedLabel: 'Asistidas',
      attendedSubtitle: 'Clases completadas a las que asististe',
      missedLabel: 'Faltas',
      missedSubtitle: 'Clases completadas a las que faltaste',
      cancelledLabel: 'Canceladas',
      cancelledSubtitle: 'Excluidas de forma segura de las estadísticas',
    },

    streak: {
      sectionTitle: 'Racha de asistencia',
      currentStreakLabel: 'Racha actual',
      consecutiveSuffix: 'clases consecutivas',
      explanation:
        'Asiste a todas las clases programadas para mantener la racha. Las clases canceladas no interrumpen tu racha. Faltar a una clase programada la reinicia.',
      currentRow: 'Actual',
      longestRow: 'Más larga',
      classesSuffix: 'clases',
      statusRow: 'Estado',
      statusSafe: 'Segura',
      statusLow: 'Baja',
    },

    week: {
      sectionTitle: 'Asistencia semanal',
      sectionSubtitle:
        'Revisa cada clase programada de la semana seleccionada.',
      todayBadge: 'Hoy',
      noClassesScheduled: 'No hay clases programadas',
      showLess: 'Mostrar menos',
      showWeekend: (count) =>
        `Mostrar fin de semana · ${count} días más`,
      weekDaysLong: [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
      ],
      weekDaysShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },

    status: {
      cancelledSafe: 'Cancelada · Segura',
      attended: 'Asistida',
      missed: 'Faltó',
      upcoming: 'Próxima',
    },

    empty: {
      noClassesTitle: 'Aún no hay clases',
      noClassesSubtitle:
        'Únete a una clase para comenzar a registrar tu asistencia.',
    },
  },
  class: {
    header: {
      eyebrow: 'Espacios de clase',
      title: 'Tus clases',
      subtitle:
        'Gestiona tus espacios de clase, miembros, acceso y códigos de clase.',
      tabMyClasses: 'Mis clases',
      tabCreateClass: 'Crear clase',
      emptyTitle: 'Aún no hay clases',
      emptySubtitle:
        'Únete a una clase existente con un código o crea un nuevo espacio de clase.',
      emptyJoinButton: 'Unirse a una clase',
      emptyCreateButton: 'Crear una clase',
    },

    sidebar: {
      sectionLabel: 'Clases',
      membersSuffix: 'miembros',
      joinAnother: 'Unirse a otra clase',
    },

    overview: {
      badgeClassSpace: 'Espacio de clase',
      badgeRepresentative: 'Representante',
      noDescription:
        'Aún no se ha añadido una descripción de la clase.',
      visibilityPublic: 'Pública',
      visibilityPrivate: 'Privada',
      classCodeLabel: 'Código de clase',
      copyCodeTitle: 'Copiar código de clase',
      membersLabel: 'Miembros',
      studentsSubtitle: 'estudiantes en esta clase',
    },

    requests: {
      joinRequestsTitle: 'Solicitudes para unirse',
      joinRequestsSubtitle:
        'Revisa a los estudiantes que esperan entrar en esta clase.',
      waitingForApproval: 'Esperando aprobación',
      approveButton: 'Aprobar',
      denyButton: 'Rechazar',
      removalRequestsTitle: 'Solicitudes de eliminación',
      removalRequestsSubtitle:
        'Revisa las solicitudes para eliminar miembros.',
      memberRemovalRequested: 'Eliminación de miembro solicitada',
      rejectButton: 'Rechazar',
    },

    members: {
      title: 'Miembros',
      subtitle: 'Estudiantes que actualmente están en esta clase.',
      youBadge: 'Tú',
      roleRepresentative: 'Representante',
      roleAssistant: 'Asistente',
      roleMember: 'Miembro',
      demoteButton: 'Degradar',
      promoteButton: 'Convertir en asistente',
      removeButton: 'Eliminar',
      requestRemovalButton: 'Solicitar eliminación',
      emptyMessage: 'Aún no hay miembros.',
    },

    management: {
      title: 'Gestión de la clase',
      subtitle: 'Gestiona el acceso, la propiedad y esta clase.',
      classCodeTitle: 'Código de clase',
      classCodeSubtitle:
        'Regenera el código si se ha compartido demasiado.',
      regenerateButton: 'Regenerar',
      transferTitle: 'Transferir propiedad',
      transferSubtitle:
        'Otorga a otro administrador la propiedad de esta clase.',
      transferButton: 'Transferir',
      leaveTitle: 'Abandonar clase',
      leaveSubtitle: 'Elimínate de esta clase.',
      leavingButton: 'Abandonando...',
      leaveButton: 'Abandonar',
      deleteTitle: 'Eliminar clase',
      deleteSubtitle:
        'Elimina permanentemente esta clase y sus miembros.',
      deleteButton: 'Eliminar',
    },

    modals: {
      loadingCreating: 'Creando clase',
      loadingJoining: 'Uniéndose a la clase',
      loadingUpdating: 'Actualizando',
      loadingFallback: 'Espera...',

      transferTitle: 'Transferir propiedad',
      transferSubtitle:
        'Selecciona un asistente para convertirlo en el nuevo propietario.',
      cancelButton: 'Cancelar',
      transferConfirmButton: 'Transferir',

      confirmDeleteTitle: '¿Eliminar clase?',
      confirmRegenerateTitle: '¿Regenerar código de clase?',
      confirmRejectJoinTitle: '¿Rechazar solicitud para unirse?',
      confirmRemoveMemberTitle: '¿Eliminar miembro?',
      confirmRequestRemovalTitle: '¿Solicitar eliminación del miembro?',

      confirmDeleteBody: (className) =>
        `Esto eliminará permanentemente "${className}". Esta acción no se puede deshacer.`,
      confirmRegenerateBody: (className) =>
        `El código actual de "${className}" dejará de funcionar y se generará uno nuevo.`,
      confirmRejectJoinBody: (userName) =>
        `La solicitud de ${userName} para unirse a esta clase será rechazada.`,
      confirmRemoveMemberBody: (memberName) =>
        `${memberName} será eliminado de esta clase.`,
      confirmRequestRemovalBody: (memberName) =>
        `${memberName} recibirá una solicitud de eliminación para esta clase.`,

      confirmDeleteButton: 'Eliminar',
      confirmRegenerateButton: 'Regenerar',
      confirmRejectButton: 'Rechazar',
      confirmRemoveButton: 'Eliminar',
      confirmRequestRemovalButton: 'Solicitar eliminación',
    },

    join: {
      eyebrow: 'Unirse a una clase',
      title: 'Introduce un código de clase',
      subtitle:
        'Usa el código proporcionado por el propietario o representante de la clase.',
      classCodeLabel: 'Código de clase',
      classCodePlaceholder: 'Introduce el código de clase',
      verificationLabel: 'Verificación',
      captchaQuestion: (a, b) => `Resuelve: ${a} + ${b} = ?`,
      captchaPlaceholder: 'Respuesta',
      newQuestionButton: 'Nueva pregunta',
      emptyCodeError: 'Introduce un código de clase.',
      incorrectCaptchaError: 'Respuesta incorrecta.',
      joiningButton: 'Uniéndose...',
      joinButton: 'Unirse a la clase',
    },

    create: {
      eyebrow: 'Crear clase',
      title: 'Crear una nueva clase',
      subtitle:
        'Crea un espacio para tu clase, departamento o grupo de estudio.',
      nameLabel: 'Nombre de la clase',
      namePlaceholder: 'p. ej., MTH 102',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: '¿Para qué es esta clase?',
      visibilityLabel: 'Visibilidad',
      visibilityPublicTitle: 'Pública',
      visibilityPublicSubtitle:
        'Cualquiera con el código de clase puede solicitar unirse.',
      visibilityPrivateTitle: 'Privada',
      visibilityPrivateSubtitle:
        'Solo las personas que apruebes pueden unirse a esta clase.',
      verificationLabel: 'Verificación',
      captchaQuestion: (a, b) => `Resuelve: ${a} + ${b} = ?`,
      captchaPlaceholder: 'Respuesta',
      newQuestionButton: 'Nueva pregunta',
      emptyNameError: 'Introduce un nombre para la clase.',
      incorrectCaptchaError: 'Respuesta incorrecta.',
      creatingButton: 'Creando...',
      createButton: 'Crear clase',
      createdWithCode: (code) => `Clase creada. Código: ${code}`,
      createdSuccess: 'Clase creada correctamente.',
    },

    toast: {
      joiningClass: 'Uniéndose a la clase...',
      creatingClass: 'Creando clase...',
      generatingCode: 'Generando nuevo código de clase...',
      unableToJoin: 'No se pudo unir a la clase.',
      unableToCreate: 'No se pudo crear la clase.',
      unableToRegenerate: 'No se pudo regenerar el código de clase.',
      joinApproved: 'Solicitud para unirse aprobada.',
      joinRejected: 'Solicitud para unirse rechazada.',
      unableToApproveJoin:
        'No se pudo aprobar la solicitud para unirse.',
      unableToRejectJoin:
        'No se pudo rechazar la solicitud para unirse.',
      unableToCopyCode: 'No se pudo copiar el código de clase.',
      leftClass: 'Has abandonado la clase.',
      classDeleted: 'Clase eliminada.',
      memberRemoved: (name) => `${name} ha sido eliminado.`,
      removalRequestSubmitted: 'Solicitud de eliminación enviada.',
      removalApproved: 'Eliminación aprobada.',
      removalRequestRejected: 'Solicitud de eliminación rechazada.',
      nowAssistant: (name) =>
        `${name} ahora es asistente.`,
      nowMember: (name) =>
        `${name} ahora es miembro.`,
      ownershipTransferred: 'Propiedad transferida.',
      unableToTransfer: 'No se pudo transferir la propiedad.',
    },
  },
  settings: {
    header: {
      backButton: 'Perfil',
      eyebrow: 'Cuenta',
      title: 'Configuración',
      subtitle: 'Gestiona tus preferencias y controles de clase.',
    },

    theme: {
      sectionLabel: 'Apariencia',
      sectionTitle: 'Tema',
      systemTitle: 'Sistema',
      systemSubtitle: 'Seguir tu dispositivo',
      lightTitle: 'Claro',
      lightSubtitle: 'Usar siempre el modo claro',
      darkTitle: 'Oscuro',
      darkSubtitle: 'Usar siempre el modo oscuro',
    },

    language: {
      sectionLabel: 'Preferencias',
      title: 'Idioma',
      dropdownLabel: 'Idioma de visualización',
      hint:
        'La interfaz se mostrará en este idioma en toda la aplicación.',
    },

    visibility: {
      sectionLabel: 'Gestión de clases',
      title: 'Visibilidad de la clase',
      subtitle:
        'Controla si los estudiantes pueden unirse a tus clases inmediatamente o necesitan aprobación.',
      applyAllTitle: 'Aplicar a todas las clases',
      applyAllSubtitle: 'Cambia todas las clases que posees a la vez.',
      applyAllPublicSubtitle:
        'Cualquiera con el código puede unirse inmediatamente',
      applyAllPrivateSubtitle:
        'Los nuevos miembros deben ser aprobados antes de unirse',
      publicButton: 'Pública',
      privateButton: 'Privada',
      yourClassesLabel: 'Tus clases',
      classSingular: 'clase',
      classPlural: 'clases',
      emptyTitle: 'Aún no tienes clases.',
      emptySubtitle: 'Las clases que crees aparecerán aquí.',
      joinCodeLabel: 'Código de acceso ·',
      updatingButton: 'Actualizando',
      makePrivateButton: 'Hacer privada',
      makePublicButton: 'Hacer pública',
      classPublicSubtitle:
        'Cualquiera con el código puede unirse inmediatamente',
      classPrivateSubtitle:
        'Los nuevos miembros deben ser aprobados antes de unirse',
      alertGlobalEmpty:
        'No tienes ninguna clase para aplicar la configuración de visibilidad global.',
      alertGlobalConfirm: (visibility) =>
        `¿Estás seguro de que quieres cambiar todas tus clases a ${visibility}?`,
      alertGlobalSuccess: (visibility) =>
        `Éxito: todas tus clases ahora son ${visibility}.`,
      alertGlobalFailed: (message) =>
        `No se pudo aplicar la visibilidad global: ${message}`,
      alertToggleFailed: (message) =>
        `No se pudo actualizar la visibilidad: ${message}`,
    },

    danger: {
      sectionLabel: 'Cuenta',
      title: 'Zona de peligro',
      deleteTitle: 'Eliminar tu cuenta',
      deleteSubtitle:
        'Elimina permanentemente tu cuenta, clases, membresías, registros de asistencia y datos relacionados.',
      deleteButton: 'Eliminar cuenta',
    },

    deleteModal: {
      eyebrow: 'Acción permanente',
      title: '¿Eliminar cuenta?',
      subtitle:
        'Esta acción no se puede deshacer. Tu cuenta y los datos asociados se eliminarán permanentemente.',
      passwordLabel: 'Confirmar con contraseña',
      passwordPlaceholder: 'Introduce tu contraseña',
      confirmLabel:
        'Entiendo que eliminar mi cuenta es permanente y no se puede deshacer.',
      cancelButton: 'Cancelar',
      deleteButton: 'Eliminar permanentemente',
      deletingButton: 'Eliminando',
      errorPasswordRequired:
        'Introduce tu contraseña para autorizar esta acción.',
      errorConfirmRequired:
        'Debes marcar la casilla de confirmación para continuar.',
      errorPasswordIncorrect:
        'La verificación de contraseña ha fallado. Introduce tu contraseña actual correcta.',
      errorProfileDelete:
        'No se pudo eliminar el perfil. Contacta con soporte.',
      errorAuthDelete:
        'No se pudo eliminar el usuario de autenticación. Contacta con soporte.',
      errorGeneric:
        'Ocurrió un error inesperado al eliminar la cuenta.',
    },

    footer: {
      title: 'Configuración',
      subtitle: 'Gestiona tu cuenta y tus preferencias.',
    },
  },
};

export default ES;