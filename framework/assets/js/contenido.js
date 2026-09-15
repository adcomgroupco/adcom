/* ============================================================
   Framework Digital · contenido.js
   TODO el texto de las partes interactivas vive aquí.
   Editar este archivo NO requiere tocar el HTML ni el JS.
   ============================================================ */

window.FD = window.FD || {};

FD.PILARES = {
  1:{tag:"PILAR 4.1", title:"Excelencia operativa", q:"¿Cómo hacemos bien el trabajo de forma consistente?",
     items:["Planeación","Implementación","QA","Lanzamiento","Monitoreo","Presupuesto","Tracking","Cierres","Documentación"]},
  2:{tag:"PILAR 4.2", title:"Inteligencia estratégica", q:"¿Cómo conectamos la ejecución digital con el problema real del negocio?",
     items:["Objetivos de negocio","Categoría","Audiencias","Oferta","Comportamiento","Contexto","Rol de los canales","Creatividad","CRM","Conversión comercial"]},
  3:{tag:"PILAR 4.3", title:"Experimentación", q:"¿Cómo aprendemos de manera sistemática?",
     items:["Hipótesis","Variables","Pruebas","Criterios de éxito","Periodos de observación","Resultados","Aprendizajes","Replicabilidad"]},
  4:{tag:"PILAR 4.4", title:"Gestión contextual", q:"¿Qué está pasando fuera de la plataforma que puede afectar los resultados?",
     items:["Estacionalidad","Eventos","Competencia","Regulación","Coyuntura","Precio","Oferta","Cambios de demanda","Tendencias","Disponibilidad","Capacidad comercial"]},
  5:{tag:"PILAR 4.5", title:"Documentación y trazabilidad", q:"¿Cómo convertimos el conocimiento generado en capacidad futura?",
     items:["Repositorios","Decisiones","Informes","Pruebas","Alertas","Aprendizajes","Históricos","Procesos","Playbooks"]}
};

FD.VARIABLES = {
  1:{tag:"6.1", title:"Variables controlables", desc:"Digital puede actuar directamente sobre ellas.",
     items:["Presupuesto","Distribución","Segmentación","Audiencias","Estructura de campañas","Configuración","Optimización","Puja","Formato","Frecuencia","Periodo","Diseño de pruebas","Medición","Configuración de conversiones"]},
  2:{tag:"6.2", title:"Variables influenciables", desc:"Digital no necesariamente las ejecuta, pero puede analizarlas, evidenciarlas y recomendar cambios.",
     items:["Creatividad","Mensaje","Oferta","Precio promocional","Landing","Formulario","UX","Contenido","CRM","Gestión comercial","Velocidad de atención","Calendario","Propuesta de valor"]},
  3:{tag:"6.3", title:"Variables externas o contextuales", desc:"Digital no puede controlarlas, pero debe monitorearlas e incorporarlas en el análisis.",
     items:["Eventos deportivos","Estacionalidad","Regulación","Coyuntura económica","Competencia","Fechas comerciales","Cambios culturales","Cambios de demanda","Noticias relevantes","Comportamiento del mercado","Disponibilidad de inventario","Cambios de plataforma","Temporadas"]}
};

