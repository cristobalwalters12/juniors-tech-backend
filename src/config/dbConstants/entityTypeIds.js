const ROLE_TYPES = {
  USER: {
    id: '2SbUCqylYo',
    name: 'usuario'
  },
  MOD: {
    id: '8h5NIrFj4K',
    name: 'moderador'
  },
  ADMIN: {
    id: 'iBM3mRqi3F',
    name: 'administrador'
  }
}

const ASPECT_TYPES = {
  POST: 'pOcG-XWN58',
  COMMENT: 'm6udpXPOt6'
}

const REPORT_TYPES = {
  POST: {
    id: 'eXx8aFdM6E',
    table: 'aspect',
    column: 'aspect_id'
  },
  COMMENT: {
    id: 'FciMP7nq18',
    table: 'aspect',
    column: 'aspect_id'
  },
  USER: {
    id: 'aSRB2RNW9K',
    table: 'user',
    column: 'user_id'
  }
}

const REPORT_ACTIONS = {
  DEACTIVATE_ACCOUNT: 'toUoxwUTrg',
  IGNORE_REPORT: 'J9s14lchjO',
  DELETE_COMMENT: 'b5lHGSAcTV',
  DELETE_POST: 'rIDwcR6GbB',
  MUTE_USER: '4BhmLIjTLQ'
}

const REPORT_REASONS = {
  SPAM: 'FWLo2VXNHE',
  INAPPROPIATE_CONTENT: 'a90dtRdfEP',
  HARASSMENT: 'QSz3vzQtz2',
  OTHER: 'ASU6wJFZJ8'
}

export { REPORT_TYPES, ASPECT_TYPES, ROLE_TYPES, REPORT_ACTIONS, REPORT_REASONS }