FD.ETAPAS = [
  {n:"7.1", t:"Entrada", d:"Toda campaña, solicitud, proyecto o situación entra por aquí.", label:"Puede originarse en",
   items:["Brief","Solicitud de cliente","Nueva campaña","Nuevo periodo","Cambio de estrategia","Problema","Oportunidad","Alerta","Cambio de presupuesto","Cambio de oferta"]},
  {n:"7.2", t:"Clasificación", d:"Ubicar el trabajo antes de moverlo.", label:"Definir",
   items:["Tipo de trabajo","Prioridad","Impacto","Urgencia","Responsable","Áreas involucradas","Dependencias"]},
  {n:"7.3", t:"Análisis de contexto", d:"Antes de entrar en ejecución.", label:"Preguntarse",
   items:["¿Qué está pasando en el negocio?","¿Qué está pasando en la categoría?","¿Qué está pasando con el consumidor?","¿Qué está pasando en competencia?","¿Qué eventos pueden afectar la demanda?","¿Qué variables externas pueden modificar resultados?","¿Qué está pasando comercialmente?"]},
  {n:"7.4", t:"Diagnóstico", d:"Separar síntoma de causa.", label:"Definir",
   items:["Problema real","Evidencia disponible","Variables afectadas","Causas posibles","Información faltante","Supuestos","Riesgos"]},
  {n:"7.5", t:"Definición de acción", d:"Qué vamos a hacer y cómo sabremos si funcionó.", label:"Establecer",
   items:["Objetivo","Hipótesis","Alcance","Responsable","Presupuesto","Periodo","KPI","Criterio de éxito","Dependencias"]},
  {n:"7.6", t:"Ejecución", d:"Cada persona aplica su metodología profesional respetando los mínimos.", label:"Respetando",
   items:["Objetivos","Estándares","QA","Nomenclaturas","Presupuesto","Medición","Documentación mínima"]},
  {n:"7.7", t:"Control de calidad", d:"Validar según el caso.", label:"Validar",
   items:["Estrategia","Implementación","Presupuesto","Tracking","Creatividad","Landing","Nomenclatura","Fechas","Audiencias","Conversiones"]},
  {n:"7.8", t:"Activación", d:"La campaña o acción entra en producción.", label:"Debe existir",
   items:["Responsable","Periodo inicial de observación","KPI principal","Línea base","Presupuesto","Sistema de monitoreo"]},
  {n:"7.9", t:"Monitoreo", d:"Vigilancia activa, no espera pasiva.", label:"Revisar",
   items:["Resultados","Consumo","Calidad","Contexto","Señales de alerta","Cambios de comportamiento"]},
  {n:"7.10", t:"Aprendizaje", d:"El cierre de un ciclo alimenta el siguiente.", label:"Registrar",
   items:["Qué ocurrió","Qué se decidió","Qué resultado tuvo","Qué aprendimos","Qué puede replicarse","Qué debe cambiar en el framework"]}
];

FD.CICLO = [
  {t:"Contexto", d:"Qué está pasando en el negocio, la categoría y el entorno antes de proponer nada. Sin esto, la campaña nace desconectada del problema real.", a:"¿Qué cambió alrededor del cliente?"},
  {t:"Objetivo", d:"Qué queremos lograr, expresado como resultado de negocio y no como entregable. Un objetivo no es “lanzar cinco campañas”.", a:"¿Para qué existe esta campaña?"},
  {t:"Hipótesis", d:"Qué creemos que va a funcionar y por qué. Se escribe antes de invertir, no después de leer el resultado.", a:"¿Qué queremos probar exactamente?"},
  {t:"Presupuesto", d:"Cuánto invertimos, cómo se distribuye entre plataformas y con qué curva de consumo a lo largo del periodo.", a:"¿Cuánto invertimos y con qué ritmo?"},
  {t:"Materiales", d:"Qué necesitamos comunicar y qué hipótesis de comunicación deben resolver las piezas. El cuadro de materiales conecta performance con creatividad.", a:"¿Qué necesitamos comunicar, no cuántas piezas?"},
  {t:"Implementación", d:"Construcción en plataforma: arquitectura, segmentación, configuración de objetivos, nomenclatura y tracking.", a:"¿Está armado como lo pensamos?"},
  {t:"QA", d:"La revisión que ocurre antes de gastar: URLs, eventos, conversiones, fechas, audiencias y nomenclatura.", a:"¿Podemos medir lo que vamos a invertir?"},
  {t:"Activación", d:"Los requisitos para activar son los de la etapa 7.8 y no se repiten aquí. Lo propio del ciclo es que en esta estación termina la preparación: desde este punto, cada cambio ya cuesta inversión.", a:"¿Quién responde y contra qué comparamos?"},
  {t:"Monitoreo", d:"Qué se revisa está en la etapa 7.9. En una campaña el monitoreo además tiene fecha de corte: el cierre mensual (42) es donde se consolida todo lo que ocurrió en el periodo.", a:"¿Qué señal nos obligaría a cambiar?"},
  {t:"Aprendizaje", d:"El registro es el de la etapa 7.10. Lo propio del ciclo es que la conclusión de una campaña es el contexto de la siguiente: si no se lee antes de la estación 01, la vuelta no cierra.", a:"¿Qué de esto sirve para la próxima campaña?"}
];

FD.NOTAS_MENSAJE = {
  1:"El mensaje abre acotando qué se detectó y desde cuándo. Sin fecha no hay forma de comparar contra la línea base.",
  2:"El impacto se expresa acotando el alcance: qué está afectado y qué no. Decir que medios permanece estable ya delimita dónde buscar.",
  3:"El contexto entra antes de la explicación. Es lo que evita que la lectura se reduzca a “bajó performance”.",
  4:"La hipótesis se declara como hipótesis, no como conclusión. Se dice qué estamos evaluando, no qué pasó.",
  5:"La acción es concreta y ya está en curso. No se comunica una intención, se comunica lo que se está haciendo.",
  6:"Se cierra con un compromiso de actualización. Nadie se queda esperando sin saber cuándo vuelve a haber noticias."
};


FD.ARBOL = {
  start:{q:"¿Existe una desviación real?", a:[{l:"No", to:"monitorear"},{l:"Sí", to:"externo"}]},
  externo:{q:"¿Hay cambio externo o de negocio?", a:[{l:"Sí", to:"contexto"},{l:"No / parcial", to:"entrega"}]},
  entrega:{q:"¿Cambió la entrega?", a:[{l:"Sí", to:"medios"},{l:"No", to:"conversion"}]},
  conversion:{q:"¿Cambió la conversión?", a:[{l:"Sí", to:"landing"},{l:"No", to:"calidad"}]},
  monitorear:{r:"Monitorear", d:"No hay desviación real. Registrar la observación y revisar en el siguiente corte. Evitar optimizar por ruido."},
  contexto:{r:"Incorporar contexto y definir impacto", d:"El cambio se explica total o parcialmente por factores externos o de negocio. Ajustar expectativa, estrategia, oferta o calendario, y comunicar la lectura."},
  medios:{r:"Revisar medios", d:"Arquitectura, puja, presupuesto y audiencia. El problema está en la capacidad de entrega de la campaña."},
  landing:{r:"Landing / tracking / oferta", d:"La afectación empieza después del clic. Validar landing, formulario, UX, medición y propuesta de oferta."},
  calidad:{r:"Calidad / CRM / creatividad / contexto", d:"Ni entrega ni conversión explican la desviación. Revisar calidad del lead, gestión comercial, fatiga creativa y variables de contexto."}
};

FD.REPOSITORIO = [
  {c:"00", t:"Inicio", d:"Mini landing ejecutiva. No debe repetir todo el repositorio.", items:["Estado general","Objetivo","Periodo","KPI principal","Campañas activas","Resultados principales","Alertas relevantes","Últimas decisiones","Pendientes","Próximas acciones","Accesos rápidos"]},
  {c:"01", t:"Cuenta y contexto", d:"Quién es el cliente y cómo funciona su negocio.", items:["Negocio","Productos","Objetivos","Audiencias","Mercados","Alcance","Stakeholders","Plataformas","Accesos","Indicadores","Glosario"]},
  {c:"02", t:"Estrategia", d:"Debe existir una única estrategia vigente claramente identificada.", items:["Estrategia vigente","Diagnóstico","Ruta estratégica","Audiencias","Rol de canales","Hipótesis","Medición","Riesgos","Supuestos","Contexto"], note:"Una sola estrategia vigente."},
  {c:"03", t:"Planeación y proyecciones", d:"Toda proyección declara supuestos.", items:["Plan anual","Plan trimestral","Plan mensual","Proyecciones","Presupuesto","Calendario","Escenarios","Contenidos necesarios","Dependencias"], note:"Toda proyección declara supuestos."},
  {c:"04", t:"Campañas y ejecución", d:"Qué está corriendo, qué viene y qué cerró.", items:["Vista general","Campañas activas","Próximas campañas","Campañas cerradas","Pruebas","Implementaciones","Activos","Incidencias","Seguimiento"]},
  {c:"05", t:"Resultados e informes", d:"Todo informe genera acciones.", items:["Resumen ejecutivo","Dashboard","Informes","Resultados comerciales","Calidad","Histórico","Comparación con proyección","Decisiones derivadas"]},
  {c:"06", t:"Experimentos y aprendizajes", d:"Toda prueba tiene hipótesis y conclusión.", items:["Backlog","Pruebas activas","Pruebas cerradas","Hipótesis","Resultados","Aprendizajes","Posibilidad de réplica"]},
  {c:"07", t:"Decisiones, riesgos y pendientes", d:"Decisiones: fecha, contexto, decisión, responsable, impacto y acción. Riesgos: probabilidad, impacto, mitigación y responsable. Pendientes: acción, responsable, fecha, dependencia y estado.", items:["Decisiones","Riesgos","Pendientes"]},
  {c:"08", t:"Investigación y contexto", d:"Toda investigación debería conectarse con una decisión, hipótesis u oportunidad.", items:["Mercado","Competencia","Categoría","Tendencias","Estacionalidad","Eventos","Regulación","Audiencias","Fuentes externas"]},
  {c:"09", t:"Operación técnica", d:"La capa que sostiene la medición.", items:["Arquitectura","Tracking","Nomenclaturas","Integraciones","Accesos","Protocolos","Checklists","Implementaciones técnicas"]},
  {c:"99", t:"Histórico", d:"Información no vigente. Archivar no significa borrar.", items:["Estrategias anteriores","Proyecciones cerradas","Informes históricos","Campañas finalizadas","Versiones sustituidas"], note:"Archivar no significa borrar."}
];

/* 93 · Distribución de cuentas
   Tablero de reparto por persona. `total_declarado` es la cifra que traía el
   tablero original; el total real se calcula sumando las campañas de abajo. */
FD.CUENTAS = {
  total_declarado: 867,
  equipo: [
    {id:"manuela", nombre:"Manuela"},
    {id:"julian",  nombre:"Julián"},
    {id:"daniel",  nombre:"Daniel"},
    {id:"michael", nombre:"Michael"},
    {id:"eros",    nombre:"Eros"},
    {id:"german",  nombre:"German"}
  ],
  cuentas: [
    {n:"Gana",            c:35,   r:"manuela"},
    {n:"Lotti",           c:5,    r:"manuela"},
    {n:"Placa",           c:8,    r:"manuela"},
    {n:"Susuerte",        c:15,   r:"julian"},
    {n:"La Santé",        c:12,   r:"julian"},
    {n:"Colgas",          c:8,    r:"julian"},
    {n:"Adriana Duque",   c:3,    r:"julian"},
    {n:"Nexos",           c:2,    r:"julian"},
    {n:"Lo Yevo",         c:null, r:"julian"},
    {n:"CESDE",           c:83,   r:"daniel"},
    {n:"Betplay",         c:45,   r:"daniel"},
    {n:"Astrobet",        c:18,   r:"daniel"},
    {n:"Betplay es Gana", c:5,    r:"daniel"},
    {n:"Ya Juego",        c:null, r:"daniel"},
    {n:"Raza",            c:null, r:"daniel"},
    {n:"UAN",             c:193,  r:"michael"},
    {n:"Compensar",       c:170,  r:"michael"},
    {n:"U. Católica",     c:108,  r:"michael"},
    {n:"EIA",             c:23,   r:"michael"},
    {n:"Genius",          c:12,   r:"michael"},
    {n:"Huevos Oro",      c:3,    r:"michael"},
    {n:"UPB",             c:43,   r:"eros"},
    {n:"U. Corpas",       c:34,   r:"eros"},
    {n:"Baloto",          c:30,   r:"eros"},
    {n:"Megaloto",        c:22,   r:"eros"},
    {n:"La Salle",        c:7,    r:"eros"},
    {n:"RIS",             c:4,    r:"eros"}
  ]
};

/* ÍNDICE
   Cada bloque es una sección; cada item es una entrada consultable.
   `a` es el ancla de destino (el id que existe en index.html). */
/* Familias del índice: agrupan las secciones para poder consultar por bloque */
FD.FAMILIAS = [
  {id:"fundamentos", t:"Fundamentos", r:"00—06", d:"Por qué existe el framework y cómo leemos un resultado"},
  {id:"operacion",   t:"Operación",   r:"07—25 · 42—43 · 93—94", d:"Cómo entra el trabajo, quién lo hace y con qué procesos"},
  {id:"control",     t:"Control",     r:"26—33", d:"Presupuesto, pacing y alertas"},
  {id:"reaccion",    t:"Reacción",    r:"34—57 · 86—92", d:"Qué hacemos cuando algo se desvía"},
  {id:"sistema",     t:"Sistema",     r:"58—99", d:"Dónde queda documentado, qué automatizamos y qué sigue"}
];

FD.INDICE = [
  {f:"fundamentos", a:"contexto", n:"00—03", t:"Punto de partida", items:[
    {a:"contexto", t:"El reto: convertir capacidad individual en capacidad colectiva"},
    {a:"contexto", t:"02—03 · Qué queremos evitar: burocracia, rigidez y control innecesario"},
    {a:"objetivo",  t:"01 · Los quince resultados que el sistema debe habilitar"}
  ]},
  {f:"fundamentos", a:"pilares", n:"04", t:"Cinco pilares", items:[
    {a:"pilares", t:"4.1 · Excelencia operativa — hacer bien el trabajo de forma consistente"},
    {a:"pilares", t:"4.2 · Inteligencia estratégica — conectar la ejecución con el negocio"},
    {a:"pilares", t:"4.3 · Experimentación — aprender de manera sistemática"},
    {a:"pilares", t:"4.4 · Gestión contextual — lo que pasa fuera de la plataforma"},
    {a:"pilares", t:"4.5 · Documentación y trazabilidad — convertir conocimiento en capacidad"}
  ]},
  {f:"fundamentos", a:"modelo", n:"05—06", t:"Cómo leemos los resultados", items:[
    {a:"modelo",    t:"05 · La ecuación del resultado digital"},
    {a:"variables", t:"6.1 · Variables controlables — presupuesto, segmentación, pujas, medición"},
    {a:"variables", t:"6.2 · Variables influenciables — creatividad, oferta, landing, CRM"},
    {a:"variables", t:"6.3 · Variables externas — estacionalidad, competencia, regulación"}
  ]},
  {f:"operacion", a:"flujo", n:"07", t:"Línea general de trabajo", items:[
    {a:"flujo", t:"7.1 Entrada · 7.2 Clasificación · 7.3 Análisis de contexto"},
    {a:"flujo", t:"7.4 Diagnóstico · 7.5 Definición de acción · 7.6 Ejecución"},
    {a:"flujo", t:"7.7 Control de calidad · 7.8 Activación · 7.9 Monitoreo · 7.10 Aprendizaje"}
  ]},
  {f:"operacion", a:"equipo", n:"08—17", t:"Equipo e interfaces", items:[
    {a:"equipo",     t:"09 · Dirigir el sistema — dirección digital"},
    {a:"equipo",     t:"10 · Conectar y traducir — planner"},
    {a:"equipo",     t:"11 · Operar con criterio — performance / trafficker"},
    {a:"reparto",    t:"12 · Cómo se reparte el trabajo entre Planner y Performance"},
    {a:"interfaces", t:"14—17 · Interfaces con estrategia, creatividad, CRM y cliente"}
  ]},
  {f:"operacion", a:"cuentas", n:"93", t:"Distribución de cuentas", items:[
    {a:"cuentas", t:"Tablero de reparto por persona — se mueve arrastrando las fichas"},
    {a:"cuentas", t:"93.1 · Cómo se lee la carga: campañas, no cuentas"},
    {a:"cuentas", t:"93.2 · Qué no decide este tablero"}
  ]},
  {f:"operacion", a:"inteligencia", n:"18—21", t:"Inteligencia estratégica", items:[
    {a:"inteligencia", t:"18 · Radar de contexto — qué se vigila y con qué frecuencia"},
    {a:"inteligencia", t:"19 · Brief estratégico de activación"},
    {a:"analisis",     t:"20 · Las cuatro preguntas que cierran un análisis"},
    {a:"escenarios",   t:"21 · Tres escenarios: base, favorable y restrictivo"}
  ]},
  {f:"operacion", a:"procesos", n:"22—25 · 42—43", t:"Procesos recurrentes", items:[
    {a:"procesos",       t:"22 · Las tres familias: recurrentes, de control y de reacción"},
    {a:"ciclo",          t:"23 · Ciclo de campaña — las diez estaciones de una vuelta completa"},
    {a:"ciclo",          t:"24 · Cuadro de materiales — qué comunicar, no cuántas piezas"},
    {a:"implementacion", t:"25 · Implementación y tracking — las seis compuertas de QA"},
    {a:"cierres",        t:"42 · Cierre mensual — el informe es una salida del cierre, no el cierre"},
    {a:"cierres",        t:"43 · Cierre de periodo o contrato — continuidad, accesos y aprendizajes"}
  ]},
  {f:"control", a:"control", n:"26—33", t:"Control y alertas", items:[
    {a:"control",            t:"26 · Calculadora de pacing — consumo real contra consumo esperado"},
    {a:"estructura-control", t:"27 · Estructura del control presupuestal — los campos del cuadro"},
    {a:"pacing-integracion", t:"29.3 · Cómo se va a construir el pacing — API, dataLake y tiempo real"},
    {a:"alertas",            t:"30—31 · Sistema de alertas y alertas críticas"},
    {a:"alertas",            t:"32—33 · Qué monitorea una campaña y con qué frecuencia"}
  ]},
  {f:"reaccion", a:"reaccion", n:"34—41", t:"Optimización de performance", items:[
    {a:"reaccion",  t:"34 · Los cuatro momentos: dudar, mirar, mover, registrar"},
    {a:"reaccion",  t:"35 · Etapa 1 — validar la alerta y no optimizar por ruido"},
    {a:"reaccion",  t:"36 · Etapa 2 — negocio, categoría, comercial, creatividad y plataforma"},
    {a:"localizar", t:"37 · Cadena de localización — dónde se rompe el resultado"},
    {a:"hipotesis", t:"38 · Etapa 4 — cómo se escribe una hipótesis"},
    {a:"hipotesis", t:"40—41 · Observación y registro de cierre"},
    {a:"acciones",  t:"39 · Acciones según diagnóstico"}
  ]},
  {f:"operacion", a:"solicitudes", n:"94", t:"Cómo se nos solicitan las cosas", items:[
    {a:"solicitudes", t:"94.0 · Los cinco datos que trae cualquier solicitud"},
    {a:"solicitudes", t:"94.8 · Qué pasa si falta algo: se devuelve, no se ejecuta a medias"},
    {a:"requisitos",  t:"94.1 · Propuesta o tema estratégico — brief, meta y línea base"},
    {a:"requisitos",  t:"94.2 · Implementación de campaña — fechas, presupuesto, piezas y medición"},
    {a:"requisitos",  t:"94.3 · Materiales o piezas — mensaje, cantidades y aprobación"},
    {a:"requisitos",  t:"94.4 · Informe — objetivo, KPIs y periodo de comparación"},
    {a:"requisitos",  t:"94.5 · Presupuesto o proyección — periodo, supuestos y escenarios"},
    {a:"requisitos",  t:"94.6 · Optimización — qué se detectó, desde cuándo y con qué evidencia"},
    {a:"requisitos",  t:"94.7 · Incendio — qué está roto y qué está en riesgo"},
    {a:"requisitos",  t:"Plantilla de solicitud lista para copiar"}
  ]},
  {f:"reaccion", a:"optimizacion", n:"86—92", t:"Proceso de optimización · pauta", items:[
    {a:"priorizacion",     t:"86 · Sistema de priorización de solicitudes y tiempos de gestión"},
    {a:"ruta",             t:"87 · Ruta de la solicitud — de la recepción al cierre"},
    {a:"seguimiento",      t:"88 · Ciclo de seguimiento: bitácora y consumos"},
    {a:"testeo",           t:"89 · Proceso de testeo de variables digitales"},
    {a:"matriz",           t:"90 · Matriz de fusión de variables y combinador"},
    {a:"ejemplo",          t:"91 · Ejemplo de planteamiento de optimización"},
    {a:"estructura-medio", t:"92 · Estructura de campaña en Meta y en Google"}
  ]},
  {f:"reaccion", a:"playbooks", n:"44—57", t:"Playbooks de reacción", items:[
    {a:"playbooks",    t:"44—45 · Los cuatro momentos de un playbook"},
    {a:"playbooks",    t:"46 · Ficha estándar de playbook"},
    {a:"playbooks",    t:"47 · Niveles de severidad: crítica, relevante y seguimiento"},
    {a:"playbooks",    t:"49 · Primera respuesta"},
    {a:"arbol",        t:"50 · Árbol de diagnóstico — recórrelo respondiendo"},
    {a:"criterio",     t:"52—53 · Qué sí hacer y qué no hacer"},
    {a:"criterio",     t:"54 · Escalamiento · 56—57 · Cierre y aprendizaje"},
    {a:"comunicacion", t:"55 · Comunicación: las seis piezas de un mensaje"}
  ]},
  {f:"sistema", a:"sistema", n:"58—81", t:"Sistema documental", items:[
    {a:"sistema",                t:"58—70 · Repositorio por cliente — carpetas 00 a 99"},
    {a:"donde-vive",            t:"58.1 · Dónde vive cada cosa hoy: hojas, repositorios y dashboards"},
    {a:"donde-vive",            t:"58.2—58.3 · Los enlaces viven en el repositorio, no en el framework"},
    {a:"nomenclatura",           t:"71—77 · Nomenclatura y constructor de nombres"},
    {a:"nomenclatura",           t:"72 · Metadatos y estados de documento"},
    {a:"nomenclatura",           t:"73 · Correos · 74 · Jerarquía · 78 · Sin código interno"},
    {a:"nomenclatura",           t:"79—80 · Vista cliente y vista interna de campañas"},
    {a:"nomenclatura-operativa", t:"71.1 · Nomenclatura de carpetas"},
    {a:"nomenclatura-operativa", t:"75.1 · Nomenclatura de objetos en plataforma y públicos"},
    {a:"nomenclatura-operativa", t:"78.1—78.2 · Reglas de conversión y equivalencias"},
    {a:"reglas",                 t:"81 · Las quince reglas no negociables"}
  ]},
  {f:"sistema", a:"ia", n:"95—99", t:"Automatización e IA", items:[
    {a:"ia",           t:"95 · Qué automatizamos y qué no: la herramienta propone, la persona decide"},
    {a:"mediabridge",  t:"96 · Media Bridge: consulta, alertas, presupuesto y agentes"},
    {a:"mediabridge",  t:"96.7 · Dónde queda lo que produce la herramienta"},
    {a:"autonomia",    t:"97 · Los tres niveles de autonomía: consultar, proponer y ejecutar"},
    {a:"auditor",      t:"98 · El rol del auditor: quién responde por lo que produce la IA"},
    {a:"auditor",      t:"98.3 · Los cinco controles del auditor"},
    {a:"auditor",      t:"98.4—98.5 · Cómo se registra lo automatizado y lo rechazado"},
    {a:"riesgos-ia",   t:"99 · Riesgos declarados de automatizar y cómo se controlan"}
  ]},
  {f:"sistema", a:"futuro", n:"83—85", t:"Próximas iteraciones", items:[
    {a:"futuro",         t:"83 · Qué se construye en la versión 0.4"},
    {a:"criterio-exito", t:"84 · Criterio de éxito del framework"},
    {a:"cierre-title",   t:"85 · Principio final"}
  ]}
];

/* 94 · Cómo se nos solicitan las cosas
   Requisitos mínimos de entrada por tipo de solicitud.
   `min` = sin esto la solicitud se devuelve. `des` = mejora el resultado pero no bloquea. */
FD.SOLICITUDES = [
  {c:"94.1", t:"Propuesta o tema estratégico", sale:"Presentación o ruta estratégica", horas:"3 horas",
   pregunta:"¿Qué problema de negocio hay que resolver?",
   min:[
     "Objetivo de negocio: qué tiene que cambiar, no qué entregable se quiere",
     "Problema o pregunta que origina la solicitud",
     "Meta cuantificada y línea base contra la cual se compara",
     "Periodo o vigencia propuesta",
     "Presupuesto disponible o rango de inversión",
     "Audiencia, mercado o producto al que aplica",
     "Quién toma la decisión y para cuándo necesita decidir"
   ],
   des:["Qué se intentó antes y qué resultó","Restricciones legales, de marca o de oferta","Dependencias con Data, CRM, SEO o creatividad","Materiales y activos ya disponibles"],
   conecta:"19 · Brief estratégico · 21 · Tres escenarios · 05—06 · Variables",
   nota:"Sin meta y sin línea base no hay propuesta: hay una lista de tácticas."},

  {c:"94.2", t:"Implementación de campaña", sale:"Reporte de implementación", horas:"3 horas · mismo día",
   pregunta:"¿Se puede construir y medir lo que se pide?",
   min:[
     "Fecha de salida y fecha de cierre",
     "Presupuesto total y su distribución por plataforma",
     "Objetivo de campaña y conversión que se va a medir",
     "Piezas aprobadas: formatos, cantidades y captions definitivos",
     "Landing o destino final, con UTM y medición verificada",
     "Público objetivo o criterio de segmentación",
     "Accesos y permisos activos en las plataformas"
   ],
   des:["Hipótesis que se quiere probar, para separar los conjuntos","Variantes creativas para el testeo A/B","Contacto técnico para resolver tracking","Nomenclatura acordada si difiere del estándar"],
   conecta:"25 · Seis compuertas de QA · 75.1 · Nomenclatura · 92 · Estructura por medio",
   nota:"Sin pieza aprobada o sin landing medible no arranca: la compuerta de QA no abre y la inversión saldría a ciegas."},

  {c:"94.3", t:"Materiales o piezas", sale:"Cuadro de materiales", horas:"2 horas",
   pregunta:"¿Qué hay que comunicar y para cuándo?",
   min:[
     "Qué se quiere comunicar: el mensaje, no la cantidad de piezas",
     "Cantidad requerida por formato y por plataforma",
     "Fecha en que se necesita y fecha de aprobación del cliente",
     "Si es pieza nueva o adaptación de material existente",
     "Si se aprueba por muestra (una pieza modelo) o pieza por pieza",
     "Textos obligatorios, legales o disclaimers",
     "Quién aprueba el material"
   ],
   des:["Referencias visuales o campañas anteriores","Ángulos de mensaje que se quieren probar","Vigencia estimada de la pieza","Formatos adicionales para otros canales"],
   conecta:"24 · Cuadro de materiales · 90 · Matriz de variables",
   nota:"Pedir “cinco piezas” no es un requerimiento. Pedir “comunicar el beneficio X a la audiencia Y” sí, y de ahí salen las piezas."},

  {c:"94.4", t:"Informe", sale:"Informe con acciones derivadas", horas:"2 horas",
   pregunta:"¿Qué decisión va a soportar este informe?",
   min:[
     "Objetivo del informe: qué decisión debe habilitar",
     "KPIs que se quieren revisar",
     "Periodo analizado y periodo de comparación",
     "Para quién es: cliente, comité o uso interno",
     "Fecha de entrega"
   ],
   des:["Preguntas concretas que se esperan responder","Nivel de detalle y formato esperado","Si reemplaza o complementa un informe anterior"],
   conecta:"81·06 · Todo informe genera acciones · 37 · Cadena de localización",
   nota:"Un informe sin decisión asociada se convierte en un reporte de cifras que nadie usa."},

  {c:"94.5", t:"Presupuesto o proyección", sale:"Flow, forecast y ejecutados", horas:"2 horas",
   pregunta:"¿Con qué supuestos vamos a proyectar?",
   min:[
     "Periodo que cubre la proyección",
     "Monto disponible o meta de resultado esperada",
     "Canales y plataformas que se deben considerar",
     "Supuestos que se aceptan como válidos",
     "Restricciones de distribución o topes por canal"
   ],
   des:["Histórico de consumo y resultados comparables","Escenarios requeridos: base, favorable y restrictivo","Fechas de corte para revisión"],
   conecta:"26—29 · Control presupuestal · 21 · Escenarios · 81·02 · Toda proyección declara supuestos",
   nota:"Una proyección sin supuestos declarados no se puede evaluar después: no se sabe si falló el plan o el supuesto."},

  {c:"94.6", t:"Optimización", sale:"Bitácora de optimización", horas:"2 horas · mismo día",
   pregunta:"¿Qué se detectó y desde cuándo?",
   min:[
     "Qué se detectó y desde qué fecha",
     "Dato o evidencia que respalda la observación",
     "Cuenta, campaña o conjunto afectado",
     "Qué se espera lograr con el cambio"
   ],
   des:["Hipótesis de por qué está pasando","Si hubo cambios recientes de oferta, precio o creatividad","Restricciones para mover presupuesto o audiencia"],
   conecta:"34—41 · Ruta de reacción · 89 · Testeo de variables",
   nota:"Antes de mover se valida que la desviación sea real: la mitad de las urgencias son ruido."},

  {c:"94.7", t:"Incendio", sale:"Respuesta y acciones inmediatas", horas:"1 hora",
   pregunta:"¿Qué está roto y qué está en riesgo?",
   min:[
     "Qué está fallando y desde cuándo",
     "Impacto observado: inversión, entrega, marca o datos",
     "Quién lo reporta y por qué canal",
     "Si hay riesgo de gasto sin control o de exposición pública"
   ],
   des:["Capturas o evidencia del error","Si ya se intentó alguna acción y cuál"],
   conecta:"30—31 · Alertas críticas · 47 · Severidad S1 · 49 · Primera respuesta",
   nota:"Un incendio se contiene primero y se explica después. Lo que no se puede saltar es dejarlo registrado."}
];

/* 37 · Cadena de localización: reemplaza al embudo de diagnóstico.
   Se recorre en orden y se detiene en el primer eslabón que falla. */
FD.LOCALIZAR = [
  {n:"1", t:"Entrega",    q:"¿La campaña está saliendo y compitiendo?",    m:"Impresiones · alcance · CPM · pacing",
   falla:"El problema es de presupuesto, puja o arquitectura. La campaña no alcanza a competir en la subasta."},
  {n:"2", t:"Atención",   q:"¿La audiencia sigue respondiendo al mensaje?", m:"CTR · frecuencia · visualizaciones",
   falla:"Fatiga o mensaje agotado. Es creatividad, no medios: renovar piezas antes de mover presupuesto."},
  {n:"3", t:"Tráfico",    q:"¿El clic llega y con qué calidad?",           m:"CPC · sesiones · rebote · tiempo en sitio",
   falla:"Hay desajuste entre lo que promete el anuncio y lo que encuentra el usuario al llegar."},
  {n:"4", t:"Conversión", q:"¿El usuario completa la acción?",             m:"CVR · formularios · checkout · eventos",
   falla:"La afectación empieza después del clic: landing, formulario, UX o medición mal configurada."},
  {n:"5", t:"Calidad",    q:"¿La conversión vale para el negocio?",        m:"Lead calificado · contactabilidad · venta",
   falla:"El volumen no es el problema. Lo es el perfil que estamos atrayendo o la gestión comercial del lead."},
  {n:"6", t:"Contexto",   q:"¿Cambió algo fuera de la campaña?",           m:"Demanda · competencia · calendario · oferta",
   falla:"No hay nada que optimizar en plataforma. Hay que ajustar expectativa, estrategia u oferta y comunicarlo."}
];
